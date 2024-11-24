<script setup lang="ts">
defineProps<{
  current: string
}>()
</script>

<template>
  <Breadcrumb class="rounded-md">
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink as-child>
          <NuxtLink :to="`/`" title="首頁" class="flex items-center">
            <UIcon name="heroicons:home" class="w-5 h-5" />
          </NuxtLink>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage class="font-extrabold text-[#555]">{{ current }}</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</template>
