<script setup lang="ts">
const { allProducts } = useProducts();
const { clearSearchQuery, isSearchActive } = useSearching()

const clearAll = () => {
  if (isSearchActive.value) clearSearchQuery();
};
</script>

<template>
  <div class="w-full my-10">
    <div class="flex flex-col items-center justify-center w-full text-center">
      <Icon name="ion:sad-outline" size="156" class="opacity-25 mb-10" />

      <h2 class="text-2xl font-bold">沒有找到相關產品</h2> <!-- No products found -->
      <p class="mt-4 max-w-xs">
        <slot>請嘗試調整您的搜索條件來找到您需要的產品。</slot> <!-- Try adjusting your search to find what you're looking for. -->
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