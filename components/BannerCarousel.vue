<script setup lang="ts">
const carouselItemsSource = [
  // {
  //   src: '/images/banner/xmas.png',
  //   srcDesktop: '/images/banner/xmas_desktop.png',
  //   to: '/?category=festival#products',
  //   target: '_self',
  //   alt: '聖誕節限定禮盒',
  // },
  {
    src: '/images/banner/shopee.png',
    srcDesktop: '/images/banner/shopee_desktop.png',
    to: 'https://shopee.tw/2025%E8%9C%9C%E7%B5%B2%E6%99%B4%E9%99%90%E9%87%8F%E6%89%8B%E4%BD%9C%E4%B8%AD%E7%A7%8B%E7%A6%AE%E7%9B%92%EF%BD%9C%E9%B3%B3%E6%A2%A8%E9%85%A5%E3%80%81%E7%83%8F%E8%B1%86%E6%B2%99%E9%85%A5%E3%80%81%E7%83%8F%E8%B1%86%E6%B2%99%E9%BA%BB%E7%B3%AC%E9%85%A5%E4%B8%89%E7%A8%AE%E9%A2%A8%E5%91%B3%E4%B8%80%E6%AC%A1%E6%BB%BF%E8%B6%B3%E2%9D%A4%EF%B8%8F-i.547773263.27041261938',
    target: '_blank',
    alt: '點擊前往蝦皮購買',
  },
  // {
  //   src: '/images/banner/home.png',
  //   srcDesktop: '/images/banner/home_desktop.png',
  //   to: '/?category=madeleine#products',
  //   target: '_self',
  //   alt: '點擊前往瑪德蓮分類',
  // },
  {
    src: '/images/banner/ig.png',
    srcDesktop: '/images/banner/ig_desktop.png',
    to: socialMediaLinks.instagramOfficial,
    target: '_blank',
    alt: '點擊前往IG官方',
  },
  {
    src: '/images/banner/line.png',
    srcDesktop: '/images/banner/line_desktop.png',
    to: socialMediaLinks.lineOfficial,
    target: '_blank',
    alt: '點擊前往LINE官方',
  },
]

const route = useRoute()
const isLargeScreen = useMediaQuery('(min-width: 1024px)')
const carouselRef = ref()
const mainRef = ref<HTMLElement | null>(null)
const carouselContainerStyle = ref({ container: {}, carousel: {} })
let autoplayTimer: ReturnType<typeof setInterval> | null

const isScreenReady = ref(false)
onMounted(() => {
  isScreenReady.value = true
})

const carouselItems = computed(() => {
  return carouselItemsSource.reduce((result, item) => {
    const src = isLargeScreen.value ? item.srcDesktop : item.src
    if (src) {
      result.push({
        src,
        to: item.to,
        target: item.target,
        alt: item.alt,
      })
    }
    return result
  }, [])
})

const startAutoplay = () => {
  autoplayTimer = setInterval(() => {
    if (!carouselRef.value) return

    if (carouselRef.value.page === carouselRef.value.pages) {
      return carouselRef.value.select(0)
    }

    carouselRef.value.next()
  }, 10000)
}

const stopAutoplay = () => {
  if (autoplayTimer) {
    console.log('stop')

    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

onMounted(() => {
  startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
})

useResizeObserver(mainRef, (entries) => {
  const entry = entries[0]
  const { height } = entry.contentRect
  const containerHeight = (height * 2) / 5
  const carouselImgAspectRatio = 5 / 4 // 390 / 312
  const carouselArrowsArea = isLargeScreen.value ? 48 * 2 : 0
  carouselContainerStyle.value = {
    container: {
      'flex-basis': `${containerHeight}px`, // basis-2/5
    },
    carousel: {
      height: `${containerHeight}px`,
      width: `${
        containerHeight * carouselImgAspectRatio + carouselArrowsArea
      }px`,
    },
  }
})
</script>

<template>
  <div
    v-if="isScreenReady"
    class="relative grow-0 aspect-[393/219] lg:aspect-[1942/406]"
    @touchstart="stopAutoplay"
    @touchend="startAutoplay"
  >
    <UCarousel
      ref="carouselRef"
      v-slot="{ item }"
      :items="carouselItems"
      :prev-button="{
        icon: 'i-heroicons-arrow-left-20-solid',
        variant: 'soft',
        class:
          'bg-[#A96929]/70 hover:bg-[#A96929]/95 text-white -left-0 backdrop-blur',
      }"
      :next-button="{
        icon: 'i-heroicons-arrow-right-20-solid',
        variant: 'soft',
        class:
          'bg-[#A96929]/70 hover:bg-[#A96929]/95 text-white -right-0 backdrop-blur',
      }"
      :ui="{
        item: 'basis-full justify-center',
        indicators: {
          wrapper: 'bottom-1',
          base: 'h-2 w-2',
          active: 'w-5 bg-[#A96929]/70 backdrop-blur-md',
          inactive: 'bg-[#ECD6C7]/70 backdrop-blur-md',
        },
      }"
      :indicators="!isLargeScreen"
      :arrows="isLargeScreen"
    >
      <NuxtLink :to="item.to" :target="item.target" class="w-full h-auto max-h-full">
        <NuxtImg
          :src="item.src"
          :alt="item.alt"
          cover="contain"
          preload
          :placeholder="isLargeScreen ? [1942, 406] : [393, 219]"
          placeholder-class="blur-xl"
          class="w-full h-auto"
        />
      </NuxtLink>
    </UCarousel>
  </div>
</template>
