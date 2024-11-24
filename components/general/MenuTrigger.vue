<script setup lang="ts">
const { toggleMobileMenu } = useHelpers()
</script>

<template>
  <div>
    <NuxtImg src="/images/menuburger.png" class="cursor-pointer" @click="toggleMobileMenu" />
  </div>
</template>