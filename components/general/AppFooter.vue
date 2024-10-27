<script setup lang="ts"></script>

<template>
  <footer class="bg-white order-last">
    <div class="container flex items-center justify-center my-3">
      <NuxtImg src="/images/logo_s.png" class="" />
    </div>
    <UDivider :ui="{ wrapper: { base: 'px-4' } }" />
    <div
      class="container flex items-start justify-between gap-3 pt-4 pl-6 pr-3"
    >
      <div class="text-base font-bold text-[#4C3232]">
        <div>聯繫我們</div>
        <div class="mt-3">Email</div>
        <NuxtLink
          to="mailto:msching.handmade@gmail.com"
          class="font-medium"
          >msching.handmade@gmail.com</NuxtLink
        >
      </div>
      <div class="grid grid-cols-2 gap-5">
        <NuxtLink
          to="https://liff.line.me/1645278921-kWRPP32q/?accountId=984gfwdr"
          target="_blank"
          ><NuxtImg src="/images/footer/icon_line.png"
        /></NuxtLink>
        <NuxtLink
          to="https://www.instagram.com/msching_2022?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
          target="_blank"
          ><NuxtImg src="/images/footer/icon_ig.png"
        /></NuxtLink>
        <NuxtLink
          class="col-span-full justify-self-end"
          to="https://www.behance.net/yiy510"
          target="_blank"
          ><NuxtImg src="/images/footer/icon_kristy_ad.png" class=""
        /></NuxtLink>
      </div>
    </div>
    <p class="ml-6 mt-6 mb-3 text-xs text-left font-normal text-gray-500">
      Copyright © 2024 msching.com 保留所有權利
    </p>
  </footer>
</template>
