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

  // [수정] 게시글 쓰기 함수 (이미지 URL도 같이 받도록 수정)
  const createPost = async (content, imageUrl = null) => { // imageUrl 추가됨
    const { data: { user } } = await client.auth.getUser()
    if (!user) return alert('로그인이 필요합니다.')

    const { error } = await client.from('posts').insert({
      user_id: user.id,
      email: user.email,
      content: content,
      image_url: imageUrl // 👈 DB에 주소 저장!
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

  // [신규 기능] 📸 이미지 업로드 함수
  const uploadImage = async (file) => {
    // 1. 파일 이름이 겹치지 않게 '현재시간_파일명'으로 만듭니다.
    // 예: 1721000000_cat.jpg
    const fileName = `${Date.now()}_${file.name}`

    // 2. Storage(images 버킷)에 파일을 업로드합니다.
    const { data, error } = await client.storage
      .from('images') // 아까 만든 버킷 이름
      .upload(fileName, file)

    if (error) {
      console.error('업로드 실패:', error)
      return null
    }

    // 3. 업로드 성공하면, 그 파일의 '공개 주소(URL)'를 받아옵니다.
    const { data: publicUrlData } = client.storage
      .from('images')
      .getPublicUrl(fileName)

    // 4. 주소를 반환합니다. (DB에 넣기 위해)
    return publicUrlData.publicUrl
  }
  return {
    posts,
    fetchPosts,
    createPost,
    deletePost,
    uploadImage // 👈 밖에서 쓸 수 있게 내보내기
  }
}