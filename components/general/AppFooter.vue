<script setup lang="ts"></script>

<template>
  <footer class="relative bg-white order-last">
    <div class="container flex items-center justify-center my-3">
      <NuxtImg src="/images/logo_s.png" width="50" height="54" />
    </div>
    <UDivider :ui="{ wrapper: { base: 'px-4' } }" />
    <div
      class="container flex items-start justify-between gap-3 pt-4 pl-6 pr-3"
    >
      <div class="text-base font-bold text-[#4C3232]">
        <div>聯繫我們</div>
        <div class="mt-3">Email</div>
        <NuxtLink to="mailto:msching.handmade@gmail.com" class="font-medium"
          >msching.handmade@gmail.com</NuxtLink
        >
      </div>
      <div class="grid grid-cols-2 gap-5">
        <NuxtLink :to="socialMediaLinks.lineOfficial" target="_blank"
          ><NuxtImg src="/images/footer/icon_line.png" width="42" height="42"
        /></NuxtLink>
        <NuxtLink :to="socialMediaLinks.instagramOfficial" target="_blank"
          ><NuxtImg src="/images/footer/icon_ig.png" width="42" height="42"
        /></NuxtLink>
        <NuxtLink
          class="col-span-full justify-self-end"
          to="https://www.behance.net/yiy510"
          target="_blank"
          ><NuxtImg
            src="/images/footer/icon_kristy_ad.png"
            width="42"
            height="42"
        /></NuxtLink>
      </div>
    </div>
    <p
      class="ml-6 mt-6 mb-3 text-xs text-left font-medium text-gray-500 md:text-center"
    >
      Copyright © 2024 msching.com 保留所有權利
    </p>
    <TopMask
      class="absolute bottom-0 opacity-80 transform rotate-180 text-[#4C3232]"
    />
  </footer>
</template>
