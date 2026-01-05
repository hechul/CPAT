<template>
  <div class="p-4">
    <header class="flex justify-between items-center border-b pb-2 mb-4">
      <h1 class="text-2xl font-bold">
        <NuxtLink to="/">나의 앱</NuxtLink>
      </h1>
      <nav>
        <div v-if="user" class="flex items-center space-x-4">
          <span>{{ user.email }}</span>
          <button @click="handleLogout" class="btn bg-red-500 hover:bg-red-700">
            로그아웃
          </button>
        </div>
        <div v-else>
          <NuxtLink to="/login" class="btn">로그인</NuxtLink>
        </div>
      </nav>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const router = useRouter();

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error logging out:', error);
    return;
  }
  // Redirect to the login page after successful logout
  router.push('/login');
};
</script>

<style>
/* Basic styling for buttons, can be improved with Tailwind */
.btn {
  padding: 8px 16px;
  background-color: #3490dc;
  color: white;
  border-radius: 4px;
  text-decoration: none;
}
</style>