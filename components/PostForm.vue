<script setup>
const { createPost, uploadImage } = usePosts()

const content = ref('')
const selectedFile = ref(null)
const fileInput = ref(null)
// [현업 필수] 중복 클릭 방지용 상태 변수
const isSubmitting = ref(false)

// 파일 선택 핸들러
const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0]
}

// 등록 핸들러
const handleSubmit = async () => {
  if (!content.value.trim()) return
  // 이미 제출 중이면 함수 실행 막기 (방어 코드)
  if (isSubmitting.value) return

  isSubmitting.value = true // 잠금 시작

  try {
    let imageUrl = null

    // 1. 이미지 업로드
    if (selectedFile.value) {
      imageUrl = await uploadImage(selectedFile.value)
    }

    // 2. 게시글 저장
    await createPost(content.value, imageUrl)
    
    // 3. 초기화
    content.value = ''
    selectedFile.value = null
    if (fileInput.value) fileInput.value.value = '' 

  } catch (e) {
    alert('오류가 발생했습니다.')
    console.error(e)
  } finally {
    isSubmitting.value = false // 잠금 해제 (성공하든 실패하든 무조건 실행)
  }
}
</script>

<template>
  <div class="write-container">
    <textarea 
      v-model="content" 
      placeholder="무슨 일이 있었나요?" 
      rows="3"
      :disabled="isSubmitting"
    ></textarea>
    
    <div class="action-row">
      <input 
        type="file" 
        ref="fileInput"
        @change="handleFileChange" 
        accept="image/*" 
        :disabled="isSubmitting"
      />
      <!-- 로딩 중이면 버튼 회색으로 변하고 클릭 불가 -->
      <button 
        @click="handleSubmit" 
        :disabled="isSubmitting"
        :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }"
      >
        {{ isSubmitting ? '저장 중...' : '등록' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 기존 index.vue 스타일 이동 */
.write-container { margin-bottom: 30px; display: flex; flex-direction: column; gap: 10px; }
textarea { padding: 12px; border: 1px solid #e5e7eb; resize: none; border-radius: 8px; width: 100%; box-sizing: border-box; outline: none; }
textarea:focus { border-color: #3b82f6; }

.action-row { display: flex; justify-content: space-between; align-items: center; }
.action-row button { background: #2563eb; color: white; border: none; padding: 8px 24px; border-radius: 8px; cursor: pointer; font-weight: bold; }
.action-row button:hover { background: #1d4ed8; }
</style>