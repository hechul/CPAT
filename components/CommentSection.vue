<script setup>
// [1] 부모에게서 받을 데이터 정의 (게시글번호, 내ID)
const props = defineProps(['postId', 'currentUserId'])

const { comments, fetchComments, createComment, deleteComment } = useComments()
const newComment = ref('')

onMounted(() => {
  fetchComments(props.postId)
})

const handleCreate = async () => {
  if (!newComment.value.trim()) return
  await createComment(props.postId, newComment.value)
  newComment.value = ''
}

const handleDelete = async (commentId) => {
  await deleteComment(commentId)
}
</script>

<template>
  <div class="mt-4 pt-4 border-t border-gray-100">
    <div v-if="currentUserId" class="flex gap-2 mb-4">
      <input 
        v-model="newComment" 
        type="text" 
        placeholder="댓글을 입력하세요..." 
        class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-blue-500"
        @keyup.enter="handleCreate"
      />
      <button 
        @click="handleCreate" 
        class="bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        등록
      </button>
    </div>

    <div v-if="comments.length > 0" class="space-y-3">
      <div v-for="comment in comments" :key="comment.id" class="bg-gray-50 p-3 rounded-lg text-sm">
        
        <div class="flex justify-between items-start mb-1">
          <span class="font-bold text-gray-700">{{ comment.email }}</span>
          
          <button 
            v-if="currentUserId && currentUserId === comment.user_id"
            @click="handleDelete(comment.id)"
            class="text-red-400 hover:text-red-600 text-xs font-medium"
          >
            삭제
          </button>
        </div>

        <p class="text-gray-800">{{ comment.content }}</p>
        <span class="text-xs text-gray-400">{{ new Date(comment.created_at).toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>