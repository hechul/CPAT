<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const loading = ref(false)
const errorMsg = ref('')

// 이미 로그인되어 있으면 홈으로 리다이렉트
watchEffect(() => {
  if (user.value) {
    router.push('/')
  }
})

const handleSignup = async () => {
  if (password.value !== passwordConfirm.value) {
    errorMsg.value = '비밀번호가 일치하지 않습니다.'
    return
  }

  try {
    loading.value = true
    errorMsg.value = ''
    
    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value
    })

    if (error) throw error
    
    alert('가입 확인 메일을 발송했습니다. 이메일을 확인해주세요.')
    router.push('/login')
    
  } catch (error: any) {
    errorMsg.value = error.message || '회원가입에 실패했습니다.'
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
    if (error) throw error
  } catch (error: any) {
    alert(error.message)
  }
}
</script>

<template>
  <div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-10 border border-gray-300">
      <div>
        <h2 class="text-center text-xl font-normal text-gray-700">
          회원가입
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

        <form @submit.prevent="handleSignup" class="space-y-4">
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
            <label for="password-confirm" class="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
            <input 
              v-model="passwordConfirm"
              id="password-confirm" 
              name="password-confirm" 
              type="password" 
              required 
              class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
              placeholder="비밀번호를 다시 입력하세요" 
            />
          </div>

          <div>
            <button 
              type="submit" 
              :disabled="loading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="loading">가입 중...</span>
              <span v-else>계정 만들기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
