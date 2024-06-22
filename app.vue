<script setup lang="ts">
const { isShowingMobileMenu, toggleMobileMenu } = useHelpers()
const { addBodyClass, removeBodyClass } = useHelpers()

const closeCartAndMenu = () => {
  toggleMobileMenu(false)
}

watch([isShowingMobileMenu], () => {
  isShowingMobileMenu.value
    ? addBodyClass('overflow-hidden')
    : removeBodyClass('overflow-hidden')
})
</script>
<template>
  <div class="flex flex-col h-dvh">
    <AppHeader />

    <Transition name="slide-from-left">
      <MobileMenu v-if="isShowingMobileMenu" />
    </Transition>

    <NuxtPage />

    <!-- overlay -->
    <Transition name="fade">
      <div
        v-if="isShowingMobileMenu"
        class="fixed inset-0 z-40 fixed bg-black/20 backdrop-blur-sm"
        @click="closeCartAndMenu"
      />
    </Transition>

    <BackToTopButton />

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

/* Slide-from-right & Slide-from-left */
.slide-from-right-leave-active,
.slide-from-right-enter-active,
.slide-from-left-leave-active,
.slide-from-left-enter-active {
  transition: transform 300ms ease-in-out;
}

.slide-from-right-enter-from,
.slide-from-right-leave-to {
  transform: translateX(500px);
}

.slide-from-left-enter-from,
.slide-from-left-leave-to {
  transform: translateX(-500px);
}
</style>
