<script setup lang="ts">
const carouselItemsSource = [
  {
    src: '/images/banner/xmas.png',
    srcDesktop: '/images/banner/xmas_desktop.png',
    to: '/?category=festival#products',
    target: '_self',
    alt: '聖誕節限定禮盒',
  },
  {
    src: '/images/banner/home.png',
    srcDesktop: '/images/banner/home_desktop.png',
    to: '/?category=madeleine#products',
    target: '_self',
    alt: '點擊前往瑪德蓮分類',
  },
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
