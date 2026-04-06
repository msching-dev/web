'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import KeyValueListEditor, { type KeyValueItem } from './key-value-list-editor'

interface GiftBoxGroup {
  taste: string
  content: KeyValueItem[]
}

interface NutrientData {
  perServing: KeyValueItem[]
  perHundred: KeyValueItem[]
  giftBox: GiftBoxGroup[]
}

interface NutrientEditorProps {
  value: NutrientData
  onChange: (value: NutrientData) => void
}

export default function NutrientEditor({ value, onChange }: NutrientEditorProps) {
  const hasGiftBox = value.giftBox.length > 0
  const [mode, setMode] = useState<'standard' | 'giftbox'>(
    hasGiftBox ? 'giftbox' : 'standard'
  )

  const handleModeChange = (newMode: 'standard' | 'giftbox') => {
    setMode(newMode)
    // 切換模式時保留所有資料，只切換顯示
  }

  const addGiftBoxGroup = () => {
    onChange({
      ...value,
      giftBox: [...value.giftBox, { taste: '', content: [] }],
    })
  }

  const removeGiftBoxGroup = (index: number) => {
    onChange({
      ...value,
      giftBox: value.giftBox.filter((_, i) => i !== index),
    })
  }

  const updateGiftBoxTaste = (index: number, taste: string) => {
    const updated = value.giftBox.map((g, i) =>
      i === index ? { ...g, taste } : g
    )
    onChange({ ...value, giftBox: updated })
  }

  const updateGiftBoxContent = (index: number, content: KeyValueItem[]) => {
    const updated = value.giftBox.map((g, i) =>
      i === index ? { ...g, content } : g
    )
    onChange({ ...value, giftBox: updated })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-xl bg-sandrift-50/50 p-1">
        <button
          type="button"
          onClick={() => handleModeChange('standard')}
          className={`flex-1 cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
            mode === 'standard' ? 'bg-sandrift-50 text-sandrift-900 shadow-sm' : 'text-sandrift-400 hover:text-sandrift-600'
          }`}
        >
          一般商品
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('giftbox')}
          className={`flex-1 cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
            mode === 'giftbox' ? 'bg-sandrift-50 text-sandrift-900 shadow-sm' : 'text-sandrift-400 hover:text-sandrift-600'
          }`}
        >
          禮盒（按口味分）
        </button>
      </div>

      {mode === 'standard' && (
        <>
          <div>
            <h4 className="mb-2 text-sm font-medium text-sandrift-700">每份營養成分</h4>
            <KeyValueListEditor
              items={value.perServing}
              onChange={(items) => onChange({ ...value, perServing: items })}
              keyPlaceholder="例：熱量"
              valuePlaceholder="0"
            />
          </div>
          <div>
            <h4 className="mb-2 text-sm font-medium text-sandrift-700">每百克營養成分</h4>
            <KeyValueListEditor
              items={value.perHundred}
              onChange={(items) => onChange({ ...value, perHundred: items })}
              keyPlaceholder="例：熱量"
              valuePlaceholder="0"
            />
          </div>
        </>
      )}

      {mode === 'giftbox' && (
        <div className="space-y-4">
          {value.giftBox.map((group, index) => (
            <div key={index} className="rounded-xl bg-white/40 ring-1 ring-sandrift-100/40 p-4">
              <div className="mb-3 flex items-center gap-2">
                <input
                  type="text"
                  value={group.taste}
                  onChange={(e) => updateGiftBoxTaste(index, e.target.value)}
                  placeholder="口味名稱（例：巧克力）"
                  className="flex-1 rounded-xl bg-white/60 h-10 px-3 text-sm font-medium text-sandrift-900 ring-1 ring-sandrift-200/30 placeholder:text-sandrift-300 focus:bg-white focus:ring-sandrift-300/50 focus:outline-none transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => removeGiftBoxGroup(index)}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-sandrift-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <KeyValueListEditor
                items={group.content}
                onChange={(items) => updateGiftBoxContent(index, items)}
                keyPlaceholder="例：熱量"
                valuePlaceholder="0"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addGiftBoxGroup}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-dashed border-sandrift-200/50 px-3 py-2.5 text-sm text-sandrift-400 hover:border-sandrift-300/50 hover:text-sandrift-600 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            新增口味
          </button>
        </div>
      )}
    </div>
  )
}
