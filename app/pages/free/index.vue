<script setup lang="ts">
const { fetchPosts } = useBoard()
const route = useRoute()
const router = useRouter()

const page = computed(() => Number(route.query.page) || 1)
const limit = 10

const { data, status, error } = await useAsyncData(
  'free-posts-' + page.value, 
  () => fetchPosts('free', page.value, limit),
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  })
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
      <h1 class="text-2xl font-normal text-gray-700">자유게시판</h1>
      <NuxtLink to="/free/write" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 text-sm font-medium transition-colors w-full sm:w-auto text-center">
        글쓰기
      </NuxtLink>
    </div>

    <div v-if="error" class="mb-6 p-4 bg-red-50 text-red-700 rounded border border-red-200">
      데이터 로드 실패: {{ error.message }}
    </div>

    <div class="bg-white border-t border-gray-200 relative min-h-[200px]">
      <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <span class="text-gray-500 font-medium">게시글을 불러오는 중...</span>
      </div>

      <!-- Mobile: card list -->
      <div class="md:hidden divide-y divide-gray-200">
        <div v-if="!isLoading && posts.length === 0" class="px-4 py-12 text-center text-gray-500">
          작성된 게시글이 없습니다.
        </div>
        <NuxtLink
          v-for="post in posts"
          :key="post.id"
          :to="`/free/${post.id}`"
          class="block px-4 py-4 hover:bg-gray-50"
        >
          <div class="text-sm font-medium text-gray-900 break-words">
            {{ post.title }}
          </div>
          <div class="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
            <span>{{ post.nickname }}</span>
            <span>·</span>
            <span>{{ formatDate(post.created_at) }}</span>
            <span>·</span>
            <span>조회 {{ post.view_count }}</span>
            <span>·</span>
            <span>댓글 {{ post.comment_count }}</span>
          </div>
        </NuxtLink>
      </div>

      <!-- Desktop: table -->
      <table class="hidden md:table min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-sm font-normal text-gray-500 tracking-wider w-1/2">제목</th>
            <th scope="col" class="px-6 py-3 text-left text-sm font-normal text-gray-500 tracking-wider">작성자</th>
            <th scope="col" class="px-6 py-3 text-left text-sm font-normal text-gray-500 tracking-wider">작성일</th>
            <th scope="col" class="px-6 py-3 text-left text-sm font-normal text-gray-500 tracking-wider">조회</th>
            <th scope="col" class="px-6 py-3 text-left text-sm font-normal text-gray-500 tracking-wider">댓글</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="!isLoading && posts.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-gray-500">작성된 게시글이 없습니다.</td>
          </tr>
          <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <NuxtLink :to="`/free/${post.id}`" class="text-sm text-gray-900 hover:underline">{{ post.title }}</NuxtLink>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ post.nickname }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(post.created_at) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ post.view_count }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ post.comment_count }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="totalPages > 1" class="flex flex-wrap justify-center mt-8 gap-2">
      <button @click="goToPage(page - 1)" :disabled="page === 1" class="px-3 py-1 border text-sm disabled:opacity-50">이전</button>
      <button v-for="p in totalPages" :key="p" @click="goToPage(p)" :class="['px-3 py-1 text-sm border', page === p ? 'bg-gray-500 text-white' : 'border-gray-300']">{{ p }}</button>
      <button @click="goToPage(page + 1)" :disabled="page === totalPages" class="px-3 py-1 border text-sm disabled:opacity-50">다음</button>
    </div>
  </div>
</template>
