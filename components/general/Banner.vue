<template>
  <div class="relative mx-auto">
    <NuxtImg
      class="object-cover w-full h-auto"
      src="/images/banner.png"
      width="786"
      height="438"
      alt="banner"
      loading="eager"
      fetchpriority="high"
      preload
      :placeholder="[786, 438]"
      placeholder-class="blur-xl"
    />
  </div>
</template>
