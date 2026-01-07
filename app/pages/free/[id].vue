<script setup lang="ts">
import type { Post, Comment } from '~/types'

const { fetchPost, deletePost } = useBoard()
const { currentUser, loadUser, isOwner } = useAuth()
const { fetchComments: fetchBoardComments, createComment, deleteComment: deleteBoardComment } = useComments()
const route = useRoute()
const router = useRouter()

const postId = Number(route.params.id)
const post = ref<Post | null>(null)
const comments = ref<Comment[]>([])
const newComment = ref('')
const loading = ref(true)
const errorMsg = ref('')

// 권한 체크
const canDeletePost = computed(() => {
  if (!post.value) return false
  return isOwner(post.value.user_id)
})

const canDeleteComment = (commentUserId: string) => {
  return isOwner(commentUserId) || canDeletePost.value
}

onMounted(async () => {
  await loadUser()

  try {
    const data = await fetchPost('free', postId)
    if (!data) {
      errorMsg.value = '게시글을 찾을 수 없습니다.'
    } else {
      post.value = data
      await fetchComments()
    }
  } catch (e: any) {
    errorMsg.value = e.message
  } finally {
    loading.value = false
  }
})

const fetchComments = async () => {
  try {
    comments.value = await fetchBoardComments('free', postId)
  } catch (e) {
    console.error(e)
  }
}

const submitComment = async () => {
  if (!currentUser.value) return alert('로그인이 필요합니다.')
  if (!newComment.value.trim()) return
  try {
    await createComment('free', postId, newComment.value)
    newComment.value = ''
    await fetchComments()
  } catch (error: any) {
    alert('댓글 작성 실패: ' + error.message)
  }
}

const handleDeleteComment = async (id: number) => {
  if (!confirm('삭제하시겠습니까?')) return
  try {
    await deleteBoardComment('free', id)
    await fetchComments()
  } catch (error: any) {
    alert(error.message)
  }
}

const handleDeletePost = async () => {
  if(!confirm('정말 삭제하시겠습니까?')) return
  try {
    await deletePost('free', postId)
    router.push('/free')
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
    <div v-else-if="errorMsg" class="text-red-500 text-center py-12">{{ errorMsg }}</div>
    
    <div v-else-if="post">
      <div class="bg-white border border-gray-300 p-4 sm:p-6 mb-6">
        <h1 class="text-xl sm:text-2xl font-normal text-gray-800 mb-2 break-words">{{ post.title }}</h1>
        <div class="text-sm text-gray-500 mb-6 pb-4 border-b border-gray-200 break-words">
          작성자: {{ post.nickname }} | 작성일: {{ formatDate(post.created_at) }} | 조회수: {{ post.view_count }}
        </div>
        <div class="whitespace-pre-wrap min-h-[100px] text-gray-800 leading-relaxed mb-8">{{ post.content }}</div>
        
        <div class="flex flex-col sm:flex-row sm:justify-between gap-3 border-t border-gray-200 pt-4">
          <NuxtLink to="/free" class="px-4 py-2 border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 w-full sm:w-auto text-center">목록</NuxtLink>
          <ClientOnly>
            <button v-if="canDeletePost" @click="handleDeletePost" class="px-4 py-2 border border-gray-300 text-sm text-red-600 hover:bg-red-50 w-full sm:w-auto">삭제</button>
          </ClientOnly>
        </div>
      </div>

      <div class="bg-white border border-gray-300 p-4 sm:p-6">
        <h3 class="text-lg font-normal text-gray-700 mb-6">댓글 {{ comments.length }}</h3>
        <div v-if="comments.length > 0" class="space-y-5 mb-8">
          <div v-for="c in comments" :key="c.id" class="border-b border-gray-100 pb-4">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-2">
              <span class="font-bold text-gray-700 text-sm break-words">{{ c.nickname }}</span>
              <span class="text-xs text-gray-400">{{ formatDate(c.created_at) }}</span>
            </div>
            <p class="text-gray-600 text-sm mb-2 whitespace-pre-wrap break-words">{{ c.content }}</p>
            <ClientOnly>
              <div v-if="canDeleteComment(c.user_id)">
                 <button @click="handleDeleteComment(c.id)" class="px-2 py-1 border border-gray-300 text-xs text-red-500 hover:bg-red-50">삭제</button>
              </div>
            </ClientOnly>
          </div>
        </div>
        
        <div class="border-t border-gray-200 pt-6">
          <template v-if="currentUser">
            <textarea v-model="newComment" class="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-indigo-500 mb-3" rows="4" placeholder="댓글을 입력하세요"></textarea>
            <div class="flex flex-col sm:flex-row sm:justify-end gap-2">
              <button @click="submitComment" class="bg-gray-500 text-white px-4 py-2 text-sm hover:bg-gray-600 w-full sm:w-auto">댓글 작성</button>
            </div>
          </template>
          <template v-else>
             <div class="bg-gray-50 p-4 text-center text-sm text-gray-500">댓글을 작성하려면 <NuxtLink to="/login" class="text-blue-600 underline">로그인</NuxtLink>이 필요합니다.</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>