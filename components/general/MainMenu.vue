<script setup lang="ts">
const menus = [
  {
    id: 'home',
    label: '首頁',
    to: '/',
    iconImg: '/images/menu/about_us.png',
  },
  {
    id: 'news',
    label: '最新消息',
    to: '/news',
    iconImg: '/images/menu/news.png',
  },
  {
    id: 'onlineOrder',
    label: '線上訂購',
    to: '',
    iconImg: '/images/menu/online_order.png',
    children: [
      {
        id: 'hotItems',
        icon: 'heroicons-outline:fire',
        label: '熱賣中',
        to: `/?category=${Category.Hot}`,
      },
      {
        id: 'cookies',
        icon: 'heroicons-outline:lifebuoy',
        label: '餅乾',
        to: `/?category=${Category.Cookie}`,
      },
      {
        id: 'madeleines',
        icon: 'heroicons-outline:cake',
        label: '瑪德蓮',
        to: `/?category=${Category.Madeleine}`,
      },
      {
        id: 'festiveGifts',
        icon: 'heroicons-outline:archive',
        label: '節慶禮盒',
        to: `/?category=${Category.Festival}`,
      },
    ],
  },
  {
    id: 'orderHelp',
    label: '訂購QA/條款',
    to: '',
    iconImg: '/images/menu/order_help.png',
    children: [
      {
        id: 'orderQa',
        icon: 'heroicons-outline:clipboard-document-list',
        label: '訂購Q&A',
        to: '/faq',
      },
      {
        id: 'purchaseTerms',
        icon: 'heroicons-outline:shopping-bag',
        label: '購買條款',
        to: '/terms',
      },
    ],
  },
  {
    id: 'aboutUs',
    label: '關於我們',
    to: '/about',
    iconImg: '/images/menu/about_us.png',
  },
]

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

// function onEnter(_el: Element, done: () => void) {
//   const el = _el as HTMLElement
//   el.style.height = '0'
//   el.offsetHeight // Trigger a reflow, flushing the CSS changes
//   el.style.height = el.scrollHeight + 'px'
//   el.addEventListener('transitionend', done, { once: true })
// }

// function onBeforeLeave(_el: Element) {
//   const el = _el as HTMLElement
//   el.style.height = el.scrollHeight + 'px'
//   el.offsetHeight // Trigger a reflow, flushing the CSS changes
// }

// function onAfterEnter(_el: Element) {
//   const el = _el as HTMLElement
//   el.style.height = 'auto'
// }

// function onLeave(_el: Element, done: () => void) {
//   const el = _el as HTMLElement
//   el.style.height = '0'
//   el.addEventListener('transitionend', done, { once: true })
// }

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
    <ul>
      <li v-for="(menu, index) in menus" :key="menu.id">
        <UDivider
          v-if="index < menus.length"
          size="xs"
          class="py-0"
          :ui="{ border: { base: 'border-[#B8B8B8]/20' } }"
        />
        <div
          @click="toggleMenu(index)"
          @click.stop="selectMenu({ parent: menu.id })"
          :class="{
            'bg-[#BAA086]/10 text-[#BAA086] font-bold': isSelected({
              parent: menu.id,
            }),
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
        <!-- <transition
          @enter="onEnter"
          @after-enter="onAfterEnter"
          @before-leave="onBeforeLeave"
          @leave="onLeave"
          enter-active-class="transition transition-all duration-200 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition transition-all duration-300 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        > -->
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
        <!-- </transition> -->
      </li>
    </ul>
  </nav>
</template>
