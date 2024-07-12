<script setup lang="ts">
import type { VNodeRef } from 'vue'

const { getSearchQuery, setSearchQuery, clearSearchQuery } = useSearching()
const searchQuery = ref(getSearchQuery())
const searchInput = ref<VNodeRef | null>(null)

const search = (search: string) => {
  setSearchQuery(search)
  searchInput.value?.$refs.input?.blur()
}

const reset = () => {
  clearSearchQuery()
  searchQuery.value = ''
}
</script>

<template>
  <form
    class="flex items-center justify-end mt-4 pr-[14px]"
    @submit.prevent="search(searchQuery)"
  >
    <UInput
      v-model="searchQuery"
      color="gray"
      placeholder="請輸入產品名稱關鍵字"
      name="search"
      type="text"
      enterkeyhint="search"
      ref="searchInput"
      :ui="{
        rounded: 'rounded-full',
        placeholder: 'placeholder-black-400 placeholder-black/20 font-semibold',
        padding: { sm: 'py-3 px-5' },
        leading: {
          padding: { sm: 'ps-12' },
        },
        icon: { trailing: { pointer: '' } },
        color: {
          gray: {
            outline:
              'bg-[#FAFAFA] ring-[#B99F85]/30 focus:ring-[#BAA086]/70 backdrop-blur-md',
          },
        },
      }"
    >
      <template #leading>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
        >
          <circle cx="15" cy="15" r="15" fill="#B99F85" />
          <path
            d="M21.2561 19.2279L18.7058 16.6776C19.3198 15.8602 19.6513 14.8653 19.6502 13.8429C19.6502 11.2316 17.5257 9.10715 14.9144 9.10715C12.3031 9.10715 10.1786 11.2316 10.1786 13.8429C10.1786 16.4542 12.3031 18.5787 14.9144 18.5787C15.9367 18.5799 16.9316 18.2484 17.749 17.6344L20.2993 20.1847C20.4284 20.3001 20.5968 20.3617 20.7699 20.3569C20.943 20.352 21.1077 20.2811 21.2301 20.1587C21.3525 20.0362 21.4235 19.8716 21.4283 19.6985C21.4332 19.5254 21.3715 19.357 21.2561 19.2279ZM11.5317 13.8429C11.5317 13.1739 11.7301 12.5199 12.1017 11.9636C12.4734 11.4073 13.0018 10.9738 13.6199 10.7177C14.238 10.4617 14.9181 10.3947 15.5743 10.5252C16.2305 10.6558 16.8332 10.9779 17.3063 11.451C17.7794 11.9241 18.1016 12.5268 18.2321 13.183C18.3626 13.8392 18.2956 14.5193 18.0396 15.1375C17.7836 15.7556 17.35 16.2839 16.7937 16.6556C16.2374 17.0273 15.5834 17.2257 14.9144 17.2257C14.0176 17.2246 13.1578 16.8678 12.5236 16.2337C11.8895 15.5995 11.5327 14.7398 11.5317 13.8429Z"
            fill="#FAFAFA"
          />
        </svg>
      </template>
      <template #trailing>
        <UButton
          v-show="!!searchQuery"
          color="gray"
          variant="link"
          icon="i-heroicons-x-mark-20-solid"
          :padded="false"
          @click="reset"
        />
      </template>
    </UInput>
  </form>
</template>

<style scoped></style>
