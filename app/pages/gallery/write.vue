<script setup lang="ts">
const { createPost } = useBoard()
const { uploadImage } = useStorage()
const router = useRouter()

const title = ref('')
const content = ref('')
const file = ref<File | null>(null)
const isSubmitting = ref(false)
const errorMessage = ref('')

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    file.value = input.files[0]
  }
}


const handleSubmit = async () => {
  if (!title.value.trim() || !content.value.trim()) {
    errorMessage.value = '제목과 내용을 모두 입력해주세요.'
    return
  }

  try {
    isSubmitting.value = true
    errorMessage.value = ''
    let imageUrl = null
    if (file.value) {
      imageUrl = await uploadImage(file.value)
    }
    await createPost('gallery', title.value, content.value, imageUrl)
    router.push('/gallery')
  } catch (error: any) {
    errorMessage.value = `등록 실패: ${error.message}`
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="max-w-4xl mx-auto bg-white border border-gray-300 p-4 sm:p-8">
      <h1 class="text-xl font-normal text-gray-700 mb-6 sm:mb-8">갤러리 글쓰기</h1>
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
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">이미지 첨부</label>
          <div class="border border-gray-300 p-2 flex items-center gap-3">
            <button class="relative bg-gray-100 border border-gray-300 px-3 py-1 text-xs text-gray-700 overflow-hidden flex-shrink-0">
              파일 선택
              <input type="file" @change="handleFileChange" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer">
            </button>
            <span class="text-sm text-gray-500 min-w-0 flex-1 truncate">{{ file ? file.name : '선택된 파일 없음' }}</span>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row sm:justify-end gap-2 pt-4">
          <NuxtLink to="/gallery" class="px-6 py-2 border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 w-full sm:w-auto text-center">취소</NuxtLink>
          <button @click="handleSubmit" :disabled="isSubmitting" class="px-6 py-2 bg-gray-500 text-white text-sm hover:bg-gray-600 disabled:opacity-50 w-full sm:w-auto">
            {{ isSubmitting ? '등록 중...' : '등록' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
