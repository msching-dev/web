<script setup lang="ts">
import type { ProductDetail, ProductInfo } from '~/types'

const route = useRoute()
const productKey = route.params.slug as string

const { products, fetchProducts, fetchProductDetail } = useProducts()

const productInfo = ref<Partial<ProductInfo>>()
const productDetail = ref<Partial<ProductDetail> | null>()

onMounted(async () => {
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
    // loading.value = false
  }
})

console.log('productDetail', productDetail)
</script>
<template>
  <main
    class="container relative p-4 flex flex-col items-start text-[#555555]/85"
    v-if="productInfo && productDetail"
  >
    <div
      class="flex relative w-full text-2xl font-bold justify-center items-center mb-2"
    >
      <NuxtLink :to="`/`" title="首頁">
        <UIcon
          name="heroicons:arrow-left-circle"
          class="absolute left-2 top-[-4px] w-10 h-10 opacity-80 z-20 text-[#CAAE93]"
        />
      </NuxtLink>
      <div class="flex flex-col justify-center">
        <p class="border-[#B99F85] border-b-[3px] pb-1">
          {{ productInfo.name }}
        </p>
        <p class="text-[#B99F85]/40 font-extrabold text-base text-right">
          {{ productInfo.alias }}
        </p>
      </div>
    </div>
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
      class="w-full mx-auto"
    >
      <template #default="{ item }">
        <NuxtImg
          :src="item"
          class="w-full aspect-[358/485]"
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

    <div class="flex flex-col text-2xl font-bold">
      <span class="mt-4">
        {{ `NT＄ ${productInfo.price} 元 / ${productDetail.unit}` }}
        <span class="text-[#555555]/70 text-base font-bold">{{
          productDetail.includeSize ? `( ${productDetail.includeSize} )` : ''
        }}</span>
      </span>
    </div>

    <p class="text-base mt-4">
      商品說明：
      {{ productDetail.descriptions?.desc }}
    </p>

    <!-- TODO: 購物車區塊待實作 -->
    <NuxtLink
      class="w-full"
      to="https://liff.line.me/1645278921-kWRPP32q/?accountId=984gfwdr"
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
                'mt-3 text-white ring-transparent bg-[#06C755] hover:bg-[#05B34C] active:bg-[#048B3B] disabled:bg-white',
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

    <!-- 營養表格 -->
    <div
      class="w-full max-w-md overflow-hidden rounded-xl border-x border-[#B99F85] mt-3"
    >
      <table
        class="w-full text-center text-sm text-black/70 border-separate border-spacing-0"
      >
        <thead>
          <tr>
            <th
              colspan="3"
              class="bg-[#C8A888] text-white font-normal text-sm h-10"
            >
              營養成分
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="2" class="border-b border-[#D5C1AE] py-2 px-4">
              每一份量
            </td>
            <td class="border-b border-[#D5C1AE] py-2 px-4">30 公克</td>
          </tr>
          <tr>
            <td colspan="2" class="border-b border-[#D5C1AE] py-2 px-4">
              本包裝含
            </td>
            <td class="border-b border-[#D5C1AE] py-2 px-4">1 份</td>
          </tr>
          <!-- Column headers for per serving and per 100 grams -->
          <tr>
            <td class="border-b border-[#D5C1AE] py-2 px-4">單位</td>
            <td class="border-b border-[#D5C1AE] py-2 px-4">每份</td>
            <td class="border-b border-[#D5C1AE] py-2 px-4">每 100 公克</td>
          </tr>
          <!-- Dynamic rows for each nutrient -->
          <tr
            v-for="(item, index) in productDetail.everyNutrientContent"
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
                productDetail.everyHundredNutrientContent?.[index]?.value || '0'
              }}
              公克
            </td>
          </tr>
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

    <!-- 風險須知 -->
    <div
      class="h-9 w-full px-3 flex items-center justify-between text-[#4C3232] text-base font-bold mt-9 bg-[#F1E1C5] rounded-lg"
    >
      <img src="/images/products/detail/cake.png" class="w-5 h-5" />
      <span>宅配有碰撞風險，可接受者再下單</span>
      <img src="/images/products/detail/cake.png" class="w-5 h-5" />
    </div>
    <div class="max-w-lg mt-4">
      <h2 class="font-bold mb-4">宅配風險說明：</h2>
      <ol class="list-decimal space-y-2 pl-6">
        <li>接單生產，新鮮製作，常溫配送</li>
        <li>商品圖片僅供參考</li>
        <li>
          依通訊交易解除權合理例外情事適用準則第2條第一項：
          本平台短效期商品屬於易腐敗商品，因消費者保存方式不當導致腐敗不適用於15天鑑賞期，
          基於食品安全，恕無法接受退換貨請求，還請見諒
        </li>
        <li>確認付款完畢，訂單狀態為已確認才算成立</li>
        <li>配送會有運送破損之風險，請接受者再下單哦！</li>
      </ol>
      <p class="mt-3 text-[#D51F3B] font-bold">
        *若有未盡事宜，保留解釋、變更、取消等權利*
      </p>
    </div>
  </main>
</template>
