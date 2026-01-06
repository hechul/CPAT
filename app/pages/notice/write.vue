<script setup lang="ts">
const { createPost } = useBoard()
const router = useRouter()

const title = ref('')
const content = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  if (!title.value.trim() || !content.value.trim()) {
    errorMessage.value = '제목과 내용을 모두 입력해주세요.'
    return
  }

  try {
    isSubmitting.value = true
    errorMessage.value = ''
    await createPost('notice', title.value, content.value, null)
    router.push('/notice')
  } catch (error: any) {
    errorMessage.value = `등록 실패: ${error.message}`
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="max-w-4xl mx-auto bg-white border border-gray-300 p-8">
      <h1 class="text-xl font-normal text-gray-700 mb-8">공지사항 작성</h1>
      <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded border border-red-200">{{ errorMessage }}</div>
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">제목</label>
          <input v-model="title" type="text" class="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500" placeholder="제목을 입력하세요">
        </div>
        <div>
           <label class="block text-sm font-medium text-gray-700 mb-2">내용</label>
           <textarea v-model="content" class="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500 h-64" placeholder="내용을 입력하세요"></textarea>
        </div>
        <div class="flex justify-end space-x-3 pt-4">
          <NuxtLink to="/notice" class="px-6 py-2 border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">취소</NuxtLink>
          <button @click="handleSubmit" :disabled="isSubmitting" class="px-6 py-2 bg-gray-500 text-white text-sm hover:bg-gray-600 disabled:opacity-50">
            {{ isSubmitting ? '등록 중...' : '등록' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
