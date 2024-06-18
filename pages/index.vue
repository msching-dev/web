<script lang="ts" setup>
const { setProducts } = useProducts()
const { data: products, error } = await useFetch<Product[]>('/api/products')
setProducts(products.value as Product[])
console.log('productsData', products)

useSeoMeta({
  title: 'MS. CHING 蜜絲晴烘焙手作坊',
  ogTitle: 'MS. CHING 蜜絲晴烘焙手作坊',
  description: '入口即是愛的滋味，不定時限時限量手作甜點',
  ogDescription: '入口即是愛的滋味，不定時限時限量手作甜點',
  ogUrl: 'https://msching.com',
  ogImage: '/images/logo_c.png',
  twitterCard: 'summary_large_image',
})

const selectedCategory = ref(Category.Hot)

const categoriesTabs = [
  { label: '熱賣中', value: Category.Hot },
  { label: '餅乾', value: Category.Cookie },
  { label: '瑪德蓮', value: Category.Madeleine },
  { label: '節慶禮盒', value: Category.Festival },
]
function onTabChange(index: number) {
  console.log('index', index)
  selectedCategory.value = categoriesTabs[index]?.value
}

const filteredProducts = computed(() => {
  const order: Tag[] = ['hot', 'new', 'top_1', 'top_2', 'top_3']

  if (!products.value) return []
  return products.value
    ?.filter((product) => product.categories?.includes(selectedCategory.value))
    .sort((a, b) => order.indexOf(a.tag) - order.indexOf(b.tag))
})
</script>

<!-- Home -->
<template>
  <main>
    <!-- Banner -->
    <Banner />

    <!-- Category / Items -->
    <section class="container my-8">
      <div class="text-center my-6 text-[#4C3232] text-2xl font-extrabold">
        產品分類
      </div>
      <div class="container px-4">
        <UTabs
          :items="categoriesTabs"
          :ui="{
            wrapper: 'mt-2',
            list: {
              background: 'bg-transparent',
              marker: {
                shadow: 'shadow-none',
              },
            },
            tab: {
              active: 'text-[#2C9AF0] font-semibold',
              inactive: 'text-[#B8B8B8] font-semibold',
              size: 'text-base',
            },
          }"
          @change="onTabChange"
        >
          <template #default="{ item, selected }">
            <div :class="{ 'underline underline-offset-4': selected }">
              {{ item.label }}
            </div>
          </template>
          <template #item>
            <div
              class="grid justify-center grid-cols-2 gap-5 mt-8 md:grid-cols-3 lg:grid-cols-6"
            >
              <ProductCard
                v-for="product in filteredProducts"
                :key="product.key"
                class="w-full"
                :node="product"
              />
            </div>
          </template>
        </UTabs>
      </div>

      <!-- <div class="mt-[7px] p-8 flex justify-between flex-wrap">
        <div
          class="w-[48%] rounded shadow-lg h-[240px] mt-4 relative flex justify-center"
        >
          <NuxtImg
            class="absolute z-10 right-2 top-[14px]"
            src="/images/products/common/top_1.png"
          />
          <NuxtImg
            class="absolute z-10 top-[18px]"
            src="/images/products/earlGaryTeaMadeleine.png"
          />
          <NuxtImg
            class="absolute z-0 top-[18px]"
            src="/images/products/common/card_bg.png"
          />
          <div
            class="absolute left-[14px] bottom-10 text-4 font-semibold text-[#4C3232]"
          >
            伯爵茶
          </div>
          <NuxtImg
            class="absolute right-3 bottom-12 w-[30px] h-[30px]"
            src="/images/products/common/buy.png"
          />
          <UDivider class="absolute bottom-8 px-2" />
          <div
            class="absolute bottom-[6px] flex justify-between w-[100%] px-2 items-center"
          >
            <div>
              <span
                class="text-[#B8B8B8] font-semibold text-[12px] line-through"
                >$70</span
              >
              <span class="text-[#4C3232] text-4 font-semibold ml-1">$60</span>
            </div>
            <div class="text-[#B8B8B8] font-semibold text-[12px]">高貴</div>
          </div>
        </div>
      </div> -->
    </section>
  </main>
</template>

<style scoped></style>
