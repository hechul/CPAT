<script setup>
/**
 * [필수 모듈 가져오기]
 * - client: Supabase 서버와 직접 통신하기 위한 도구 (ID 확인용)
 * - useAuth, usePosts: 미리 만들어둔 기능 뭉치들 (로그아웃, 게시글 CRUD)
 */
const client = useSupabaseClient()
const { signOut } = useAuth()
const { posts, fetchPosts, createPost, deletePost } = usePosts()

// 화면 상태를 관리하는 변수들
const content = ref('')       // 글쓰기 입력창 내용
const myUserId = ref(null)    // 현재 로그인한 내 진짜 ID (삭제 권한 확인용)
const myEmail = ref('')       // 화면에 보여줄 내 이메일

// [페이지 로딩 시 실행]
onMounted(async () => {
  // 1. 게시글 목록을 먼저 불러옵니다.
  await fetchPosts()

  // 2. [핵심] 현재 로그인한 유저 정보를 서버에 직접 물어봐서 가져옵니다.
  // (자동 변수 user에 의존하면 가끔 타이밍 문제로 ID가 비어있을 수 있어서, 이 방식이 제일 확실합니다.)
  const { data: { user } } = await client.auth.getUser()
  
  if (user) {
    myUserId.value = user.id      // 내 ID 저장 (이게 있어야 삭제 버튼이 보임)
    myEmail.value = user.email    // 내 이메일 저장
  }
})

// [글 등록 함수]
const handlePost = async () => {
  if (!content.value.trim()) return // 빈 내용이면 무시
  await createPost(content.value)
  content.value = '' // 입력창 초기화
}

// [글 삭제 함수]
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

      <div class="write-box">
        <textarea 
          v-model="content" 
          placeholder="무슨 일이 있었나요? 자유롭게 적어보세요." 
          rows="3"
        ></textarea>
        <button @click="handlePost">등록</button>
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
          
          <small class="post-date">
            {{ new Date(post.post_created).toLocaleString() }}
          </small>
          
          <CommentSection :postId="post.id"
          :currentUserId="myUserId" />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* 전체 레이아웃 */
.container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: sans-serif; color: #333; }

/* 로그인 경고창 */
.login-alert { text-align: center; margin-top: 100px; }
.link { color: #2563eb; font-weight: bold; text-decoration: none; font-size: 1.1rem; }
.link:hover { text-decoration: underline; }

/* 헤더 */
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid #f3f4f6; }
.user-info { font-weight: 600; color: #1f2937; }
.logout-btn { background: #9ca3af; color: white; border: none; padding: 6px 12px; cursor: pointer; border-radius: 6px; font-size: 0.85rem; transition: background 0.2s; }
.logout-btn:hover { background: #6b7280; }

/* 글쓰기 박스 */
.write-box { display: flex; gap: 10px; margin-bottom: 30px; }
textarea { flex: 1; padding: 12px; border: 1px solid #e5e7eb; resize: none; border-radius: 8px; outline: none; transition: border 0.2s; }
textarea:focus { border-color: #3b82f6; }
.write-box button { background: #2563eb; color: white; border: none; padding: 0 24px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: background 0.2s; }
.write-box button:hover { background: #1d4ed8; }

/* 게시글 목록 */
.post-list { list-style: none; padding: 0; }
.post-item { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }

/* 게시글 내부 요소 */
.post-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.delete-btn { background: transparent; color: #ef4444; border: none; cursor: pointer; font-size: 0.9rem; font-weight: 600; padding: 4px 8px; border-radius: 4px; }
.delete-btn:hover { background: #fef2f2; }
.post-content { margin-bottom: 10px; line-height: 1.5; white-space: pre-wrap; }
.post-date { color: #9ca3af; font-size: 0.8rem; display: block; margin-bottom: 15px; }
</style>