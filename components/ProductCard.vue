<script setup lang="ts">
const props = defineProps({
  node: { type: Object, required: true },
})

const isPressed = ref(false)
const isShining = ref(false)

const img = useImage()
const tagUrl = img(`/images/products/tags/${props.node.tag}.png`)

const fallbackImage = '/images/products/common/default.png'

const triggerShine = () => {
  isShining.value = true
  setTimeout(() => {
    isShining.value = false
  }, 500)
}

const handleAddCart = (event: MouseEvent) => {
  console.log('handleToCart')
}
</script>

<template>
  <NuxtLink
    :to="`/products/${decodeURIComponent(node.key)}`"
    :title="node.name"
  >
    <div
      :class="[
        'relative flex flex-col overflow-hidden rounded-xl w-full aspect-[0.675] shadow-[0_1.905px_10.142px_0px_rgba(185,159,133,0.2)] px-4 py-2 cursor-pointer transform transition-transform duration-200',
        isPressed ? 'scale-95' : 'scale-100',
      ]"
      @touchstart="isPressed = true"
      @touchend="
        () => {
          isPressed = false
          triggerShine()
        }
      "
      @mousedown="isPressed = true"
      @mouseup="
        () => {
          isPressed = false
          triggerShine()
        }
      "
      @mouseleave="isPressed = false"
    >
      <NuxtImg
        preload
        class="absolute inset-0 object-cover w-full h-full"
        src="/images/products/common/card_bg.png"
      />
      <img
        width="62"
        v-if="['christmas'].includes(props.node.tag)"
        :src="tagUrl"
        alt="tag"
        class="absolute top-2 right-1 object-cover w-[38%] h-auto"
      />
      <img
        width="62"
        v-else-if="tagUrl"
        :src="tagUrl"
        alt="tag"
        class="absolute top-4 right-4 object-cover w-[28%] h-auto"
      />
      <!-- TODO: 購物相關排候實作 -->
      <!-- <CartIcon
        class="absolute bottom-[23%] right-[13px] shadow-sm"
        @click="handleAddCart"
      /> -->
      <div class="relative w-full aspect-[4/5]">
        <NuxtImg
          width="264"
          :height="Math.round(194 * 1.378)"
          class="absolute bottom-[10.5%] left-1/2 transform -translate-x-1/2 object-cover w-4/5 h-auto"
          :src="node.banner?.src || fallbackImage"
          :alt="node.banner?.altText || node.name"
          :title="node.banner?.title || node.name"
          loading="lazy"
          placeholder
          placeholder-class="blur-xl shadow-none"
        />
      </div>
      <span
        class="text-base font-semibold text-[#4C3232] max-[350px]:text-sm whitespace-nowrap"
        >{{ node.name }}</span
      >
      <UDivider class="py-1" />
      <div class="flex justify-between items-center whitespace-nowrap">
        <div class="flex items-center">
          <span class="text-[#B8B8B8] font-semibold text-[12px] line-through"
            >${{ node.price + 10 }}元</span
          >
          <span class="text-[#4C3232] text-4 font-semibold ml-[6px]"
            >${{ node.price }}元</span
          >
        </div>
        <div class="text-[#4C3232]/20 font-bold text-xs">{{ node.alias }}</div>
      </div>
      <div v-if="isShining" class="shine"></div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.shine {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.6);
  animation: shine-effect 0.5s ease;
  pointer-events: none;
  overflow: hidden;
}

@keyframes shine-effect {
  0% {
    transform: scale(0) rotate(45deg);
    opacity: 1;
  }
  100% {
    transform: scale(4) rotate(45deg);
    opacity: 0;
  }
}
</style>
