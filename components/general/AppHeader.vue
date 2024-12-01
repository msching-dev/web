<script setup lang="ts"></script>

<template>
  <header
    class="sticky top-0 z-40 bg-white/75 shadow-sm shadow-light-500 backdrop-blur"
  >
    <div class="relative container flex items-center justify-between py-4">
      <MenuTrigger class="lg:hidden mx-3 drop-shadow-md" />
      <Logo />
      <MainMenu
        class="items-center hidden gap-6 text-sm text-gray-500 lg:flex lg:flex-1 lg:px-5"
      />
      <div class="flex items-center mx-3">
        <!-- TODO: 待開發，完成後復原 flex -->
        <NuxtLink to="/cart" class="mr-4 cursor-pointer hidden">
          <NuxtImg src="/images/header_cart.png" />
        </NuxtLink>
        <User class="hidden" />
      </div>
    </div>
  </header>
</template>
