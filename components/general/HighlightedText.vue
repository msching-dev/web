<script lang="ts" setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface HighlightedPart {
  component: string
  class: string
  text: string
}

/**
 * HighlightedText 元件
 * 用於解析帶有標記的文字並渲染對應的樣式。
 *
 * 支援的標記格式：
 * - `**文字**` → 粗體
 * - `::文字::` → 主題色 (class: `text-primary`)
 * - `!!文字!!` → 紅色 (class: `text-red-500`)
 * - `##文字##` → 背景色 (class: `bg-yellow-100`)
 * - `@@文字@@` → 水彩畫效果 (類似螢光筆)
 *
 * 範例：
 * ```
 * <HighlightedText
 *   text="這是 **粗體** 和 ::主題色:: 以及 !!紅色!! 的文字。"
 *   class="text-gray-800"
 * />
 * ```
 *
 * @prop {string} text - 要解析的文字內容（必填）。
 * @prop {string} [class] - 附加的樣式類名，會與內部樣式合併。
 */
const props = withDefaults(
  defineProps<{
    text: string
    class?: string
  }>(),
  {
    text: '', // 預設文字
  }
)

/**
 * 將文字解析為部分樣式化內容
 * - 將支援的標記語法轉換為對應的樣式。
 */
const parsedText = computed(() => {
  const parts = props.text.split(
    /(\*\*.*?\*\*|::.*?::|!!.*?!!|##.*?##|@@.*?@@)/g
  )
  return parts.map<HighlightedPart | string>((part) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return {
        component: 'strong',
        class: 'font-bold',
        text: part.slice(2, -2),
      }
    } else if (part.startsWith('::') && part.endsWith('::')) {
      return {
        component: 'span',
        class: 'text-primary font-bold',
        text: part.slice(2, -2),
      }
    } else if (part.startsWith('!!') && part.endsWith('!!')) {
      return {
        component: 'span',
        class: 'text-red-500',
        text: part.slice(2, -2),
      }
    } else if (part.startsWith('##') && part.endsWith('##')) {
      return {
        component: 'span',
        class: 'bg-yellow-100 px-1 rounded',
        text: part.slice(2, -2),
      }
    } else if (part.startsWith('@@') && part.endsWith('@@')) {
      return {
        component: 'span',
        class:
          'relative inline-block after:absolute after:inset-0 after:bg-yellow-300/50 after:-z-10',
        text: part.slice(2, -2),
      }
    } else {
      return part // 普通文字
    }
  })
})
</script>

<template>
  <span :class="cn('whitespace-pre-wrap', props.class)">
    <template v-for="(part, index) in parsedText" :key="index">
      <template v-if="typeof part === 'string'">
        {{ part }}
      </template>
      <component v-else :is="part.component" :class="part.class">
        {{ part.text }}
      </component>
    </template>
  </span>
</template>
