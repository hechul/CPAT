<script setup>
// 새로 만든 useAuth 사용
const { signUp, signIn, signInGoogle } = useAuth()

const email = ref('')
const password = ref('')
const isSignUp = ref(false)
</script>

<template>
  <div class="container">
    <h1>🔑 {{ isSignUp ? '회원가입' : '로그인' }}</h1>
    
    <div class="box">
      <input v-model="email" type="email" placeholder="이메일 입력" />
      <input v-model="password" type="password" placeholder="비밀번호 입력" />
      
      <div v-if="!isSignUp" class="btn-group">
        <button @click="signIn(email, password)" class="btn blue">로그인</button>
        <button @click="signInGoogle" class="btn google">Google 로그인</button>
      </div>

      <div v-else>
        <button @click="signUp(email, password)" class="btn green">회원가입 하기</button>
      </div>

      <p class="toggle-text" @click="isSignUp = !isSignUp">
        {{ isSignUp ? '이미 계정이 있나요? 로그인하기' : '계정이 없나요? 회원가입하기' }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.container { max-width: 400px; margin: 50px auto; text-align: center; font-family: sans-serif; }
.box { display: flex; flex-direction: column; gap: 10px; }
input { padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
.btn { padding: 10px; border: none; border-radius: 5px; cursor: pointer; color: white; font-weight: bold; }
.blue { background: #007bff; }
.green { background: #28a745; }
.google { background: #db4437; }
.btn-group { display: flex; gap: 5px; flex-direction: column; }
.toggle-text { cursor: pointer; color: #666; font-size: 14px; text-decoration: underline; margin-top: 15px; }
</style>