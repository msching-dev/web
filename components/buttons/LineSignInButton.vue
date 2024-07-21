<script setup lang="ts"></script>
<template>
  <UButton
    block
    size="lg"
    color="white"
    variant="solid"
    label="用 LINE 帐号登录"
    :ui="{
      color: {
        white: {
          solid:
            'text-white ring-transparent bg-[#06C755] hover:bg-[#05B34C] active:bg-[#048B3B] disabled:bg-white',
        },
      },
    }"
  >
    <template #leading>
      <NuxtImg
        width="24"
        height="24"
        src="/images/line.png"
        class=""
      /> </template
  ></UButton>
</template>
