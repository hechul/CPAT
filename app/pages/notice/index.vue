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
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
      <h1 class="text-2xl font-normal text-gray-700">공지사항</h1>
      <NuxtLink to="/notice/write" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 text-sm font-medium transition-colors w-full sm:w-auto text-center">
        글쓰기
      </NuxtLink>
    </div>

    <div class="bg-white border-t border-gray-200 relative min-h-[200px]">
      <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <span class="text-gray-500 font-medium">공지사항을 불러오는 중...</span>
      </div>

      <!-- Mobile: card list -->
      <div class="md:hidden divide-y divide-gray-200">
        <div v-if="!isLoading && posts.length === 0" class="px-4 py-12 text-center text-gray-500">
          등록된 공지사항이 없습니다.
        </div>
        <NuxtLink
          v-for="post in posts"
          :key="post.id"
          :to="`/notice/${post.id}`"
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
