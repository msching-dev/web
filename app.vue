<script setup lang="ts">
const route = useRoute()
const { isShowingMobileMenu, toggleMobileMenu } = useHelpers()
const { addBodyClass, removeBodyClass } = useHelpers()

const closeMenu = () => {
  toggleMobileMenu(false)
}

watch([isShowingMobileMenu], () => {
  isShowingMobileMenu.value
    ? addBodyClass('overflow-hidden')
    : removeBodyClass('overflow-hidden')
})

watch(
  () => [route.path, route.query.category],
  async () => {
    await nextTick()
    closeMenu()
  }
)
</script>
<template>
  <div class="flex flex-col h-dvh">
    <AppHeader />

    <Transition name="slide-from-left">
      <MobileMenu v-show="isShowingMobileMenu" />
    </Transition>

    <NuxtPage />

    <!-- overlay -->
    <Transition name="fade">
      <div
        v-show="isShowingMobileMenu"
        class="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        @click="closeMenu"
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

.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}


/* custom scrollbar */
:root {
  --scrollbar-primary: #f0ece4;
  --scrollbar-secondary: #ccbba5;
}
/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-secondary) var(--scrollbar-primary);
}
/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 15px;
}

*::-webkit-scrollbar-track {
  background: var(--scrollbar-primary);
  border-radius: 5px;
}
*::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-secondary);
  border-radius: 14px;
  border: 3px solid var(--scrollbar-primary);
}
</style>
