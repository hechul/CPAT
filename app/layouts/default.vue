<script setup lang="ts">
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const router = useRouter()

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/')
}
// r
// 닉네임 추출 (이메일 앞부분)
const nickname = computed(() => {
  if (!user.value?.email) return '사용자'
  return user.value.email.split('@')[0]
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:justify-between md:h-16 md:items-center py-3 md:py-0 gap-3">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center justify-between">
            <NuxtLink to="/" class="text-2xl font-bold text-gray-800">커뮤니티</NuxtLink>
          </div>

          <!-- Nav Links (desktop) -->
          <nav class="hidden md:flex space-x-8">
            <NuxtLink to="/" class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">홈</NuxtLink>
            <NuxtLink to="/free" class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">자유게시판</NuxtLink>
            <NuxtLink to="/gallery" class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">갤러리</NuxtLink>
            <NuxtLink to="/notice" class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">공지사항</NuxtLink>
          </nav>

          <!-- Auth Buttons -->
          <div class="flex items-center gap-2 sm:gap-4 flex-wrap">
            <ClientOnly>
              <template v-if="user">
                <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <div class="flex items-center">
                    <div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-white mr-2">
                      <!-- Avatar placeholder -->
                    </div>
                    <span class="text-sm font-medium text-gray-700">{{ nickname }}</span>
                  </div>
                  <button 
                    @click="handleLogout"
                    class="bg-white hover:bg-gray-50 text-gray-800 px-3 sm:px-4 py-2 rounded border border-gray-300 text-sm font-medium transition-colors"
                  >
                    로그아웃
                  </button>
                </div>
              </template>
              <template v-else>
                <NuxtLink to="/login" class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 sm:px-4 py-2 rounded border border-gray-300 text-sm font-medium transition-colors">
                  로그인
                </NuxtLink>
                <NuxtLink to="/signup" class="bg-white hover:bg-gray-50 text-gray-800 px-3 sm:px-4 py-2 rounded border border-gray-300 text-sm font-medium transition-colors">
                  회원가입
                </NuxtLink>
              </template>
              <template #fallback>
                <div class="h-9 w-20 bg-gray-200 rounded animate-pulse"></div>
              </template>
            </ClientOnly>
          </div>

          <!-- Nav Links (mobile) -->
          <nav class="flex md:hidden gap-2 overflow-x-auto pb-1">
            <NuxtLink to="/" class="whitespace-nowrap text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">홈</NuxtLink>
            <NuxtLink to="/free" class="whitespace-nowrap text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">자유게시판</NuxtLink>
            <NuxtLink to="/gallery" class="whitespace-nowrap text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">갤러리</NuxtLink>
            <NuxtLink to="/notice" class="whitespace-nowrap text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">공지사항</NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>
