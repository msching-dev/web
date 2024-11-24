<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core'
const breakpoints = useTailwindBreakpoints()
const isGreaterThanLg = breakpoints.greaterOrEqual('lg')

const openMenus = ref<number[]>([])
const selectedId = ref<{ parent: string; child: string }>({
  parent: '',
  child: '',
})

const toggleMenu = (index: number) => {
  if (openMenus.value.includes(index)) {
    openMenus.value = openMenus.value.filter((i) => i !== index)
  } else {
    openMenus.value.push(index)
  }
}

const isMenuOpen = (index: number) => openMenus.value.includes(index)

const isSelected = (id: { parent?: string; child?: string }) => {
  if (id.child) {
    return (
      selectedId.value.parent === id.parent &&
      selectedId.value.child === id.child
    )
  } else {
    return selectedId.value.parent === id.parent
  }
}

const selectMenu = (id: { parent?: string; child?: string }) => {
  if (id.parent) {
    selectedId.value.parent = id.parent
  }
  if (id.child) {
    selectedId.value.child = id.child
  }
}
</script>

<template>
  <nav>
    <!-- desktop -->
    <div class="space-x-2 hidden lg:flex">
      <template v-for="menu in menus" :key="menu.id">
        <!-- 一級含子菜單 -->
        <UPopover
          v-if="menu.children"
          mode="click"
          :ui="{
            background: 'bg-white/95',
          }"
          :class="{ hidden: !!menu.hidden }"
        >
          <UButton
            color="white"
            variant="ghost"
            :ui="{
              color: { white: { ghost: 'hover:bg-[#BAA086]/10' } },
            }"
            :label="menu.label"
            class="text-[#4C3232]"
          >
            <template #leading>
              <img
                v-if="menu.iconImg"
                :src="menu.iconImg"
                alt="icon"
                class="w-7 h-7"
              />
            </template>
            <template #trailing>
              <UIcon name="i-heroicons-chevron-down-20-solid" class="w-5 h-5" />
            </template>
          </UButton>

          <template #panel>
            <div class="flex flex-col p-2 space-y-2">
              <UButton
                v-for="child in menu.children"
                :key="child.id"
                color="white"
                variant="link"
                :to="child.to"
                :icon="child.icon"
                :label="child.label"
                class="text-[#4C3232]/70 hover:bg-[#BAA086]/10 hover:text-[#BAA086]"
                :class="{
                  'bg-[#BAA086]/10 text-[#BAA086] font-bold': isSelected({
                    parent: menu.id,
                    child: child.id,
                  }),
                }"
                @click="selectMenu({ parent: menu.id, child: child.id })"
              ></UButton>
            </div>
          </template>
        </UPopover>

        <!-- 單一一級菜單 -->
        <UButton
          v-else
          :key="`button-menu-${menu.id}`"
          :to="menu.to"
          :label="menu.label"
          class="text-[#4C3232]"
          :class="{ hidden: !!menu.hidden }"
          color="white"
          variant="link"
          :ui="{
            color: { white: { link: 'hover:bg-[#BAA086]/10' } },
          }"
          @click="selectMenu({ parent: menu.id })"
        >
          <template #leading
            ><img
              v-if="menu.iconImg"
              :src="menu.iconImg"
              alt="icon"
              class="w-7 h-7"
          /></template>
        </UButton>
      </template>
    </div>

    <!-- mobile -->
    <ul key="sidebar-menu" class="lg:hidden">
      <li v-for="(menu, index) in menus" :key="menu.id">
        <UDivider
          v-if="index < menus.length"
          size="xs"
          class="py-0 lg:hidden"
          :ui="{ border: { base: 'border-[#B8B8B8]/20' } }"
          :class="{ hidden: !!menu.hidden }"
        />
        <div
          @click="toggleMenu(index)"
          @click.stop="selectMenu({ parent: menu.id })"
          :class="{
            'bg-[#BAA086]/10 text-[#BAA086] font-bold': isSelected({
              parent: menu.id,
            }),
            hidden: !!menu.hidden
          }"
          class="flex items-center justify-between m-3 p-3 rounded-lg cursor-pointer"
        >
          <NuxtLink
            :to="menu.to"
            class="flex-1 flex items-center space-x-2 text-[#4C3232]"
          >
            <img
              v-if="menu.iconImg"
              :src="menu.iconImg"
              alt="icon"
              class="w-7 h-7"
            />
            <span>{{ menu.label }}</span>
          </NuxtLink>
          <span
            v-if="menu.children"
            class="i-heroicons-chevron-down-20-solid ml-auto w-6 h-6 transform transition-transform duration-200 flex-shrink-0 -rotate-90 text-[#B99F85]"
            :class="{ 'rotate-0': isMenuOpen(index) }"
          ></span>
        </div>
        <ul v-if="menu.children && isMenuOpen(index)" class="pl-8 mt-2">
          <li
            v-for="child in menu.children"
            :key="child.id"
            class="mb-1 mr-3 px-2 flex items-center rounded-lg cursor-pointer"
            :class="{
              'bg-[#BAA086]/10 text-[#BAA086] font-bold': isSelected({
                parent: menu.id,
                child: child.id,
              }),
            }"
          >
            <UIcon v-if="child.icon" :name="child.icon" />
            <NuxtLink
              :to="child.to"
              class="block px-4 py-2 rounded-lg"
              @click.stop="selectMenu({ parent: menu.id, child: child.id })"
              >{{ child.label }}</NuxtLink
            >
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
