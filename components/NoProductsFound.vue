<script setup lang="ts">
const { allProducts } = useProducts()
const { clearSearchQuery, isSearchActive } = useSearching()

const clearAll = () => {
  if (isSearchActive.value) clearSearchQuery()
}
</script>

<template>
  <div class="w-full my-10">
    <div class="flex flex-col items-center justify-center w-full text-center">
      <NuxtImg
        src="/images/watermark_3.png"
        class="w-[156px] aspect-square mb-10"
        alt="products-not-found"
        loading="lazy"
        placeholder
        placeholder-class="blur-xl shadow-none"
      />

      <h2 class="text-2xl text-primary font-bold">沒有找到相關產品</h2>
      <!-- No products found -->
      <p class="mt-4 text-gray-600">
        <slot>請嘗試調整您的搜索條件來找到您需要的產品。</slot>
        <!-- Try adjusting your search to find what you're looking for. -->
      </p>
      <!-- <div>
        <button
          v-if="allProducts.length"
          class="bg-primary rounded-lg font-bold mt-8 text-center text-white text-sm w-full p-2 px-3 inline-block"
          title="Clear all filters and search"
          aria-label="Clear all filters and search"
          @click="clearAll">
          Clear all
        </button>
      </div> -->
    </div>
  </div>
</template>
