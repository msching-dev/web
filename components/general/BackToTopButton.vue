<script setup lang="ts">
const nuxtApp = useNuxtApp()
const { scrollToTop } = useHelpers()
const isVisible = ref(false)

const toggleVisibility = () => {
  if (window.scrollY > 250) {
    isVisible.value = true
  } else {
    isVisible.value = false
  }
}

nuxtApp.hook('app:mounted', () => {
  window.addEventListener('scroll', toggleVisibility)
})

onUnmounted(() => {
  window.removeEventListener('scroll', toggleVisibility)
})
</script>

<template>
  <transition name="fade-up">
    <div
      v-show="isVisible"
      @click="scrollToTop"
      class="fixed bottom-[186px] right-[5%] p-3 bg-[#EEE4D9]/30 backdrop-blur-md flex items-center justify-center rounded-full shadow-lg cursor-pointer transition-opacity duration-300 hover:backdrop-blur-xl hover:shadow-xl z-40"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 19 19"
        fill="none"
        class="stroke-[#88735F]"
      >
        <path
          d="M5.44042 11.7702L9.90851 7.30212L14.3766 11.7702"
          stroke="#88735F"
          stroke-width="1.78723"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </transition>
</template>

<style scoped>
.fade-up-enter-active, .fade-up-leave-active {
  @apply transition-all duration-300 ease-out;
}
.fade-up-enter-from {
  @apply opacity-0 translate-y-5;
}
.fade-up-enter-to {
  @apply opacity-100 translate-y-0;
}
.fade-up-leave-from {
  @apply opacity-100 translate-y-0;
}
.fade-up-leave-to {
  @apply opacity-0 translate-y-5;
}
</style>
