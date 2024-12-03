import { ref } from 'vue'
import { useClipboard } from '@vueuse/core'

export function useOrderTemplate() {
  const template = `
訂購人姓名：
訂購人手機號碼：
全家店舖名稱（取貨用）：
訂購品項與數量：
`.trim()

  const { copy, copied } = useClipboard()

  const handleCopy = async () => {
    await copy(template)
  }

  return {
    template,
    copied,
    handleCopy,
  }
}
