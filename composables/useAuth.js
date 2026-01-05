// composables/useAuth.js
export const useAuth = () => {
  const client = useSupabaseClient()
  const user = useSupabaseUser()
  const router = useRouter()

  // 1. 이메일 회원가입
  const signUp = async (email, password) => {
    const { error } = await client.auth.signUp({ email, password })
    if (error) alert('가입 에러: ' + error.message)
    else alert('📧 가입 완료! (이메일 인증이 꺼져있다면 바로 로그인하세요)')
  }

  // 2. 이메일 로그인
  const signIn = async (email, password) => {
    const { error } = await client.auth.signInWithPassword({ email, password })
    if (error) alert('로그인 실패: ' + error.message)
    else router.push('/') // 로그인 성공 시 홈으로
  }

  // 3. 구글 로그인 (계정 선택 옵션 포함)
  const signInGoogle = async () => {
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account' 
        }
      }
    })
    if (error) alert('구글 로그인 에러: ' + error.message)
  }

  // 4. 로그아웃
  const signOut = async () => {
    await client.auth.signOut()
    router.push('/login')
  }

  // user 상태와 함수들을 반환
  return {
    user,
    signUp,
    signIn,
    signInGoogle,
    signOut
  }
}