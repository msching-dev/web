<script setup lang="ts">
</script>
<template>
  <div class="flex flex-col h-dvh">
    <AppHeader />

    <!-- <Transition name="slide-from-right">
      <LazyCart v-if="isShowingCart" />
    </Transition> -->

    <!-- <Transition name="slide-from-left">
      <MobileMenu v-if="isShowingMobileMenu" />
    </Transition> -->

    <NuxtPage />

    <LazyAppFooter />
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
</style>
