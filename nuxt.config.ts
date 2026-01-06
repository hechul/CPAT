// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  // 🚨 핵심 수정: 소스 경로를 app/ 폴더로 명시적 지정
  srcDir: 'app/',
  
  modules: ['@nuxtjs/supabase', '@nuxtjs/tailwindcss'],
  
  supabase: {
    redirect: false,
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY
  }
})