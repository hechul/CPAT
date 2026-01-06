import type { Comment, BoardType } from '~/types'

export const useComments = () => {
  const supabase = useSupabaseClient()

  const getTable = (type: BoardType) => {
    if (type === 'notice') throw new Error('공지사항은 댓글을 지원하지 않습니다.')
    return type === 'free' ? 'free_comments' : 'gallery_comments'
  }

  // 댓글 목록 조회
  const fetchComments = async (type: BoardType, postId: number) => {
    const table = getTable(type)
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data as Comment[]
  }

  // 댓글 작성
  const createComment = async (type: BoardType, postId: number, content: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('로그인이 필요합니다.')

    const table = getTable(type)
    const { error } = await supabase
      .from(table)
      .insert({
        post_id: postId,
        content,
        user_id: user.id,
        nickname: user.email?.split('@')[0] || 'User'
      })

    if (error) throw error
  }

  // 댓글 삭제
  const deleteComment = async (type: BoardType, commentId: number) => {
    const table = getTable(type)
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', commentId)

    if (error) throw error
  }

  return { fetchComments, createComment, deleteComment }
}
