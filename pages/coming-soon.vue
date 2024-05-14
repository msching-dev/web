<script lang="ts" setup>
useSeoMeta({
  title: 'Coming Soon | MS. CHING 蜜絲晴烘焙手作坊',
  ogTitle: 'Coming Soon | MS. CHING 蜜絲晴烘焙手作坊',
  description: '即將推出，追蹤我們的社交平台，掌握最新資訊。',
  ogDescription: '即將推出，追蹤我們的社交平台，掌握最新資訊。'
})
</script>

<!-- Home -->
<template>
  <dev class="relative flex flex-col min-h-screen bg-[#FDFCF8] overflow-hidden">
    <div>
      <NuxtImg class="absolute -top-[3px] -left-[35px]" src="/images/soon/almond_tuiles.png" />
      <NuxtImg class="absolute top-[6.2%] -right-[29px] -rotate-[22deg]" src="/images/soon/cupcake.png" />
      <NuxtImg width="40" height="40" class="absolute top-[14.5%] -left-[7px]" src="/images/soon/c_1.png" />
      <NuxtImg width="40" height="40" class="absolute top-[29%] -right-[19px]" src="/images/soon/c_1.png" />
      <NuxtImg class="absolute top-[31.8%] -left-[37px] rotate-[46.55deg]" src="/images/soon/madeleine.png" />
      <NuxtImg class="absolute top-[41.2%] -right-[19px]" src="/images/soon/almond_tuiles.png" />
      <NuxtImg class="absolute top-[52.5%] -left-[12px]" src="/images/soon/c_2.png" />
      <NuxtImg class="absolute bottom-[27.9%] -right-[17px] -rotate-[30.06deg]" src="/images/soon/madeleine.png" />
      <NuxtImg class="absolute bottom-[32.2%] right-[70px]" src="/images/soon/c_3.png" />
      <NuxtImg class="absolute bottom-[21%] -left-[4.9px] -rotate-[22deg]" src="/images/soon/cupcake.png" />
    </div>
    <header class="flex items-center justify-center pt-8"><Logo /></header>
    <main class="relative flex-1 flex flex-col">
      <div
        class="grow pt-14 text-center"
      >
        <NuxtImg
          class="mx-auto w-[55%] sm:w-[360px] floating"
          src="/images/soon/coming_soon.svg"
        />
        <NuxtImg
          class="mx-auto mt-4 sm:h-[36px]"
          src="/images/soon/coming_soon_zh.png"
        />
      </div>
      <div class="relative flex flex-col items-center px-4 pt-12 py-5">
        <p class="text-[#867156] text-xl text-center leading-snug sm:text-2xl sm:flex">
          追蹤我們的社交平台
          <p>
            掌握最新資訊
          </p>
        </p>
        <div class="flex gap-5 mt-8">
          <NuxtLink
            to="https://www.instagram.com/msching_2022?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            ><NuxtImg class="sm:h-[50px]" src="/images/footer/icon_ig.png"
          /></NuxtLink>
          <NuxtLink
            to="https://liff.line.me/1645278921-kWRPP32q/?accountId=984gfwdr"
            target="_blank"
            ><NuxtImg class="sm:h-[50px]" src="/images/footer/icon_line.png"
          /></NuxtLink>
        </div>
      </div>
    </main>
    <footer>
      <p class="pb-10 text-xs text-center font-normal text-black">
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
