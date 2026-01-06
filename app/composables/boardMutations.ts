import { deleteGalleryImageForPost } from './galleryImage'
import { getBoardTables, type BoardType } from './boardTables'

export const createBoardMutations = (supabase: any) => {
  // 글 작성 (이미지 업로드 로직 포함)
  const createPost = async (type: BoardType, title: string, content: string, imageUrl: string | null) => {
    const { postsTable } = getBoardTables(type)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('로그인이 필요합니다.')

    const payload: any = {
      title,
      content,
      user_id: user.id,
      nickname: user.email?.split('@')[0] || 'User'
    }
    if (type === 'gallery' && imageUrl) payload.image_url = imageUrl

    const { data, error } = await supabase.from(postsTable).insert(payload).select().single()
    if (error) throw error
    return data
  }

  // 글 삭제 (이미지 삭제 포함)
  const deletePost = async (type: BoardType, id: number) => {
    const { postsTable } = getBoardTables(type)

    if (type === 'gallery') {
      await deleteGalleryImageForPost(supabase, postsTable, id)
    }

    const { error } = await supabase.from(postsTable).delete().eq('id', id)
    if (error) throw error
  }

  return { createPost, deletePost }
}
