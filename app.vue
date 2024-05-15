<script setup lang="ts">
const onResize = () => {
  document.documentElement.style.setProperty(
    '--100vh',
    `${window.innerHeight}px`
  )
  console.log('Resized', window.innerHeight)
}

onMounted(() => {
  onResize()
  window.addEventListener('resize', onResize, true)
})
</script>
<template>
  <div class="app">
    <!-- <AppHeader /> -->

    <!-- <Transition name="slide-from-right">
      <LazyCart v-if="isShowingCart" />
    </Transition> -->

    <!-- <Transition name="slide-from-left">
      <MobileMenu v-if="isShowingMobileMenu" />
    </Transition> -->

    <NuxtPage />

    <!-- <LazyAppFooter /> -->
  </div>
</template>
<style lang="postcss">
html,
body {
  @apply bg-white;
  scroll-behavior: smooth;
}

img {
  image-rendering: crisp-edges;
  image-rendering: -webkit-optimize-contrast;
}


.app {
  @apply flex flex-col;
  height: 100vh; /* fallback for Js load */
  height: var(--100vh);
}
</style>
