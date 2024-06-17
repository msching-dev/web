<script setup lang="ts">
const menus = [
  {
    name: '首頁',
    to: '/',
  },
  {
    name: '最新消息',
    to: '/',
  },
  {
    name: '線上訂購',
    to: '/',
  },
  {
    name: '訂購QA/條款',
    to: '/',
  },
  {
    name: '聯繫我們',
    to: '/',
  }
]
</script>

<template>
  <nav>
    <template v-for="(menu, index) in menus" :key="index">
      <UDivider v-if="index < menus.length" size="xs" class="py-0" :ui="{ border: { base: 'border-[#B8B8B8]/20'} }" />
      <NuxtLink :to="menu.to" class="h-[72px] pl-6 flex items-center">
        {{ menu.name }}
      </NuxtLink>
    </template>
  </nav>
</template>
