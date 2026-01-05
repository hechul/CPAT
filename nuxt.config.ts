// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase', '@nuxtjs/tailwindcss'],
  
  supabase: {
    // 로그인 후 리다이렉트될 주소 (보통 홈으로)
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/'], // 홈은 누구나 접근 가능하게 하려면 추가
    }
  },

  // (선택) 빌드 시 최적화
  devtools: { enabled: true }
})