import { createBoardQueries } from './boardQueries'
import { createBoardMutations } from './boardMutations'

export const useBoard = () => {
  const supabase = useSupabaseClient()

  return {
    ...createBoardQueries(supabase),
    ...createBoardMutations(supabase)
  }
}
