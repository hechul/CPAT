<script setup>
// [1] 부모(index.vue)로부터 받아올 데이터 정의
const props = defineProps(['post', 'currentUserId'])

// [2] 삭제 기능 사용을 위해 usePosts 가져오기
const { deletePost } = usePosts()

// [현업 필수] 삭제 로딩 상태
const isDeleting = ref(false)

const handleDelete = async () => {
  if (isDeleting.value) return // 이미 삭제 중이면 무시
  
  isDeleting.value = true
  try {
    await deletePost(props.post.id)
  } catch (e) {
    console.error(e)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <li class="post-item">
    <div class="post-header-row">
      <!-- 작성자 이메일 -->
      <strong>{{ post.email }}</strong>
      
      <!-- 본인 글 삭제 버튼 -->
      <button 
        v-if="currentUserId === post.user_id" 
        @click="handleDelete"
        class="delete-btn"
        :disabled="isDeleting"
      >
        {{ isDeleting ? '삭제 중...' : '삭제' }}
      </button>
    </div>

    <!-- 내용 -->
    <p class="post-content">{{ post.content }}</p>

    <!-- 이미지 -->
    <div v-if="post.image_url" class="image-preview">
      <img :src="post.image_url" alt="업로드된 사진" />
    </div>
    
    <!-- 날짜 (post_created 사용) -->
    <small class="post-date">
      {{ new Date(post.post_created).toLocaleString() }}
    </small>
    
    <!-- 댓글 컴포넌트 포함 -->
    <CommentSection 
      :postId="post.id"
      :currentUserId="currentUserId" 
    />
  </li>
</template>

<style scoped>
/* 기존 index.vue에 있던 게시글 관련 스타일을 그대로 가져옴 */
.post-item { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.post-header-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
.delete-btn { color: #ef4444; background: none; border: none; cursor: pointer; font-weight: bold; }
.image-preview { margin-top: 10px; margin-bottom: 10px; }
.image-preview img { max-width: 100%; border-radius: 8px; max-height: 400px; object-fit: cover; }
.post-date { color: #9ca3af; font-size: 0.8rem; }
</style>