'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Copy, Check } from 'lucide-react'
import { useOrderTemplate } from '@/hooks/use-order-template'
import { socialMediaLinks } from '@/lib/constants'

interface OrderTooltipProps {
  productName: string
  price: number
}

export default function OrderTooltip({
  productName,
  price,
}: OrderTooltipProps) {
  const { generateTemplate, copyToClipboard } = useOrderTemplate()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const template = generateTemplate(productName, price)
    const success = await copyToClipboard(template)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="rounded-2xl bg-sandrift-50/40 p-4 ring-1 ring-sandrift-100/40">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-[13px] font-semibold text-sandrift-900">訂購方式</h4>
          <p className="text-[11px] text-sandrift-400 mt-0.5">透過 LINE 或 IG 私訊下單</p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-sandrift-500 ring-1 ring-sandrift-200/40 transition-all duration-200 hover:bg-white hover:text-sandrift-700 active:scale-95"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-600">已複製</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              複製模板
            </>
          )}
        </button>
      </div>

      <div className="flex gap-2">
        <a
          href={socialMediaLinks.lineOfficial}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-sandrift-500 py-2 text-[13px] font-medium text-white transition-colors hover:bg-sandrift-600 active:scale-[0.98]"
        >
          <Image src="/images/footer/icon_line.png" alt="LINE" width={16} height={16} className="h-4 w-4 brightness-0 invert" />
          LINE 下單
        </a>
        <a
          href={socialMediaLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl py-2 text-[13px] font-medium text-sandrift-700 ring-1 ring-sandrift-200/50 transition-colors hover:bg-white active:scale-[0.98]"
        >
          <Image src="/images/footer/icon_ig.png" alt="Instagram" width={16} height={16} className="h-4 w-4" />
          IG 下單
        </a>
      </div>
    </div>
  )
}
