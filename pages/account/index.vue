<script setup lang="ts">
const items = [
  { label: '會員登入', value: '' },
  { label: '註冊會員', value: '' },
]
</script>
<template>
  <div class="container px-0">
    <!-- Banner -->
    <Banner type="login" />
    <UTabs
      :items="items"
      :ui="{
        list: {
          background: '#F5F5F5',
          height: 'h-[60px]',
          padding: 'p-0',
          tab: {
            height: 'h-12',
            active: 'text-primary-950',
            inactive: 'text-primary-900/[.6]',
          },
        },
      }"
    >
      <template #item>
        <div class="p-6">
          <LineSignInButton />
          <GoogleSignInButton class="mt-6" />
          <UDivider label="OR" class="my-6" />
          <LoginAndRegister />
        </div>
      </template>
    </UTabs>
  </div>
</template>
