'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DynamicFieldEditor, { type FieldConfig } from './dynamic-field-editor'
import KeyValueListEditor from './key-value-list-editor'
import NutrientEditor from './nutrient-editor'
import ImageUploader from './image-uploader'
import { type ProductFormData, defaultProductFormData } from '@/lib/validations/product'

interface ProductFormProps {
  initialData?: ProductFormData
  categories: Array<{ id: string; name: string; slug: string }>
  onSubmit: (data: ProductFormData) => Promise<{ success?: boolean; error?: Record<string, string[]> | string }>
  submitLabel: string
}

const AVAILABLE_TAGS = [
  { value: 'hot', label: '熱銷' },
  { value: 'new', label: '新品' },
  { value: 'top_1', label: 'TOP 1' },
  { value: 'top_2', label: 'TOP 2' },
  { value: 'top_3', label: 'TOP 3' },
  { value: 'christmas', label: '聖誕' },
]

const detailFields: FieldConfig[] = [
  { key: 'desc', label: '商品介紹', multiline: true, placeholder: '支援 **粗體**、==高亮==、- 列表' },
  { key: 'nonAdditive', label: '無添加聲明', multiline: true },
  { key: 'howToEat', label: '食用方式', multiline: true },
  { key: 'preservationMethod', label: '保存方式', multiline: true },
  { key: 'precautions', label: '注意事項', multiline: true },
  { key: 'tastePeriod', label: '賞味期限', multiline: true },
]

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const inputClass =
  'w-full rounded-xl bg-white/60 h-10 px-3 text-sm text-sandrift-900 ring-1 ring-sandrift-200/30 placeholder:text-sandrift-300 focus:bg-white focus:ring-sandrift-300/50 focus:outline-none transition-all duration-200'

const sectionClass = 'rounded-2xl bg-white/60 ring-1 ring-sandrift-100/40 p-6'

export default function ProductForm({
  initialData,
  categories,
  onSubmit,
  submitLabel,
}: ProductFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<ProductFormData>(initialData ?? defaultProductFormData)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [showAvailability, setShowAvailability] = useState(
    !!(initialData?.available_from || initialData?.available_until)
  )
  const [descOpen, setDescOpen] = useState(!initialData)

  function update<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSlugGenerate() {
    if (!form.slug && form.name) {
      update('slug', slugify(form.name))
    }
  }

  function handleTagToggle(tag: string) {
    const current = form.tags ?? []
    if (current.includes(tag)) {
      update('tags', current.filter((t) => t !== tag))
    } else {
      update('tags', [...current, tag])
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setFormError(null)
    setFieldErrors({})

    try {
      const result = await onSubmit(form)

      if (result?.error) {
        if (typeof result.error === 'string') {
          setFormError(result.error)
        } else if (result.error._form) {
          setFormError(result.error._form[0])
        } else {
          setFieldErrors(result.error)
          setFormError('請檢查表單欄位')
        }
        return
      }

      if (result?.success) {
        router.push('/admin/products')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Basic Info */}
      <div className={sectionClass}>
        <h2 className="mb-4 text-sm font-bold text-sandrift-950">基本資訊</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Name */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-sandrift-700">
              商品名稱 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              onBlur={handleSlugGenerate}
              placeholder="例：伯爵茶費南雪"
              className={inputClass}
              required
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.name[0]}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-sandrift-700">
              網址代碼 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => update('slug', e.target.value)}
              placeholder="例：almondCookie"
              className={inputClass}
              required
            />
            {fieldErrors.slug ? (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.slug[0]}</p>
            ) : (
              <p className="mt-1 text-xs text-sandrift-400">用於網址識別，例如 msching.com/products/almondCookie</p>
            )}
          </div>

          {/* Alias */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-sandrift-700">別名（alias）</label>
            <input
              type="text"
              value={form.alias ?? ''}
              onChange={(e) => update('alias', e.target.value)}
              placeholder="例：費南雪"
              className={inputClass}
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-sandrift-700">分類</label>
            <select
              value={form.category_id ?? ''}
              onChange={(e) => update('category_id', e.target.value || null)}
              className={inputClass}
            >
              <option value="">未分類</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-sandrift-700">
              售價 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              value={form.price || ''}
              onChange={(e) => update('price', parseFloat(e.target.value) || 0)}
              placeholder="0"
              className={inputClass}
              required
            />
            {fieldErrors.price && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.price[0]}</p>
            )}
          </div>

          {/* Compare Price */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-sandrift-700">原價（劃線價）</label>
            <input
              type="number"
              min={1}
              value={form.compare_price ?? ''}
              onChange={(e) => {
                const v = e.target.value
                update('compare_price', v ? parseFloat(v) : null)
              }}
              placeholder="留空表示無劃線價"
              className={inputClass}
            />
          </div>

          {/* Tags */}
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-sandrift-700">標籤</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map(({ value, label }) => {
                const active = (form.tags ?? []).includes(value)
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleTagToggle(value)}
                    className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      active
                        ? 'bg-sandrift-500 text-white'
                        : 'ring-1 ring-sandrift-200/30 bg-white/60 text-sandrift-600 hover:ring-sandrift-300/50 hover:text-sandrift-700'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Toggles */}
          <div className="sm:col-span-2 flex gap-6">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => update('is_active', e.target.checked)}
                className="h-4 w-4 rounded accent-sandrift-500"
              />
              <span className="text-sm font-medium text-sandrift-700">上架顯示</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => update('is_featured', e.target.checked)}
                className="h-4 w-4 rounded accent-sandrift-500"
              />
              <span className="text-sm font-medium text-sandrift-700">精選商品</span>
            </label>
          </div>

          {/* 檔期設定 */}
          <div className="sm:col-span-2 space-y-3">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={showAvailability}
                onChange={(e) => {
                  if (!e.target.checked) {
                    setShowAvailability(false)
                    update('available_from', null)
                    update('available_until', null)
                  } else {
                    setShowAvailability(true)
                  }
                }}
                className="h-4 w-4 rounded accent-sandrift-500"
              />
              <span className="text-sm font-medium text-sandrift-700">設定限定檔期</span>
            </label>
            {showAvailability && (
              <div className="grid grid-cols-2 gap-3 animate-fade-in">
                <div>
                  <label className="mb-1 block text-xs text-sandrift-500">開始日期</label>
                  <input
                    type="date"
                    value={form.available_from ?? ''}
                    onChange={(e) => update('available_from', e.target.value || null)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-sandrift-500">結束日期</label>
                  <input
                    type="date"
                    value={form.available_until ?? ''}
                    onChange={(e) => update('available_until', e.target.value || null)}
                    className={inputClass}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className={sectionClass}>
        <h2 className="mb-4 text-sm font-bold text-sandrift-950">庫存與規格</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-sandrift-700">庫存數量</label>
            <input
              type="number"
              min={0}
              value={form.stock_quantity ?? ''}
              onChange={(e) => update('stock_quantity', e.target.value ? parseInt(e.target.value) : null)}
              placeholder="留空表示不限"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-sandrift-700">最大訂購數量</label>
            <input
              type="number"
              min={1}
              value={form.max_order_qty ?? ''}
              onChange={(e) => update('max_order_qty', e.target.value ? parseInt(e.target.value) : null)}
              placeholder="留空表示不限"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-sandrift-700">最小訂購數量</label>
            <input
              type="number"
              min={1}
              value={form.min_order_qty ?? ''}
              onChange={(e) => update('min_order_qty', e.target.value ? parseInt(e.target.value) : null)}
              placeholder="留空表示不限"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-sandrift-700">份量（portion_size）</label>
            <input
              type="number"
              min={0}
              step="any"
              value={form.portion_size ?? ''}
              onChange={(e) => update('portion_size', e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="例：6"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-sandrift-700">內容物規格（include_size）</label>
            <input
              type="text"
              value={form.include_size ?? ''}
              onChange={(e) => update('include_size', e.target.value)}
              placeholder="例：6 顆 / 盒"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-sandrift-700">單位（unit）</label>
            <input
              type="text"
              value={form.unit ?? ''}
              onChange={(e) => update('unit', e.target.value)}
              placeholder="例：顆"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-sandrift-700">保存期限</label>
            <input
              type="text"
              value={form.shelf_life ?? ''}
              onChange={(e) => update('shelf_life', e.target.value)}
              placeholder="例：常溫 7 天"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-sandrift-700">保存方式</label>
            <input
              type="text"
              value={form.storage_instructions ?? ''}
              onChange={(e) => update('storage_instructions', e.target.value)}
              placeholder="例：請勿冷凍"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-sandrift-700">過敏原</label>
            <input
              type="text"
              value={form.allergens ?? ''}
              onChange={(e) => update('allergens', e.target.value)}
              placeholder="例：含麩質、蛋、乳製品"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Description — 可收合 */}
      <div className={sectionClass}>
        <button
          type="button"
          onClick={() => setDescOpen(!descOpen)}
          className="flex w-full cursor-pointer items-center justify-between"
        >
          <h2 className="text-sm font-bold text-sandrift-950">商品描述</h2>
          <span className={`text-sandrift-400 transition-transform duration-200 ${descOpen ? 'rotate-180' : ''}`}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </span>
        </button>
        {descOpen && (
          <div className="mt-4 animate-fade-in">
            <DynamicFieldEditor
              fields={detailFields}
              values={form.detail as Record<string, string>}
              onChange={(values) =>
                update('detail', {
                  desc: values.desc ?? '',
                  nonAdditive: values.nonAdditive ?? '',
                  howToEat: values.howToEat ?? '',
                  preservationMethod: values.preservationMethod ?? '',
                  precautions: values.precautions ?? '',
                  tastePeriod: values.tastePeriod ?? '',
                })
              }
            />
          </div>
        )}
      </div>

      {/* Specifications */}
      <div className={sectionClass}>
        <h2 className="mb-4 text-sm font-bold text-sandrift-950">規格表</h2>
        <KeyValueListEditor
          items={form.specifications ?? []}
          onChange={(items) => update('specifications', items)}
          keyLabel="規格名稱"
          valueLabel="數值"
          keyPlaceholder="例：重量"
          valuePlaceholder="0"
        />
      </div>

      {/* Nutrition */}
      <div className={sectionClass}>
        <h2 className="mb-4 text-sm font-bold text-sandrift-950">營養成分</h2>
        <NutrientEditor
          value={form.nutrition}
          onChange={(value) => update('nutrition', value)}
        />
      </div>

      {/* Images */}
      <div className={sectionClass}>
        <h2 className="mb-4 text-sm font-bold text-sandrift-950">商品圖片</h2>
        <ImageUploader
          slug={form.slug}
          images={form.images ?? []}
          onChange={(images) => update('images', images)}
        />
      </div>

      {/* Sort Order */}
      <div className={sectionClass}>
        <h2 className="mb-4 text-sm font-bold text-sandrift-950">排序</h2>
        <div className="max-w-xs">
          <label className="mb-1.5 block text-sm font-medium text-sandrift-700">排序值（數字越小越前面）</label>
          <input
            type="number"
            value={form.sort_order ?? ''}
            onChange={(e) => update('sort_order', e.target.value ? parseInt(e.target.value) : null)}
            placeholder="留空表示自動"
            className={inputClass}
          />
        </div>
      </div>

      {/* Form Error */}
      {formError && (
        <div className="rounded-xl ring-1 ring-red-100/50 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pb-8">
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="cursor-pointer rounded-xl bg-white/60 px-5 py-2.5 text-sm font-medium text-sandrift-700 ring-1 ring-sandrift-200/30 transition-all duration-200 hover:bg-sandrift-50 disabled:opacity-50"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="cursor-pointer rounded-xl bg-sandrift-500 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-sandrift-600 disabled:opacity-50"
        >
          {submitting ? '儲存中...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
