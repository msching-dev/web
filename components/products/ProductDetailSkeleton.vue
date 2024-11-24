<script setup>
import { Skeleton } from '@/components/ui/skeleton'
</script>

<template>
  <div class="container relative flex flex-col items-start text-[#555555]/85">
    <Skeleton class="h-5 w-36 rounded mt-4" />

    <!-- 產品圖占位 -->
    <Skeleton class="w-full aspect-[358/485] rounded-lg mt-4" />
    <div class="flex w-full aspect-[358/109] items-center space-x-3 mt-4">
      <Skeleton class="aspect-[68/92] flex-1" />
      <Skeleton class="aspect-[68/92] flex-1" />
      <Skeleton class="aspect-[68/92] flex-1" />
      <Skeleton class="aspect-[68/92] flex-1" />
    </div>

    <Skeleton class="h-8 w-3/4 rounded mt-4" />
    <Skeleton class="h-5 w-1/4 rounded mt-2" />
    <Skeleton class="h-6 w-1/2 rounded mt-2" />

    <Skeleton class="h-4 w-full rounded mt-4" />
    <Skeleton class="h-4 w-11/12 rounded mt-2" />
    <Skeleton class="h-4 w-10/12 rounded mt-2" />

    <Skeleton class="h-12 w-full rounded mt-4" />

    <!-- 營養表格占位 -->
    <div class="w-full max-w-md rounded-lg border border-gray-300 mt-3 p-4">
      <Skeleton class="h-5 w-1/2 rounded mb-2" />
      <Skeleton class="h-4 w-full rounded mb-2" />
      <Skeleton class="h-4 w-full rounded mb-2" />
    </div>

    <Skeleton class="h-4 w-10/12 rounded mt-4" />
    <Skeleton class="h-4 w-11/12 rounded mt-2" />
    <Skeleton class="h-4 w-full rounded mt-2" />
    <Skeleton class="h-4 w-3/4 rounded mt-2" />
  </div>
</template>
