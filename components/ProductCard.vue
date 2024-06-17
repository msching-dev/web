<script setup lang="ts">
const props = defineProps({
  node: { type: Object, required: true },
})

const img = useImage();
const tagUrl = img(`/images/products/tags/${props.node.tag}.png`)

const fallbackImage = '/images/logo_s.png'
</script>

<template>
  <div
    class="relative flex flex-col overflow-hidden rounded-xl w-full aspect-[0.675] shadow-[0_1.905px_10.142px_0px_rgba(185,159,133,0.2)] px-4 py-2"
  >
    <NuxtImg
      preload
      class="absolute inset-0 object-cover w-full h-full"
      src="/images/products/common/card_bg.png"
    />
    <img width="52" v-if="tagUrl" :src="tagUrl" alt="tag" class="absolute top-4 right-4 object-cover w-[28%] h-auto" />
    <NuxtImg
      width="30"
      height="30"
      placeholder
      placeholder-class="blur-xl rounded-full"
      class="absolute bottom-[22%] right-[13px] object-cover w-[30px] h-[30px]"
      src="/images/products/common/cart.png"
    />
    <div class="relative w-full aspect-[4/5]">
      <NuxtImg
        width="264"
        :height="Math.round(264 * 1.378)"
        class="absolute bottom-[5.5%] left-1/2 transform -translate-x-1/2 object-cover w-4/5 h-auto"
        :src="node.banner?.src || fallbackImage"
        :alt="node.banner?.altText || node.name"
        :title="node.banner?.title || node.name"
        loading="lazy"
        placeholder
        placeholder-class="blur-xl"
      />
    </div>
    <span class="text-4 font-semibold text-[#4C3232]">{{ node.name }}</span>
    <UDivider class="py-1" />
    <div class="flex justify-between items-center">
      <div class="flex items-center">
        <span class="text-[#B8B8B8] font-semibold text-[12px] line-through"
          >${{ node.maxCount }}元</span
        >
        <span class="text-[#4C3232] text-4 font-semibold ml-[6px]"
          >${{ node.price }}元</span
        >
      </div>
      <div class="text-[#4C3232]/20 font-bold text-xs">{{ node.alias }}</div>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
