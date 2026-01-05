// composables/usePosts.js
export const usePosts = () => {
  const client = useSupabaseClient()
  const posts = ref([])

  // 1. 목록 가져오기
  const fetchPosts = async () => {
    const { data, error } = await client
      .from('posts')
      .select('*')
      .order('post_created', { ascending: false })
    
    if (data) posts.value = data
    if (error) console.error(error)
  }

  // 2. 글 쓰기
  const createPost = async (content) => {
    const { data: { user } } = await client.auth.getUser()
    if (!user) return alert('로그인이 필요합니다.')
    
    const { error } = await client.from('posts').insert({
      user_id: user.id,
      email: user.email,
      content: content
    })
    
    if (error) alert('글쓰기 실패: ' + error.message)
    else await fetchPosts()
  }

  // ✅ 3. 게시글 삭제 (새로 추가된 부분!)
  const deletePost = async (id) => {
    const confirmDelete = confirm('정말 이 게시글을 삭제하시겠습니까?')
    if (!confirmDelete) return

    const { error } = await client
      .from('posts')
      .delete()
      .eq('id', id)

    if (error) {
      alert('삭제 실패: ' + error.message)
    } else {
      // DB 삭제 성공하면, 화면 목록에서도 즉시 제거 (새로고침 불필요)
      posts.value = posts.value.filter(post => post.id !== id)
      alert('삭제되었습니다.')
    }
  }

  return {
    posts,
    fetchPosts,
    createPost,
    deletePost // ✅ 꼭 반환에 포함시켜주세요
  }
}