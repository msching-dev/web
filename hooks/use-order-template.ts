'use client'

import { useCallback } from 'react'

export function useOrderTemplate() {
  const generateTemplate = useCallback(
    (productName: string, price: number) => {
      return `🛒 我要訂購
📦 商品名稱：${productName}
💰 商品單價：NT$${price}
📝 數量：
📮 取貨方式：全家超商取貨
🏪 門市名稱：
👤 收件人姓名：
📱 收件人電話：`
    },
    []
  )

  const copyToClipboard = useCallback(async (text: string) => {
    // Try modern clipboard API first
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text)
        return true
      } catch {
        // Fall through to fallback
      }
    }

    // Fallback: execCommand
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textarea)
      return success
    } catch {
      return false
    }
  }, [])

  return { generateTemplate, copyToClipboard }
}
