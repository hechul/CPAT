<script setup>
const client = useSupabaseClient()
const { signOut } = useAuth()
const { posts, fetchPosts, createPost, deletePost, uploadImage } = usePosts()

const selectedFile = ref(null) 
const content = ref('')
const myUserId = ref(null) 
const myEmail = ref('')
const fileInput = ref(null) // 파일 선택창 초기화용

onMounted(async () => {
  await fetchPosts()
  const { data: { user } } = await client.auth.getUser()
  if (user) {
    myUserId.value = user.id
    myEmail.value = user.email
  }
})

// ✅ [수정 1] 함수를 onMounted 밖으로 꺼냈습니다. (이제 화면에서 쓸 수 있음!)
const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0]
}

const handlePost = async () => {
  if (!content.value.trim()) return

  let imageUrl = null

  // 1. 파일이 있으면 업로드
  if (selectedFile.value) {
    imageUrl = await uploadImage(selectedFile.value)
  }

  // 2. 글 쓰기
  await createPost(content.value, imageUrl)
  
  // 3. 초기화
  content.value = ''
  selectedFile.value = null
  if (fileInput.value) fileInput.value.value = '' // 파일 선택창 비우기
}

const handleDelete = async (id) => {
  await deletePost(id)
}
</script>

<template>
  <div class="container">
    
    <div v-if="!myUserId" class="login-alert">
      <p>로그인이 필요한 서비스입니다.</p>
      <NuxtLink to="/login" class="link">로그인하러 가기</NuxtLink>
    </div>

    <div v-else>
      <div class="header">
        <span class="user-info">👤 {{ myEmail }}</span>
        <button @click="signOut" class="logout-btn">로그아웃</button>
      </div>

      <div class="write-container">
        <textarea 
          v-model="content" 
          placeholder="무슨 일이 있었나요?" 
          rows="3"
        ></textarea>
        
        <div class="action-row">
          <input 
            type="file" 
            ref="fileInput"
            @change="handleFileChange" 
            accept="image/*" 
          />
          <button @click="handlePost">등록</button>
        </div>
      </div>

      <ul class="post-list">
        <li v-for="post in posts" :key="post.id" class="post-item">
          
          <div class="post-header-row">
            <strong>{{ post.email }}</strong>
            <button 
              v-if="myUserId === post.user_id" 
              @click="handleDelete(post.id)"
              class="delete-btn"
            >
              삭제
            </button>
          </div>

          <p class="post-content">{{ post.content }}</p>

          <div v-if="post.image_url" class="image-preview">
            <img :src="post.image_url" alt="업로드된 사진" />
          </div>
          
          <small class="post-date">
            {{ new Date(post.post_created).toLocaleString() }}
          </small>
          
          <CommentSection 
            :postId="post.id"
            :currentUserId="myUserId" 
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: sans-serif; color: #333; }
.login-alert { text-align: center; margin-top: 100px; }
.link { color: #2563eb; font-weight: bold; }

.header { display: flex; justify-content: space-between; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid #f3f4f6; }
.logout-btn { background: #9ca3af; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; }

/* 글쓰기 영역 스타일 수정 */
.write-container { margin-bottom: 30px; display: flex; flex-direction: column; gap: 10px; }
textarea { padding: 12px; border: 1px solid #e5e7eb; resize: none; border-radius: 8px; width: 100%; box-sizing: border-box; outline: none; }
textarea:focus { border-color: #3b82f6; }

.action-row { display: flex; justify-content: space-between; align-items: center; }
.action-row button { background: #2563eb; color: white; border: none; padding: 8px 24px; border-radius: 8px; cursor: pointer; font-weight: bold; }
.action-row button:hover { background: #1d4ed8; }

.post-list { list-style: none; padding: 0; }
.post-item { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.post-header-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
.delete-btn { color: #ef4444; background: none; border: none; cursor: pointer; font-weight: bold; }

/* 이미지 스타일 */
.image-preview { margin-top: 10px; margin-bottom: 10px; }
.image-preview img { max-width: 100%; border-radius: 8px; max-height: 400px; object-fit: cover; }

.post-date { color: #9ca3af; font-size: 0.8rem; }
</style>