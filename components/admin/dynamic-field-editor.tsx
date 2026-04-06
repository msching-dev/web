'use client'

import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import HighlightedText from '@/components/highlighted-text'

export interface FieldConfig {
  key: string
  label: string
  multiline?: boolean
  placeholder?: string
}

interface DynamicFieldEditorProps {
  fields: FieldConfig[]
  values: Record<string, string>
  onChange: (values: Record<string, string>) => void
}

const inputClass =
  'w-full rounded-xl bg-white/60 h-10 px-3 text-sm text-sandrift-900 ring-1 ring-sandrift-200/30 placeholder:text-sandrift-300 focus:bg-white focus:ring-sandrift-300/50 focus:outline-none transition-all duration-200'

const textareaClass =
  'w-full rounded-xl bg-white/60 px-3 py-2.5 text-sm text-sandrift-900 ring-1 ring-sandrift-200/30 placeholder:text-sandrift-300 focus:bg-white focus:ring-sandrift-300/50 focus:outline-none transition-all duration-200 resize-y'

function SyntaxHint() {
  const [open, setOpen] = useState(false)

  return (
    <div className="mb-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex cursor-pointer items-center gap-1 text-xs text-sandrift-400 hover:text-sandrift-600 transition-colors"
      >
        <HelpCircle className="h-3.5 w-3.5" />
        文字格式語法
      </button>
      {open && (
        <div className="mt-2 rounded-xl bg-sandrift-50/40 p-3 ring-1 ring-sandrift-100/30 animate-fade-in">
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <code className="rounded bg-white/60 px-1.5 py-0.5 text-sandrift-600 ring-1 ring-sandrift-100/40">**粗體**</code>
              <span className="text-sandrift-400">→</span>
              <strong className="font-semibold text-sandrift-900">粗體</strong>
            </div>
            <div className="flex items-center gap-2">
              <code className="rounded bg-white/60 px-1.5 py-0.5 text-sandrift-600 ring-1 ring-sandrift-100/40">==高亮==</code>
              <span className="text-sandrift-400">→</span>
              <mark className="rounded bg-sandrift-200/50 px-1 py-0.5 text-sandrift-700 text-xs">高亮</mark>
            </div>
            <div className="flex items-center gap-2">
              <code className="rounded bg-white/60 px-1.5 py-0.5 text-sandrift-600 ring-1 ring-sandrift-100/40">::標籤::</code>
              <span className="text-sandrift-400">→</span>
              <span className="inline-flex rounded-full bg-sandrift-100/60 px-1.5 py-0.5 text-xs font-medium text-sandrift-700 ring-1 ring-sandrift-200/30">標籤</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="rounded bg-white/60 px-1.5 py-0.5 text-sandrift-600 ring-1 ring-sandrift-100/40">- 列表</code>
              <span className="text-sandrift-400">→</span>
              <span className="flex items-center gap-1 text-sandrift-600">
                <span className="h-1 w-1 rounded-full bg-sandrift-300" />
                列表
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function DynamicFieldEditor({
  fields,
  values,
  onChange,
}: DynamicFieldEditorProps) {
  const [previewKey, setPreviewKey] = useState<string | null>(null)
  const hasMultiline = fields.some((f) => f.multiline)

  const handleChange = (key: string, val: string) => {
    onChange({ ...values, [key]: val })
  }

  return (
    <div className="space-y-4">
      {hasMultiline && <SyntaxHint />}

      {fields.map((field) => {
        const value = values[field.key] || ''
        const showPreview = previewKey === field.key && value.trim() !== ''

        return (
          <div key={field.key}>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-sandrift-700">
                {field.label}
              </label>
              {field.multiline && value.trim() && (
                <button
                  type="button"
                  onClick={() => setPreviewKey(showPreview ? null : field.key)}
                  className="cursor-pointer text-xs text-sandrift-400 hover:text-sandrift-600 transition-colors"
                >
                  {showPreview ? '隱藏預覽' : '預覽'}
                </button>
              )}
            </div>
            {field.multiline ? (
              <>
                <textarea
                  value={value}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder ?? '支援 **粗體**、==高亮==、::標籤::、- 列表'}
                  rows={4}
                  className={textareaClass}
                />
                {showPreview && (
                  <div className="mt-2 rounded-xl bg-sandrift-50/40 p-4 ring-1 ring-sandrift-100/30 animate-fade-in">
                    <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-sandrift-300">預覽</p>
                    <HighlightedText
                      text={value}
                      className="text-sm leading-relaxed text-sandrift-600"
                    />
                  </div>
                )}
              </>
            ) : (
              <input
                type="text"
                value={value}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className={inputClass}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
