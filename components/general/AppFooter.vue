<script setup lang="ts"></script>

<template>
  <footer class="bg-white order-last">
    <div class="container flex items-center justify-center my-3">
      <NuxtImg src="/images/footer/logo.png" class="" />
    </div>
    <div class="container px-4"><div class="container border-t border-primary-20"/></div>
    <div class="container flex items-start justify-between pt-4 pl-6 pr-3">
      <div class="text-base font-bold text-[#4C3232]">
        <div>聯繫我們</div>
        <div class="mt-3">Email</div>
        <div class="font-normal">needhelp@misching.com</div> 
      </div>
      <div class="grid grid-cols-2 gap-5">
        <NuxtImg src="/images/footer/icon_line.png" class="" />
        <NuxtImg src="/images/footer/icon_ig.png" class="" />
        <NuxtImg src="/images/footer/icon_kristy_ad.png" class="" />
      </div>
    </div>
    <p class="ml-6 mt-6 mb-3 text-xs text-left font-normal text-gray-500">Copyright © 2024 msching.com 保留所有權利</p>
  </footer>
</template>