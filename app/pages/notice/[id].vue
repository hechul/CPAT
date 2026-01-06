<script setup lang="ts">
import type { Post } from '~/types'

const { fetchPost, deletePost } = useBoard()
const { loadUser, isOwner } = useAuth()
const route = useRoute()
const router = useRouter()

const postId = Number(route.params.id)
const post = ref<Post | null>(null)
const loading = ref(true)

onMounted(async () => {
  await loadUser()

  try {
    const fetchedPost = await fetchPost('notice', postId)
    if (!fetchedPost) {
      alert('존재하지 않거나 삭제된 게시글입니다.')
      router.push('/notice')
      return
    }
    post.value = fetchedPost
  } catch (error) {
    alert('게시글을 불러올 수 없습니다.')
    router.push('/notice')
  } finally {
    loading.value = false
  }
})

const handleDeletePost = async () => {
  if (!confirm('정말 삭제하시겠습니까?')) return
  try {
    await deletePost('notice', postId)
    router.push('/notice')
  } catch (e: any) { alert(e.message) }
}

const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="loading" class="text-center py-12 text-gray-500">로딩 중...</div>
    <div v-else-if="post">
      <div class="bg-white border border-gray-300 p-6 mb-6">
        <h1 class="text-2xl font-normal text-gray-800 mb-2">{{ post.title }}</h1>
        <div class="text-sm text-gray-500 mb-6 pb-4 border-b border-gray-200">
          작성자: {{ post.nickname }} | 작성일: {{ formatDate(post.created_at) }} | 조회수: {{ post.view_count }}
        </div>
        <div class="min-h-[200px] text-gray-800 leading-relaxed mb-8 whitespace-pre-wrap"><p>{{ post.content }}</p></div>
        <div class="flex justify-between border-t border-gray-200 pt-4">
          <NuxtLink to="/notice" class="px-4 py-2 border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">목록</NuxtLink>
          <ClientOnly>
            <div v-if="isOwner(post.user_id)" class="space-x-2">
              <button @click="handleDeletePost" class="px-4 py-2 border border-gray-300 text-sm text-red-600 hover:bg-red-50">삭제</button>
            </div>
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>