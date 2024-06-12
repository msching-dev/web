<script lang="ts" setup>

useSeoMeta({
  title: 'MS. CHING 蜜絲晴烘焙手作坊',
  ogTitle: 'MS. CHING 蜜絲晴烘焙手作坊',
  description: '入口即是愛的滋味，不定時限時限量手作甜點',
  ogDescription: '入口即是愛的滋味，不定時限時限量手作甜點',
  ogUrl: 'https://msching.com',
  ogImage: '/images/logo_c.png',
  twitterCard: 'summary_large_image',
})

const categories = useState<Array<any>>(
    'categories',
    () => [{name: '手作杏仁片', value: 1}, {name: '|', value: 0}, {name: '瑪德蓮', value: 2}, {
        name: '|',
        value: 0
    }, {name: '禮盒相關', value: 3}]
)
const currentCategory = useState<number>(
    'currentCategory',
    () => 2
)

function changeCategory(state: number | undefined = undefined): void {
    if (state === 0) return
    currentCategory.value = state || 1
}

</script>

<!-- Home -->
<template>
    <main>
        <!-- Banner -->

        <!-- Category / Items -->
        <section class="container my-8">
            <div class="flex flex-col justify-center text-center mb-[21px] text-[#4C3232] text-2xl font-extrabold">
                產品分類
            </div>
            <div class="flex items-end justify-center">
                <div v-for="(item) in categories" class="text-black font-semibold text-l mx-2">
                    <u v-if="currentCategory === item.value" @click="changeCategory(item.value)">
                        <div class="w-full text-center">{{ item.name }}</div>
                    </u>
                    <div v-else class="w-full text-center" @click="changeCategory(item.value)">{{ item.name }}</div>
                </div>
            </div>
            <div class="mt-[7px] p-8 flex justify-between flex-wrap">
                <!-- 商品json 跑迴圈 -->
                <div class="w-[48%] rounded shadow-lg h-[240px] mt-4 relative flex justify-center">
                    <NuxtImg class="absolute z-10 right-2 top-[14px]" src="/images/products/common/top_1.png"/>
                    <NuxtImg class="absolute z-10 top-[18px]" src="/images/products/earlGaryTeaMadeleine.png"/>
                    <NuxtImg class="absolute z-0 top-[18px]" src="/images/products/common/card_bg.png"/>
                    <div class="absolute left-[14px] bottom-10 text-4 font-semibold text-[#4C3232]">伯爵茶</div>
                    <NuxtImg class="absolute right-3 bottom-12 w-[30px] h-[30px]" src="/images/products/common/buy.png"/>
                    <UDivider class="absolute bottom-8 px-2"/>
                    <div class="absolute bottom-[6px] flex justify-between w-[100%] px-2 items-center">
                        <div>
                            <span class="text-[#B8B8B8] font-semibold text-[12px] line-through">$70</span>
                            <span class="text-[#4C3232] text-4 font-semibold ml-1">$60</span>
                        </div>
                        <div class="text-[#B8B8B8] font-semibold text-[12px]">高貴</div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>s

<style scoped>

</style>
