import type { BoardType } from '~/types'

export type { BoardType } from '~/types'

export const getBoardTables = (type: BoardType) => {
  return {
    postsTable: type === 'free' ? 'free_posts' : (type === 'gallery' ? 'gallery_posts' : 'notice_posts'),
    commentsTable: type === 'free' ? 'free_comments' : (type === 'gallery' ? 'gallery_comments' : null)
  }
}
