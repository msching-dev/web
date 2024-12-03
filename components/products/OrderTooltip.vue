<script setup lang="ts">
import { ref } from 'vue'

const { copied, handleCopy } = useOrderTemplate()

const isExpanded = ref(false)

const toggleContent = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div
    class="relative backdrop-blur-xl bg-gradient-to-br from-white to-[#F5EFE6] rounded-xl mt-4 overflow-hidden"
  >
    <!-- 左側強調線 -->
    <div class="absolute left-0 inset-y-1 w-1 bg-primary/70 rounded-l-xl" />

    <!-- 訂購資訊 -->
    <div class="px-4 pt-1 text-base flex flex-col space-y-1">
      <p class="font-semibold">訂購方式：</p>
      <p>
        感謝您對<span class="font-normal text-primary"> 蜜絲晴 </span
        >的支持！目前檔期限定商品僅接受以下方式訂購：
      </p>
      <ul class="list-disc pl-4 space-y-1">
        <li
          class="relative p-2 rounded-xl hover:shadow-md hover:bg-gradient-to-r hover:from-[#F5EFE6]/50 hover:to-transparent transition-all duration-300 ease-in-out"
        >
          官方LINE 或 Instagram 聯繫下單
        </li>
        <li
          class="relative p-2 rounded-xl hover:shadow-md hover:bg-gradient-to-r hover:from-[#F5EFE6]/50 hover:to-transparent transition-all duration-300 ease-in-out"
        >
          訂購時請提供以下資訊：
          <div
            :class="{
              'max-h-0 opacity-0 transform translate-y-[-10px]': !isExpanded,
              'max-h-[9999px] opacity-100 transform translate-y-0': isExpanded,
            }"
            class="overflow-hidden transition-[max-height,opacity,transform] duration-700 ease-in-out"
          >
            <ul class="list-decimal pl-6 mt-2 space-y-1">
              <li>訂購人姓名：</li>
              <li>訂購人手機號碼：</li>
              <li>全家店舖名稱（取貨用）：</li>
              <li>訂購品項與數量：</li>
            </ul>
          </div>

          <!-- 複製按鈕 -->
          <button
            @click="handleCopy"
            class="absolute top-2 right-2 z-10 flex items-center justify-center min-w-8 h-8 px-1 text-[#4C3232]/80 rounded-full hover:text-[#4C3232] transition-all duration-300 ease-in-out"
            :aria-label="copied ? '已複製' : '複製模板'"
          >
            <template v-if="copied">
              <!-- 勾勾圖示與文字 -->
              <div
                class="flex items-center space-x-1 text-[#6FBF73] animate-fade-in"
              >
                <UIcon
                  name="heroicons:check-circle"
                  class="w-6 h-6 animate-pop"
                />
                <span class="text-sm font-medium">已複製</span>
              </div>
            </template>
            <template v-else>
              <!-- 複製圖示 -->
              <UIcon
                name="heroicons:clipboard-document"
                class="w-6 h-6 transition-transform duration-300 hover:scale-110"
              />
            </template>
          </button>
        </li>
      </ul>
      <p class="font-semibold text-sm text-red-500">
        當前付款方式僅支援轉帳，<br />
        確認付款完畢，訂單才算成立哦！
      </p>
    </div>

    <!-- 漸層遮罩 -->
    <div
      v-if="!isExpanded"
      class="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white/90 via-white/75 to-transparent flex items-center justify-center"
    >
      <button
        @click="toggleContent"
        class="flex items-center space-x-2 text-sm text-[#4C3232] font-semibold hover:underline"
      >
        查看更多
        <UIcon
          name="heroicons:chevron-down-20-solid"
          class="w-4 h-4 font-semibold"
        />
      </button>
    </div>

    <!-- 收起內容按鈕 -->
    <div v-else class="flex justify-center items-center p-4">
      <button
        @click="toggleContent"
        class="flex items-center space-x-2 text-sm text-[#4C3232] font-semibold hover:underline"
      >
        收起內容
        <UIcon name="heroicons:chevron-up-20-solid" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
