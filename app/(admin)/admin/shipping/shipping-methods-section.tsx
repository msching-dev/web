'use client'

import { useState, useTransition } from 'react'
import { Truck } from 'lucide-react'
import type { ShippingMethodConfig } from '@/types'
import { updateShippingMethods } from './actions'

interface Props {
  config: Record<string, ShippingMethodConfig>
}

export default function ShippingMethodsSection({ config: initial }: Props) {
  const [config, setConfig] = useState(initial)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  const handleToggle = (key: string) => {
    setConfig(prev => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }))
  }

  const handleFeeChange = (key: string, fee: number) => {
    setConfig(prev => ({
      ...prev,
      [key]: { ...prev[key], fee },
    }))
  }

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateShippingMethods(config)
      if (result.error) { setMessage(`錯誤：${result.error}`); return }
      setMessage('已儲存')
      setTimeout(() => setMessage(null), 2000)
    })
  }

  return (
    <section>
      <h2 className="mb-3 text-base font-bold text-sandrift-950">物流方式</h2>
      {message && (
        <div className="mb-3 rounded-lg bg-sandrift-50 px-3 py-2 text-xs text-sandrift-600 animate-fade-in">{message}</div>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {Object.entries(config).map(([key, method]) => (
          <div
            key={key}
            className={`rounded-2xl bg-white/60 p-4 ring-1 ring-sandrift-100/40 transition-all duration-200 ${
              method.enabled ? '' : 'opacity-50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-sandrift-400" />
                <span className="text-sm font-medium text-sandrift-900">{method.label}</span>
              </div>
              <button
                onClick={() => handleToggle(key)}
                className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors duration-200 ${
                  method.enabled ? 'bg-sandrift-500' : 'bg-sandrift-200'
                }`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                  method.enabled ? 'left-[22px]' : 'left-0.5'
                }`} />
              </button>
            </div>
            <div>
              <label className="mb-1 block text-xs text-sandrift-400">運費金額</label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-sandrift-500">NT$</span>
                <input
                  type="number"
                  value={method.fee}
                  onChange={(e) => handleFeeChange(key, Number(e.target.value))}
                  className="w-24 rounded-xl bg-white/60 h-8 px-2 text-sm tabular-nums text-sandrift-900 ring-1 ring-sandrift-200/30 placeholder:text-sandrift-300 focus:bg-white focus:ring-sandrift-300/50 focus:outline-none transition-all duration-200"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleSave}
        disabled={isPending}
        className="mt-3 cursor-pointer rounded-xl bg-sandrift-500 px-6 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-sandrift-600 disabled:opacity-50"
      >
        儲存設定
      </button>
    </section>
  )
}
