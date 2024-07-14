<script setup lang="ts">
const route = useRoute()

const slug = route.params.slug as string
</script>
<template>
  <div class="text-center my-6 text-primary-900 text-2xl font-extrabold">
    {{ slug }}
  </div>
</template>
