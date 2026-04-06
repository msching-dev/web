'use client'

import { Plus, Trash2 } from 'lucide-react'

export interface KeyValueItem {
  key: string
  value: number
}

interface KeyValueListEditorProps {
  items: KeyValueItem[]
  onChange: (items: KeyValueItem[]) => void
  keyLabel?: string
  valueLabel?: string
  keyPlaceholder?: string
  valuePlaceholder?: string
}

export default function KeyValueListEditor({
  items,
  onChange,
  keyLabel = '名稱',
  valueLabel = '數值',
  keyPlaceholder = '例：熱量',
  valuePlaceholder = '0',
}: KeyValueListEditorProps) {
  const addItem = () => {
    onChange([...items, { key: '', value: 0 }])
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: 'key' | 'value', val: string) => {
    const updated = items.map((item, i) =>
      i === index
        ? { ...item, [field]: field === 'value' ? parseFloat(val) || 0 : val }
        : item
    )
    onChange(updated)
  }

  return (
    <div className="space-y-2">
      {items.length > 0 && (
        <div className="grid grid-cols-[1fr_120px_32px] gap-2 text-xs font-medium text-sandrift-400">
          <span>{keyLabel}</span>
          <span>{valueLabel}</span>
          <span />
        </div>
      )}
      {items.map((item, index) => (
        <div key={index} className="grid grid-cols-[1fr_120px_32px] gap-2 items-center">
          <input
            type="text"
            value={item.key}
            onChange={(e) => updateItem(index, 'key', e.target.value)}
            placeholder={keyPlaceholder}
            className="rounded-xl bg-white/60 h-10 px-3 text-sm text-sandrift-900 ring-1 ring-sandrift-200/30 placeholder:text-sandrift-300 focus:bg-white focus:ring-sandrift-300/50 focus:outline-none transition-all duration-200"
          />
          <input
            type="number"
            step="any"
            value={item.value}
            onChange={(e) => updateItem(index, 'value', e.target.value)}
            placeholder={valuePlaceholder}
            className="rounded-xl bg-white/60 h-10 px-3 text-sm text-sandrift-900 ring-1 ring-sandrift-200/30 placeholder:text-sandrift-300 focus:bg-white focus:ring-sandrift-300/50 focus:outline-none transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-sandrift-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-dashed border-sandrift-200/50 px-3 py-2.5 text-sm text-sandrift-400 hover:border-sandrift-300/50 hover:text-sandrift-600 transition-all duration-200"
      >
        <Plus className="h-4 w-4" />
        新增項目
      </button>
    </div>
  )
}
