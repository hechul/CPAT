<script setup lang="ts">
const { fetchPosts } = useBoard()
const route = useRoute()
const router = useRouter()

const page = computed(() => Number(route.query.page) || 1)
const limit = 12

const { data, status, error } = await useAsyncData(
  'gallery-posts-' + page.value,
  () => fetchPosts('gallery', page.value, limit),
  { watch: [page], lazy: true }
)

const posts = computed(() => data.value?.posts || [])
const totalCount = computed(() => data.value?.count || 0)
const totalPages = computed(() => Math.ceil(totalCount.value / limit))
const isLoading = computed(() => status.value === 'pending')

const goToPage = (p: number) => {
  if (p < 1 || p > totalPages.value) return
  router.push({ query: { page: p } })
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
      <h1 class="text-2xl font-normal text-gray-700">갤러리</h1>
      <NuxtLink to="/gallery/write" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 text-sm font-medium transition-colors w-full sm:w-auto text-center">
        글쓰기
      </NuxtLink>
    </div>
    
    <div v-if="error" class="mb-6 p-4 bg-red-50 text-red-700 rounded border border-red-200">
      데이터 로드 실패: {{ error.message }}
    </div>

    <div v-if="isLoading" class="py-20 text-center text-gray-500">이미지를 불러오는 중...</div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      <div v-if="posts.length === 0" class="col-span-full text-center py-12 text-gray-500">등록된 이미지가 없습니다.</div>
      <div v-for="post in posts" :key="post.id" class="group">
        <NuxtLink :to="`/gallery/${post.id}`" class="block">
          <div class="w-full bg-gray-200 rounded-lg overflow-hidden border border-gray-300 flex items-center justify-center aspect-square">
             <img v-if="post.image_url" :src="post.image_url" class="w-full h-full object-cover group-hover:opacity-75 transition-opacity" />
             <span v-else class="text-gray-400 text-xs">No Image</span>
          </div>
          <h3 class="mt-3 text-sm text-gray-700 truncate font-bold">{{ post.title }}</h3>
          <p class="mt-1 text-xs text-gray-500">{{ post.nickname }} | 조회 {{ post.view_count }}</p>
        </NuxtLink>
      </div>
    </div>

    <div v-if="totalPages > 1" class="flex flex-wrap justify-center mt-12 gap-2">
       <button @click="goToPage(page - 1)" :disabled="page === 1" class="px-3 py-1 border text-sm disabled:opacity-50">이전</button>
       <button v-for="p in totalPages" :key="p" @click="goToPage(p)" :class="['px-3 py-1 text-sm border', page === p ? 'bg-gray-500 text-white' : 'border-gray-300']">{{ p }}</button>
       <button @click="goToPage(page + 1)" :disabled="page === totalPages" class="px-3 py-1 border text-sm disabled:opacity-50">다음</button>
    </div>
  </div>
</template>
