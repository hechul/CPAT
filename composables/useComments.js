export const useComments = () => {
  const client = useSupabaseClient()
  const comments = ref([]) 

  // 1. 댓글 목록 가져오기
  const fetchComments = async (postId) => {
    const { data, error } = await client
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true }) 

    if (error) console.error(error)
    else comments.value = data
  }

  // 2. 댓글 작성하기
  const createComment = async (postId, content) => {
    const { data: { user } } = await client.auth.getUser()
    if (!user) return alert('로그인이 필요합니다.')

    const { data, error } = await client
      .from('comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        email: user.email,
        content: content
      })
      .select()
      .single()

    if (error) {
      alert('댓글 작성 실패: ' + error.message)
    } else {
      if (data) comments.value.push(data) // 화면에 즉시 추가
    }
  }

  // ✅ 3. 댓글 삭제하기 (이 부분이 중요합니다!)
  const deleteComment = async (commentId) => {
    const confirmDelete = confirm('댓글을 삭제하시겠습니까?')
    if (!confirmDelete) return

    const { error } = await client
      .from('comments')
      .delete()
      .eq('id', commentId)

    if (error) {
      alert('삭제 실패: ' + error.message)
    } else {
      // 화면 목록에서 해당 댓글만 쏙 빼서 갱신 (새로고침 불필요)
      comments.value = comments.value.filter(c => c.id !== commentId)
    }
  }

  return {
    comments,
    fetchComments,
    createComment,
    deleteComment // 👈 꼭 반환해줘야 합니다!
  }
}