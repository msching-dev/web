<script setup lang="ts">
const { type } = defineProps<{ type: 'home' | 'login' }>()

const bannerSrc = computed(() => {
  switch (type) {
    case 'home':
      return '/images/banner/home.png'
    case 'login':
      return '/images/banner/login.png'
    default:
      return '/images/banner.png'
  }
})
</script>
<template>
  <div class="relative mx-auto">
    <NuxtImg
      class="object-cover w-full h-auto"
      :src="bannerSrc"
      width="786"
      height="438"
      alt="banner"
      loading="eager"
      fetchpriority="high"
      preload
      :placeholder="[786, 438]"
      placeholder-class="blur-xl"
    />
  </div>
</template>
