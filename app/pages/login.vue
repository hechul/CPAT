<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

// 이미 로그인되어 있으면 홈으로 리다이렉트
watchEffect(() => {
  if (user.value) {
    router.push('/')
  }
})

const handleLogin = async () => {
  try {
    loading.value = true
    errorMsg.value = ''
    
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (error) throw error
    // 성공 시 watchEffect에 의해 자동 이동됨
  } catch (error: any) {
    errorMsg.value = error.message || '로그인에 실패했습니다.'
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = async () => {
  try {
    loading.value = true
    const redirectTo = window.location.origin
    console.log('Attempting Google Login...', { redirectTo })

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    })
    
    if (error) {
      console.error('Google Login Error:', error)
      throw error
    }
    console.log('Google Login Initiated:', data)

  } catch (error: any) {
    console.error('Catch Error:', error)
    errorMsg.value = '구글 로그인 실패: ' + (error.message || '알 수 없는 오류')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-6 sm:space-y-8 bg-white p-6 sm:p-10 border border-gray-300">
      <div>
        <h2 class="text-center text-xl font-normal text-gray-700">
          로그인
        </h2>
      </div>
      
      <!-- Error Alert -->
      <div v-if="errorMsg" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
        {{ errorMsg }}
      </div>

      <div class="mt-8 space-y-6">
        <button 
          @click="handleGoogleLogin"
          type="button"
          class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          Google 계정으로 계속하기
        </button>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">
              또는
            </span>
          </div>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input 
              v-model="email"
              id="email" 
              name="email" 
              type="email" 
              autocomplete="email" 
              required 
              class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
              placeholder="이메일을 입력하세요" 
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input 
              v-model="password"
              id="password" 
              name="password" 
              type="password" 
              required 
              class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
              placeholder="비밀번호를 입력하세요" 
            />
          </div>

          <div>
            <button 
              type="submit" 
              :disabled="loading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="loading">로그인 중...</span>
              <span v-else>이메일로 계속하기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
