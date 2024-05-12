<script lang="ts" setup>

useSeoMeta({
  title: 'Coming Soon | MS. CHING 蜜絲晴烘焙手作坊',
  ogTitle: 'Coming Soon | MS. CHING 蜜絲晴烘焙手作坊',
  description: '即將推出，追蹤我們的社交平台，掌握最新資訊。',
  ogDescription: '即將推出，追蹤我們的社交平台，掌握最新資訊。'
})

</script>

<!-- Home -->
<template>
  <dev class="flex flex-col min-h-screen bg-[#FDFCF8]">
    <header class="flex items-center justify-center py-3"><Logo /></header>
    <main class="relative flex-1 flex flex-col">
      <div
        class="z-10 relative grow pt-14 text-black text-5xl font-bold leading-snug text-center"
      >
        <NuxtImg
          class="absolute top-10 left-0 w-14"
          src="/images/soon/border_1.png"
        />
        <h1>即將推出</h1>
        <h1>COMING</h1>
        <h1>SOON !</h1>
        <NuxtImg
          class="-z-[1] absolute inset-0 mx-auto breathing w-10/12 sm:w-[300px]"
          src="/images/soon/ellipse.png"
        />
        <NuxtImg class="absolute top-1/2 right-0 w-13" src="/images/soon/border_2.png" />
      </div>
      <div class="relative flex flex-col items-center px-4 pt-12 py-5">
        <span class="text-slate-800 text-3xl text-center leading-snug">
          追蹤我們的社交平台，掌握最新資訊。
        </span>
        <div class="container flex justify-center py-3"><div class="w-8 border-2 border-t border-primary-20 rounded-full"/></div>
        <NuxtImg class="absolute -top-3 left-0 w-16" src="/images/soon/border_3.png" />
        <div class="flex gap-4 mt-3">
          <NuxtLink to="https://www.instagram.com/msching_2022/"
            ><NuxtImg src="/images/footer/icon_ig.png" class=""
          /></NuxtLink>
          <NuxtLink to="https://www.instagram.com/msching_2022/"
            ><NuxtImg src="/images/footer/icon_line.png" class=""
          /></NuxtLink>
        </div>
      </div>
    </main>
    <footer>
      <p class="p-6 text-xs text-center font-normal text-gray-500">
        Copyright © 2024 msching.com 保留所有權利
      </p>
    </footer>
  </dev>
</template>

<style scoped>
@keyframes breathing {
  0% {
    -webkit-transform: scale(0.9);
    -ms-transform: scale(0.9);
    transform: scale(0.9);
  }

  25% {
    -webkit-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
  }

  60% {
    -webkit-transform: scale(0.9);
    -ms-transform: scale(0.9);
    transform: scale(0.9);
  }

  100% {
    -webkit-transform: scale(0.9);
    -ms-transform: scale(0.9);
    transform: scale(0.9);
  }
}

@import url(http://fonts.googleapis.com/earlyaccess/cwtexhei.css);

main {
  font-family: 'cwTeXYen', sans-serif;
}

.breathing {
  -webkit-animation: breathing 5s infinite;
  animation: breathing 5s infinite;
}


</style>
