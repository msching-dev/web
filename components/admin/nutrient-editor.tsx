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
    if (newMode === 'standard') {
      onChange({ ...value, giftBox: [] })
    } else {
      onChange({ ...value, perServing: [], perHundred: [] })
    }
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
      <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-1">
        <button
          type="button"
          onClick={() => handleModeChange('standard')}
          className={`flex-1 cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === 'standard' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          一般商品
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('giftbox')}
          className={`flex-1 cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === 'giftbox' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          禮盒（按口味分）
        </button>
      </div>

      {mode === 'standard' && (
        <>
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700">每份營養成分</h4>
            <KeyValueListEditor
              items={value.perServing}
              onChange={(items) => onChange({ ...value, perServing: items })}
              keyPlaceholder="例：熱量"
              valuePlaceholder="0"
            />
          </div>
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700">每百克營養成分</h4>
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
            <div key={index} className="rounded-lg border border-gray-200 p-4">
              <div className="mb-3 flex items-center gap-2">
                <input
                  type="text"
                  value={group.taste}
                  onChange={(e) => updateGiftBoxTaste(index, e.target.value)}
                  placeholder="口味名稱（例：巧克力）"
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium focus:border-sandrift-300 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeGiftBoxGroup(index)}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
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
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-500 hover:border-sandrift-300 hover:text-sandrift-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            新增口味
          </button>
        </div>
      )}
    </div>
  )
}
