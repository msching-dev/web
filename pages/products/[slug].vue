<script setup lang="ts">
import type { ProductDetail, ProductInfo } from '~/types'

const route = useRoute()
const productKey = route.params.slug as string

const { products, fetchProducts, fetchProductDetail } = useProducts()

const isLoading = ref(true)
const productInfo = ref<Partial<ProductInfo>>()
const productDetail = ref<Partial<ProductDetail> | null>()

onBeforeMount(async () => {
  try {
    if (!!products.value?.length) {
      // 從產品列表中找出特定產品的基本資訊
      productInfo.value = products.value.find(
        (product) => product.key === productKey
      )
    } else {
      // 獲取產品列表
      const _products = await fetchProducts()
      productInfo.value = _products.find(
        (product) => product.key === productKey
      )
    }

    // 根據 productKey 獲取產品詳情
    productDetail.value = await fetchProductDetail(productKey)
  } catch (error) {
    console.error('Failed to fetch product detail data:', error)
  } finally {
    isLoading.value = false
  }
})

// 禮盒營養數據狀態
const giftBoxContentState = computed(() => {
  const content = productDetail.value.giftBoxNutrientContent || []
  const maxColumnCount = Math.ceil(content.length / 2)
  const maxRowCount =
    content.length > 0
      ? Math.max(...content.map((item) => item.content.length))
      : 0
  return {
    hasContent: content.length > 0,
    maxColumnCount,
    maxRowCount,
  }
})
</script>
<template>
  <main class="container relative py-6 xl:max-w-7xl">
    <ProductDetailSkeleton v-if="isLoading" />

    <div v-else class="relative flex flex-col items-start text-[#555555]/85">
      <AppBreadcrumb :current="productInfo.name" class="md:hidden" />

      <div class="flex flex-col gap-8 md:flex-row md:justify-between lg:gap-24">
        <!-- 產品圖 -->
        <UCarousel
          v-if="(productDetail.images?.length || 0) > 0"
          :items="productDetail.images"
          :ui="{
            item: 'basis-full',
            container: 'rounded-lg',
            indicators: {
              wrapper:
                '!flex-none relative bottom-0 items-center justify-center mt-4 grid grid-cols-4 gap-3 overflow-x-auto',
            },
          }"
          indicators
          class="w-full mx-auto mt-4"
        >
          <template #default="{ item }">
            <NuxtImg
              :src="item"
              class="w-full aspect-[358/485"
              alt="product-image"
              loading="lazy"
              placeholder
              placeholder-class="blur-xl shadow-none"
            />
          </template>

          <template #indicator="{ onClick, page, active }">
            <NuxtImg
              :src="productDetail.images?.[page - 1]"
              :alt="`Thumbnail-${page - 1}`"
              class="aspect-[68/92] w-full h-full object-cover rounded-md cursor-pointer"
              :class="{ 'border border-[#B99F85] opacity-60': active }"
              @click="onClick(page)"
            />
          </template>
        </UCarousel>

        <div class="lg:max-w-md xl:max-w-lg md:py-2 w-full">
          <div class="flex flex-col text-2xl font-bold items-start">
            <p class="border-[#B99F85] border-b-[3px] pb-3 flex-grow-0">
              {{ productInfo.name }}
            </p>
            <p class="text-[#B99F85]/40 font-extrabold text-base mt-3">
              {{ productInfo.alias }}
            </p>
            <span class="mt-2">
              {{ `NT＄ ${productInfo.price} 元 / ${productDetail.unit}` }}
              <span class="text-[#555555]/70 text-base font-bold">{{
                productDetail.includeSize
                  ? `( ${productDetail.includeSize} )`
                  : ''
              }}</span>
            </span>
          </div>

          <div class="text-base leading-9 mt-4">
            <p class="font-medium">商品說明：</p>
            <HighlightedText :text="productDetail.descriptions?.desc" />
          </div>

          <!-- TODO: 購物車區塊待實作 -->
          <div class="flex items-center justify-between space-x-4 mt-3">
            <NuxtLink
              class="w-full"
              :to="socialMediaLinks.lineOfficial"
              target="_blank"
            >
              <UButton
                block
                size="lg"
                color="white"
                variant="solid"
                label="前往 LINE 官方"
                :ui="{
                  color: {
                    white: {
                      solid:
                        'h-11 text-white ring-transparent bg-[#06C755] hover:bg-[#05B34C] active:bg-[#048B3B] disabled:bg-white transition duration-300 shadow-transparent hover:scale-[1.02] hover:shadow-[#05B34C]/70',
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
            </NuxtLink>

            <NuxtLink
              class="w-full"
              :to="socialMediaLinks.instagramOfficial"
              target="_blank"
            >
              <UButton
                block
                size="lg"
                color="white"
                variant="solid"
                label="前往 Instagram 官方"
                :ui="{
                  color: {
                    white: {
                      solid:
                        'h-11 text-white ring-transparent bg-gradient-to-l from-[#833ab4] via-[#fd1d1d] to-[#fcb045] transition-all duration-300 disabled:bg-white whitespace-nowrap shadow-transparent hover:scale-[1.02] hover:shadow-red-200',
                    },
                  },
                }"
              >
                <template #leading>
                  <NuxtImg
                    width="20"
                    height="20"
                    src="/images/instagram_white.svg"
                    class=""
                  /> </template
              ></UButton>
            </NuxtLink>
          </div>

          <div class="flex flex-col items-center mt-4">
            <!-- 營養表格 -->
            <div
              class="w-full max-w-xl overflow-hidden rounded-xl border-x border-[#B99F85] mt-3 lg:flex-1/2 lg:flex-shrink-0"
            >
              <table
                class="w-full text-center text-sm text-black/70 border-separate border-spacing-0"
              >
                <thead>
                  <tr>
                    <th
                      :colspan="giftBoxContentState.hasContent ? 4 : 3"
                      class="bg-[#C8A888] text-white text-sm h-10 font-extrabold"
                    >
                      營養成分
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <!-- 每一份量和包裝含 -->
                  <tr>
                    <td colspan="2" class="border-b border-[#D5C1AE] py-2 px-4">
                      每一份量
                    </td>
                    <td
                      :colspan="giftBoxContentState.hasContent ? 2 : 1"
                      class="border-b border-[#D5C1AE] py-2 px-4"
                    >
                      {{ `${productDetail?.portionSize}g` }}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" class="border-b border-[#D5C1AE] py-2 px-4">
                      本包裝含
                    </td>
                    <td
                      :colspan="giftBoxContentState.hasContent ? 2 : 1"
                      class="border-b border-[#D5C1AE] py-2 px-4"
                    >
                      {{
                        productDetail?.giftBoxNutrientContent
                          ? productDetail?.includeSize
                          : `1${productDetail.unit}`
                      }}
                    </td>
                  </tr>

                  <!-- 禮盒: 營養成分 -->
                  <template
                    v-if="giftBoxContentState.hasContent"
                    v-for="columnIndex in giftBoxContentState.maxColumnCount"
                    :key="columnIndex"
                  >
                    <!-- 顯示口味 -->
                    <tr>
                      <td
                        class="border-b-[3px] border-r border-[#D5C1AE] py-2 px-4"
                      >
                        口味
                      </td>
                      <td
                        class="border-b-[3px] border-r border-[#D5C1AE] py-2 px-4 whitespace-nowrap"
                      >
                        {{
                          productDetail.giftBoxNutrientContent[
                            (columnIndex - 1) * 2
                          ]?.taste
                        }}
                      </td>
                      <td
                        class="border-b-[3px] border-r border-[#D5C1AE] py-2 px-4"
                      >
                        口味
                      </td>
                      <td
                        class="border-b-[3px] border-[#D5C1AE] py-2 px-4 whitespace-nowrap"
                      >
                        {{
                          productDetail.giftBoxNutrientContent[
                            (columnIndex - 1) * 2 + 1
                          ]?.taste
                        }}
                      </td>
                    </tr>

                    <!-- 顯示營養數據 -->
                    <tr
                      v-for="rowIndex in giftBoxContentState.maxRowCount"
                      :key="`row-${columnIndex}-${rowIndex}`"
                    >
                      <!-- 第一個禮盒 -->
                      <td class="border-b border-r border-[#D5C1AE] py-2 px-4">
                        {{
                          productDetail.giftBoxNutrientContent[
                            (columnIndex - 1) * 2
                          ]?.content[rowIndex - 1]?.key || ''
                        }}
                      </td>
                      <td class="border-b border-r border-[#D5C1AE] py-2 px-4">
                        {{
                          productDetail.giftBoxNutrientContent[
                            (columnIndex - 1) * 2
                          ]?.content[rowIndex - 1]?.value || ''
                        }}
                      </td>
                      <!-- 第二個禮盒 -->
                      <td class="border-b border-r border-[#D5C1AE] py-2 px-4">
                        {{
                          productDetail.giftBoxNutrientContent[
                            (columnIndex - 1) * 2 + 1
                          ]?.content[rowIndex - 1]?.key || ''
                        }}
                      </td>
                      <td class="border-b border-[#D5C1AE] py-2 px-4">
                        {{
                          productDetail.giftBoxNutrientContent[
                            (columnIndex - 1) * 2 + 1
                          ]?.content[rowIndex - 1]?.value || ''
                        }}
                      </td>
                    </tr>
                  </template>

                  <!-- 其他品項: 每份量和每百克的營養成分 -->
                  <template v-else>
                    <!-- Column headers for per serving and per 100 grams -->
                    <tr>
                      <td class="border-b border-r border-[#D5C1AE] py-2 px-4">
                        單位
                      </td>
                      <td class="border-b border-r border-[#D5C1AE] py-2 px-4">
                        每份
                      </td>
                      <td class="border-b border-[#D5C1AE] py-2 px-4">
                        每 100 公克
                      </td>
                    </tr>
                    <!-- Dynamic rows for each nutrient -->
                    <tr
                      v-for="(
                        item, index
                      ) in productDetail.everyNutrientContent"
                      :key="index"
                    >
                      <td class="border-b border-r border-[#D5C1AE] py-2 px-4">
                        {{ item.key }}
                      </td>
                      <td class="border-b border-r border-[#D5C1AE] py-2 px-4">
                        <!-- 顯示每份的數值 -->
                        {{ item.value }} 公克
                      </td>
                      <td class="border-b border-[#D5C1AE] py-2 px-4">
                        <!-- 顯示每 100 公克的數值 -->
                        {{
                          productDetail.everyHundredNutrientContent?.[index]
                            ?.value || '0'
                        }}
                        公克
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>

            <!-- 提醒事項 -->
            <ul class="list-disc space-y-3 text-base pl-4 mt-3">
              <li>
                <strong class="font-semibold">無添加劑：</strong><br />
                {{ productDetail.descriptions?.nonAdditive }}
              </li>
              <li>
                <strong class="font-semibold">建議食用方法：</strong><br />
                {{ productDetail.descriptions?.howToEat }}
              </li>
              <li>
                <strong class="font-semibold">保存方式：</strong><br />
                {{ productDetail.descriptions?.precautions }}
              </li>
              <li>
                <strong class="font-semibold">注意事項：</strong><br />
                {{ productDetail.descriptions?.preservationMethod }}
              </li>
              <li>
                <strong class="font-semibold">賞味期限：</strong><br />
                {{ productDetail.descriptions?.tastePeriod }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 風險須知 -->
      <div
        class="h-9 w-full px-3 flex items-center justify-between text-[#4C3232] text-base font-bold mt-6 bg-[#F1E1C5] rounded-lg"
      >
        <img src="/images/products/detail/cake.png" class="w-5 h-5" />
        <span>宅配有碰撞風險，可接受者再下單</span>
        <img src="/images/products/detail/cake.png" class="w-5 h-5" />
      </div>
      <div class="w-full mt-4">
        <h2 class="font-bold mb-4">宅配風險說明：</h2>
        <ol class="list-decimal space-y-2 pl-6">
          <li>接單生產，新鮮製作，常溫配送。</li>
          <li>商品圖片僅供參考。</li>
          <li>
            依通訊交易解除權合理例外情事適用準則第2條第一項：
            本平台短效期商品屬於易腐敗商品，因消費者保存方式不當導致腐敗不適用於15天鑑賞期，
            基於食品安全，恕無法接受退換貨請求，還請見諒。
          </li>
          <li>確認付款完畢，訂單狀態為已確認才算成立。</li>
          <li>配送會有運送破損之風險，請接受者再下單哦！</li>
        </ol>
        <p class="mt-3 text-[#D51F3B] font-bold">
          *若有未盡事宜，保留解釋、變更、取消等權利*
        </p>
      </div>
    </div>
  </main>
</template>
