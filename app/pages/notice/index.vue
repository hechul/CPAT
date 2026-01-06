<script setup lang="ts">
const { fetchPosts } = useBoard()
const route = useRoute()
const router = useRouter()

const page = computed(() => Number(route.query.page) || 1)
const limit = 10

const { data, status, error } = await useAsyncData(
  'notice-posts-' + page.value,
  () => fetchPosts('notice', page.value, limit),
  { watch: [page], lazy: true }
)

const posts = computed(() => data.value?.posts || [])
const isLoading = computed(() => status.value === 'pending')

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  })
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-normal text-gray-700">공지사항</h1>
      <NuxtLink to="/notice/write" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 text-sm font-medium transition-colors">
        글쓰기
      </NuxtLink>
    </div>

    <div v-if="isLoading" class="text-center py-12 text-gray-500">로딩 중...</div>

    <div v-else class="bg-white border-t border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-sm font-normal text-gray-500 tracking-wider w-1/2">제목</th>
            <th scope="col" class="px-6 py-3 text-left text-sm font-normal text-gray-500 tracking-wider">작성자</th>
            <th scope="col" class="px-6 py-3 text-left text-sm font-normal text-gray-500 tracking-wider">작성일</th>
            <th scope="col" class="px-6 py-3 text-left text-sm font-normal text-gray-500 tracking-wider">조회</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
           <tr v-if="posts.length === 0">
            <td colspan="4" class="px-6 py-12 text-center text-gray-500">등록된 공지사항이 없습니다.</td>
          </tr>
          <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <NuxtLink :to="`/notice/${post.id}`" class="text-sm text-gray-900 hover:underline">{{ post.title }}</NuxtLink>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ post.nickname }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(post.created_at) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ post.view_count }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
