<script setup>
import { Skeleton } from '@/components/ui/skeleton'
</script>

<template>
  <div
    class="grid justify-center grid-cols-2 gap-5 mt-8 md:grid-cols-3 lg:grid-cols-6 animate-in fade-in"
  >
    <Skeleton
      v-for="index in 4"
      :key="index"
      class="rounded-xl w-full aspect-[0.675] shadow-[0_1.905px_10.142px_0px_rgba(185,159,133,0.2)]"
    />
  </div>
</template>
