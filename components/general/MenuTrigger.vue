<script setup lang="ts">
const { toggleMobileMenu } = useHelpers()
</script>

<template>
  <div>
    <NuxtImg src="/images/menuburger.png" class="mr-4 cursor-pointer" @click="toggleMobileMenu" />
  </div>
</template>