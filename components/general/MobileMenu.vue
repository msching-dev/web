<script setup lang="ts">
const { toggleMobileMenu, appVersionInfo } = useHelpers();
</script>

<template>
  <div class="bg-white flex flex-col max-w-lg shadow-lg top-0 bottom-0 left-0 w-9/12 z-50 fixed overflow-x-hidden">
    <div class="relative w-full h-[130px]">
      <CloseIcon class="absolute right-[22px] bottom-[29px] shadow-sm" @click="toggleMobileMenu(false)" />
    </div>
    <MainMenu class="flex flex-col text-gray-500" />
    <div class="mt-auto text-center p-8 text-[10px] text-gray-400">
      <a href="/" :title="appVersionInfo">ms.ching v{{ appVersionInfo }}</a>
    </div>
  </div>
</template>