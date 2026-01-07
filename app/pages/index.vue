<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    <!-- Hero Section -->
    <div class="text-center mb-10 sm:mb-24 mt-6 sm:mt-12">
      <h1 class="text-2xl sm:text-4xl lg:text-5xl font-normal text-gray-600 sm:tracking-tight mb-3 sm:mb-4">
        커뮤니티에 오신 것을 환영합니다
      </h1>
      <p class="max-w-xl mx-auto text-base sm:text-lg text-gray-800 font-medium">
        자유롭게 소통하고 정보를 공유하세요
      </p>
    </div>

    <!-- Cards Section -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-6xl mx-auto">
      <NuxtLink to="/free" class="block group">
        <div class="bg-white overflow-hidden border border-gray-300 hover:shadow-lg transition-shadow h-28 sm:h-40 flex items-center justify-center">
          <h3 class="text-lg sm:text-xl font-normal text-gray-600 group-hover:text-blue-600">자유게시판</h3>
        </div>
      </NuxtLink>

      <NuxtLink to="/gallery" class="block group">
        <div class="bg-white overflow-hidden border border-gray-300 hover:shadow-lg transition-shadow h-28 sm:h-40 flex items-center justify-center">
          <h3 class="text-lg sm:text-xl font-normal text-gray-600 group-hover:text-blue-600">갤러리</h3>
        </div>
      </NuxtLink>

      <NuxtLink to="/notice" class="block group">
        <div class="bg-white overflow-hidden border border-gray-300 hover:shadow-lg transition-shadow h-28 sm:h-40 flex items-center justify-center">
          <h3 class="text-lg sm:text-xl font-normal text-gray-600 group-hover:text-blue-600">공지사항</h3>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
