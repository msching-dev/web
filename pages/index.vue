<script lang="ts" setup>
const { products, getCategoryQuery, setCategoryQuery, setProducts, updateProductList } = useProducts()
const { isQueryEmpty } = useHelpers()
const { data: allProducts, error } = await useFetch<Product[]>('/api/products')
setProducts(allProducts.value as Product[])

onMounted(() => {
  if (!isQueryEmpty.value) updateProductList()
})

useSeoMeta({
  title: 'MS. CHING 蜜絲晴烘焙手作坊',
  ogTitle: 'MS. CHING 蜜絲晴烘焙手作坊',
  description: '入口即是愛的滋味，不定時限時限量手作甜點',
  ogDescription: '入口即是愛的滋味，不定時限時限量手作甜點',
  ogUrl: 'https://msching.com',
  ogImage: '/images/logo_c.png',
  twitterCard: 'summary_large_image',
})

const categoriesTabs = [
  { label: '熱賣中', value: Category.Hot },
  { label: '餅乾', value: Category.Cookie },
  { label: '瑪德蓮', value: Category.Madeleine },
  { label: '節慶禮盒', value: Category.Festival },
]

const selectedCategory = computed({
  get () {
    const index = categoriesTabs.findIndex((item) => item.value ===  getCategoryQuery())
    if (index === -1) {
      return 0
    }

    return index
  },
  set(index) {
    setCategoryQuery(categoriesTabs[index].value)
  }
})

const filteredProducts = computed(() => {
  const order: Tag[] = ['hot', 'new', 'top_1', 'top_2', 'top_3']
  const currentCategory = categoriesTabs[selectedCategory.value].value

  if (!products.value) return []
  return products.value
    ?.filter((product) => product.categories?.includes(currentCategory))
    .sort((a, b) => order.indexOf(a.tag) - order.indexOf(b.tag))
})
</script>

<!-- Home -->
<template>
  <main>
    <!-- Banner -->
    <Banner />
    <!-- Search -->
    <ProductSearch />
    <!-- Category / Items -->
    <section class="container my-8">
      <div class="text-center my-6 text-[#4C3232] text-2xl font-extrabold">
        產品分類
      </div>
      <div class="w-full">
        <UTabs
          v-model="selectedCategory"
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
        >
          <template #default="{ item, selected }">
            <div :class="{ 'underline underline-offset-4': selected }">
              {{ item.label }}
            </div>
          </template>
          <template #item>
            <div
              v-if="!!filteredProducts.length"
              key="products"
              class="relative w-full"
            >
              <div
                class="grid justify-center grid-cols-2 gap-5 mt-8 md:grid-cols-3 lg:grid-cols-6 animate-fade-in"
              >
                <ProductCard
                  v-for="product in filteredProducts"
                  :key="product.key"
                  class="w-full"
                  :node="product"
                />
              </div>
            </div>
            <NoProductsFound v-else key="no-products" />
          </template>
        </UTabs>
      </div>
    </section>
  </main>
</template>

<style scoped></style>
