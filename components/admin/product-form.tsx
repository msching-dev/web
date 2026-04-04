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
  onSubmit: (data: ProductFormData) => Promise<{ success?: boolean; error?: any }>
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
  { key: 'desc', label: '商品介紹', multiline: true, placeholder: '支援 ## ## 標記和 :: :: 標記' },
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
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sandrift-300 focus:outline-none'

const sectionClass = 'rounded-xl border border-gray-200 bg-white p-6'

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
        <h2 className="mb-4 text-sm font-semibold text-gray-900">基本資訊</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Name */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
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
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => update('slug', e.target.value)}
              placeholder="例：earl-grey-financier"
              className={inputClass}
              required
            />
            {fieldErrors.slug ? (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.slug[0]}</p>
            ) : (
              <p className="mt-1 text-xs text-gray-400">小寫英數 + 連字號，商品名稱離焦後自動產生</p>
            )}
          </div>

          {/* Alias */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">別名（alias）</label>
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
            <label className="mb-1.5 block text-sm font-medium text-gray-700">分類</label>
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
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
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
            <label className="mb-1.5 block text-sm font-medium text-gray-700">原價（劃線價）</label>
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
            <label className="mb-2 block text-sm font-medium text-gray-700">標籤</label>
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
                        : 'border border-gray-200 bg-white text-gray-600 hover:border-sandrift-300 hover:text-sandrift-600'
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
                className="h-4 w-4 rounded border-gray-300 accent-sandrift-500"
              />
              <span className="text-sm font-medium text-gray-700">上架顯示</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => update('is_featured', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 accent-sandrift-500"
              />
              <span className="text-sm font-medium text-gray-700">精選商品</span>
            </label>
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className={sectionClass}>
        <h2 className="mb-4 text-sm font-semibold text-gray-900">庫存與規格</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">庫存數量</label>
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
            <label className="mb-1.5 block text-sm font-medium text-gray-700">最大訂購數量</label>
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
            <label className="mb-1.5 block text-sm font-medium text-gray-700">最小訂購數量</label>
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
            <label className="mb-1.5 block text-sm font-medium text-gray-700">份量（portion_size）</label>
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
            <label className="mb-1.5 block text-sm font-medium text-gray-700">內容物規格（include_size）</label>
            <input
              type="text"
              value={form.include_size ?? ''}
              onChange={(e) => update('include_size', e.target.value)}
              placeholder="例：6 顆 / 盒"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">單位（unit）</label>
            <input
              type="text"
              value={form.unit ?? ''}
              onChange={(e) => update('unit', e.target.value)}
              placeholder="例：顆"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">保存期限</label>
            <input
              type="text"
              value={form.shelf_life ?? ''}
              onChange={(e) => update('shelf_life', e.target.value)}
              placeholder="例：常溫 7 天"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">保存方式</label>
            <input
              type="text"
              value={form.storage_instructions ?? ''}
              onChange={(e) => update('storage_instructions', e.target.value)}
              placeholder="例：請勿冷凍"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">過敏原</label>
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

      {/* Description */}
      <div className={sectionClass}>
        <h2 className="mb-4 text-sm font-semibold text-gray-900">商品描述</h2>
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

      {/* Specifications */}
      <div className={sectionClass}>
        <h2 className="mb-4 text-sm font-semibold text-gray-900">規格表</h2>
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
        <h2 className="mb-4 text-sm font-semibold text-gray-900">營養成分</h2>
        <NutrientEditor
          value={form.nutrition}
          onChange={(value) => update('nutrition', value)}
        />
      </div>

      {/* Images */}
      <div className={sectionClass}>
        <h2 className="mb-4 text-sm font-semibold text-gray-900">商品圖片</h2>
        <ImageUploader
          slug={form.slug}
          images={form.images ?? []}
          onChange={(images) => update('images', images)}
        />
      </div>

      {/* Sort Order */}
      <div className={sectionClass}>
        <h2 className="mb-4 text-sm font-semibold text-gray-900">排序</h2>
        <div className="max-w-xs">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">排序值（數字越小越前面）</label>
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
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pb-8">
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="cursor-pointer rounded-lg border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="cursor-pointer rounded-lg bg-sandrift-500 px-5 py-2 text-sm font-medium text-white hover:bg-sandrift-600 transition-colors disabled:opacity-60"
        >
          {submitting ? '儲存中...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
