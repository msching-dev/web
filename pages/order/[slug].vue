<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const orderNumber = route.params.slug
</script>
<template>
  <main class="container flex flex-col py-6">
    <div
      class="flex flex-col justify-center border-[1px] border-solid border-[#DECCB8] rounded-xl p-4"
    >
      <div
        class="flex justify-center items-center text-xl font-bold text-[#A38669] text-center"
      >
        <UIcon name="i-heroicons-bell-alert-20-solid" class="w-5 h-5 mr-2" />
        <span>您已完成訂購</span>
        <UIcon name="i-heroicons-bell-alert-20-solid" class="w-5 h-5 ml-2" />
      </div>
      <div
        class="flex flex-col mt-4 text-base font-bold text-[#9D9D9D] space-y-2"
      >
        <span>
          <HighlightedText :text="`訂單編號：##${orderNumber}##`" />
        </span>
        <span>
          <HighlightedText :text="`訂單金額：##NT$123元##`" />
        </span>
        <span>
          <HighlightedText :text="`取件方式：##全家店到店##`" />
        </span>
        <span>
          <HighlightedText :text="`取件店鋪：##龍騰店##`" />
        </span>
      </div>
    </div>

    <div class="flex items-center justify-between space-x-10 mt-10">
      <UButton
        color="black"
        variant="solid"
        icon="i-heroicons-magnifying-glass-20-solid"
        size="xl"
        label="訂單查詢"
        :ui="{
          base: 'flex-grow justify-center',
          color: {
            black: {
              solid: 'text-white bg-[#9D9D9D] hover:bg-[#9D9D9D]/90',
            },
          },
        }"
      >
      </UButton>
      <UButton
        color="black"
        variant="solid"
        icon="i-heroicons-shopping-cart-20-solid"
        size="xl"
        label="繼續購物"
        :ui="{
          base: 'flex-grow justify-center',
          color: {
            black: {
              solid: 'text-white bg-[#4C3232] hover:bg-[#4C3232]/90',
            },
          },
        }"
      />
    </div>
  </main>
</template>
