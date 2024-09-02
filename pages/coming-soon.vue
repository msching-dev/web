<script lang="ts" setup>
useSeoMeta({
  title: 'Coming Soon | MS. CHING 蜜絲晴烘焙手作坊',
  ogTitle: 'Coming Soon | MS. CHING 蜜絲晴烘焙手作坊',
  description: '即將推出，追蹤我們的社交平台，掌握最新資訊。',
  ogDescription: '即將推出，追蹤我們的社交平台，掌握最新資訊。',
  ogUrl: 'https://msching.com/coming-soon',
  ogImage: '/images/logo_c.png',
  twitterCard: 'summary_large_image'
})

const isLargeScreen = useMediaQuery('(min-width: 1024px)')
const carouselRef = ref()
const mainRef = ref<HTMLElement | null>(null)
const carouselContainerStyle = ref({ container: {}, carousel: {} })
let autoplayTimer: ReturnType<typeof setInterval> | null

const carouselItems = [
  {
    src: '/images/carousel/mid_autumn_gift_box_sale.png',
    to: 'https://www.instagram.com/p/C_Xx0AHSpjN/',
    alt: '中秋禮盒預購'
  },
  {
    src: '/images/carousel/click_to_visit_ig_official.png',
    to: 'https://www.instagram.com/msching_2022?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    alt: '點擊前往IG官方'
  },
  {
    src: '/images/carousel/click_to_visit_line_official.png',
    to: 'https://liff.line.me/1645278921-kWRPP32q/?accountId=984gfwdr',
    alt: '點擊前往LINE官方'
  }
]

// 自动播放的函数
const startAutoplay = () => {
  console.log('resume');
  autoplayTimer = setInterval(() => {
    if (!carouselRef.value) return

    if (carouselRef.value.page === carouselRef.value.pages) {
      return carouselRef.value.select(0)
    }

    carouselRef.value.next()
  }, 6000)
}

const stopAutoplay = () => {
  if (autoplayTimer) {
    console.log('stop');
    
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
      'flex-basis': `${containerHeight}px` // basis-2/5
    },
    carousel: {
      height: `${containerHeight}px`,
      width: `${
        containerHeight * carouselImgAspectRatio + carouselArrowsArea
      }px`
    }
  }
})
</script>

<!-- Home -->
<template>
  <dev class="relative flex flex-col h-full bg-[#FDFCF8] overflow-hidden">
    <div>
      <NuxtImg
        class="absolute -top-[3px] -left-[35px] md:left-4 md:top-1"
        src="/images/soon/almond_tuiles.png"
      />
      <NuxtImg
        class="absolute top-[6.2%] -right-[29px] -rotate-[22deg] md:right-5"
        src="/images/soon/cupcake.png"
      />
      <NuxtImg
        width="40"
        height="40"
        class="absolute top-[14.5%] -left-[7px]"
        src="/images/soon/c_1.png"
      />
      <NuxtImg
        width="40"
        height="40"
        class="absolute top-[29%] -right-[19px]"
        src="/images/soon/c_1.png"
      />
      <NuxtImg
        class="absolute top-[31.8%] -left-[37px] rotate-[46.55deg] md:left-[11%]"
        src="/images/soon/madeleine.png"
      />
      <NuxtImg
        class="absolute top-[41.2%] -right-[19px] md:right-[14%]"
        src="/images/soon/almond_tuiles.png"
      />
      <NuxtImg
        class="absolute top-[52.5%] -left-[12px]"
        src="/images/soon/c_2.png"
      />
      <NuxtImg
        class="absolute bottom-[8%] -right-[17px] -rotate-[30.06deg] md:bottom-[18%] md:right-[2%]"
        src="/images/soon/madeleine.png"
      />
      <NuxtImg
        class="absolute bottom-[32.2%] right-[70px]"
        src="/images/soon/c_3.png"
      />
      <NuxtImg
        class="absolute bottom-[21%] -left-[4.9px] -rotate-[22deg] md:left-[5%]"
        src="/images/soon/cupcake.png"
      />
    </div>
    <header class="flex items-center justify-center flex-[100px] flex-grow-0">
      <Logo />
    </header>
    <main ref="mainRef" class="relative flex-1 flex flex-col">
      <div class="grow flex flex-col items-center justify-center text-center">
        <NuxtImg
          class="mx-auto w-[64%] sm:w-[300px] floating"
          src="/images/soon/coming_soon.png"
        />
        <NuxtImg
          class="mx-auto mt-4 sm:h-[36px]"
          src="/images/soon/coming_soon_zh.png"
        />
      </div>
      <!-- 輪播區, 圖寬高比 390:312 (5:4) -->
      <div
        class="relative grow-0 px-2"
        :style="carouselContainerStyle.container"
        @touchstart="stopAutoplay"
        @touchend="startAutoplay"
      >
        <UCarousel
          ref="carouselRef"
          class="mx-auto h-full rounded-2xl overflow-hidden"
          :style="carouselContainerStyle.carousel"
          v-slot="{ item }"
          :items="carouselItems"
          :prev-button="{
            icon: 'i-heroicons-arrow-left-20-solid',
            variant: 'soft',
            class: 'bg-[#A96929] text-white -left-0'
          }"
          :next-button="{
            icon: 'i-heroicons-arrow-right-20-solid',
            variant: 'soft',
            class: 'bg-[#A96929] text-white -right-0'
          }"
          :ui="{
            item: 'basis-full justify-center rounded-2xl',
            indicators: {
              wrapper: 'bottom-2',
              base: 'h-2 w-2',
              active: 'w-5 bg-[#A96929]',
              inactive: 'bg-[#ECD6C7]'
            }
          }"
          :indicators="!isLargeScreen"
          :arrows="isLargeScreen"
        >
          <NuxtLink :to="item.to" target="_blank" class="h-full">
            <NuxtImg
              :src="item.src"
              :alt="item.alt"
              width="390"
              height="312"
              cover="contain"
              preload
              :placeholder="[390, 312]"
              placeholder-class="blur-xl"
              class="rounded-lg shadow max-w-full max-h-full"
            />
          </NuxtLink>
        </UCarousel>
      </div>
    </main>
    <footer class="shrink-0 flex items-center justify-center py-4">
      <p class="text-xs text-center font-normal text-black">
        Copyright © 2024 msching.com 保留所有權利
      </p>
    </footer>
  </dev>
</template>

<style scoped>
@keyframes breathing {
  0% {
    -webkit-transform: scale(0.9);
    -ms-transform: scale(0.9);
    transform: scale(0.9);
  }

  25% {
    -webkit-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
  }

  60% {
    -webkit-transform: scale(0.9);
    -ms-transform: scale(0.9);
    transform: scale(0.9);
  }

  100% {
    -webkit-transform: scale(0.9);
    -ms-transform: scale(0.9);
    transform: scale(0.9);
  }
}

@keyframes float {
  0% {
    transform: translatey(0px);
  }
  50% {
    transform: translatey(-20px);
  }
  100% {
    transform: translatey(0px);
  }
}

.floating {
  animation: float 6s ease-in-out infinite;
}
</style>
