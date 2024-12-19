<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const orderNumber = route.params.orderSlug
</script>
<template>
  <main class="flex flex-col flex-1 p-6">
    <div
      class="flex flex-col justify-center border-[1px] border-solid border-[#DECCB8] rounded-[4px] p-4"
    >
      <div class="flex justify-center items-center text-xl font-bold text-[#A38669] text-center">
        <UIcon name="i-heroicons-bell-alert-20-solid" class="w-5 h-5 mr-2" />
         <span>您已完成訂購</span>
         <UIcon name="i-heroicons-bell-alert-20-solid" class="w-5 h-5 ml-2" />
      </div>
      <div
        class="flex flex-col mt-4 text-lg font-bold text-[#9D9D9D] space-y-2"
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
        <div class="flex justify-between space-x-2 !mt-[40px]">
          <button
            @click=""
            class="flex flex-1 items-center justify-center space-x-2 rounded-[4px] text-sm text-[#FFFFFF] bg-[#9D9D9D] font-semibold p-2 cursor-pointer"
          >
            <UButton
              color="white"
              variant="link"
              icon="i-heroicons-magnifying-glass-20-solid"
              :padded="false"
              @click=""
            />
            <div>訂單查詢</div>
          </button>
          <button
            @click=""
            class="flex flex-1 items-center justify-center space-x-2 rounded-[4px] text-sm text-[#FFFFFF] bg-[#4C3232] font-semibold p-2 cursor-pointer"
          >
            <UButton
              color="white"
              variant="link"
              icon="i-heroicons-shopping-cart-20-solid"
              :padded="false"
              @click=""
            />
            <div>繼續購物</div>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
<style scoped></style>
