import type { Post } from '~/types'
import { getBoardTables, type BoardType } from './boardTables'

export const createBoardQueries = (supabase: any) => {
  // 목록 조회
  const fetchPosts = async (type: BoardType, page: number = 1, limit: number = 10) => {
    const { postsTable, commentsTable } = getBoardTables(type)
    const from = (page - 1) * limit
    const to = from + limit - 1

    try {
      const { data, count, error } = await supabase
        .from(postsTable)
        .select(`*, profiles:user_id(nickname)${commentsTable ? `, ${commentsTable}(count)` : ''}`, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) throw error
      if (!data) return { posts: [], count: 0 }

      const formattedData = data.map((post: any) => ({
        ...post,
        nickname: post.nickname || post.profiles?.nickname || 'Unknown',
        comment_count: commentsTable ? (post[commentsTable]?.[0]?.count || 0) : 0
      }))

      return { posts: formattedData as Post[], count: count || 0 }
    } catch (err) {
      console.error('Fetch Error:', err)
      return { posts: [], count: 0 }
    }
  }

  // 상세 조회 (조회수 증가 포함)
  const fetchPost = async (type: BoardType, id: number) => {
    const { postsTable } = getBoardTables(type)
    try {
      // 1. 조회수 증가 (비동기)
      supabase.rpc('increment_view_count', { table_name: postsTable, row_id: id }).then(({ error }: any) => {
        if (error) console.warn('View count error:', error.message)
      })

      // 2. 데이터 조회
      const { data, error } = await supabase
        .from(postsTable)
        .select('*, profiles:user_id(nickname)')
        .eq('id', id)
        .single()

      if (error) throw error
      return { ...data, nickname: data.nickname || data.profiles?.nickname } as Post
    } catch (err) {
      console.error('Fetch Post Error:', err)
      return null
    }
  }

  return { fetchPosts, fetchPost }
}
