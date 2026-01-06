export const useAuth = () => {
  const supabase = useSupabaseClient()
  // 로컬 상태로 유저 정보 관리 (반응형 보장)
  const currentUser = useState<any>('currentUser', () => null)

  // 유저 정보 로드 (초기화)
  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    currentUser.value = user
    return user
  }

  // 본인 확인 헬퍼
  const isOwner = (targetUserId: string) => {
    return currentUser.value?.id === targetUserId
  }

  return {
    currentUser,
    loadUser,
    isOwner
  }
}
