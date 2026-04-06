import { z } from 'zod'

export const keyValueSchema = z.object({
  key: z.string().min(1, '名稱不可為空'),
  value: z.number(),
})

export const giftBoxNutrientSchema = z.object({
  taste: z.string().min(1, '口味不可為空'),
  content: z.array(keyValueSchema),
})

export const productImageSchema = z.object({
  url: z.string().url(),
  alt: z.string(),
  sort_order: z.number(),
})

export const productSchema = z.object({
  name: z.string().min(1, '商品名稱不可為空'),
  slug: z.string().min(1, 'Slug 不可為空').regex(/^[a-zA-Z0-9]+(?:[_-][a-zA-Z0-9]+)*$/, 'Slug 格式錯誤（英數 + 連字號或底線）'),
  alias: z.string().optional().default(''),
  price: z.number().positive('售價必須大於 0'),
  compare_price: z.number().positive().nullable().optional(),
  category_id: z.string().uuid().nullable().optional(),
  tags: z.array(z.string()).default([]),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  description: z.string().optional().default(''),
  stock_quantity: z.number().int().min(0).nullable().optional(),
  max_order_qty: z.number().int().positive().nullable().optional(),
  min_order_qty: z.number().int().positive().nullable().optional(),
  portion_size: z.number().min(0).nullable().optional(),
  include_size: z.string().optional().default(''),
  unit: z.string().optional().default(''),
  shelf_life: z.string().optional().default(''),
  storage_instructions: z.string().optional().default(''),
  allergens: z.string().optional().default(''),
  detail: z.object({
    desc: z.string().default(''),
    nonAdditive: z.string().default(''),
    howToEat: z.string().default(''),
    preservationMethod: z.string().default(''),
    precautions: z.string().default(''),
    tastePeriod: z.string().default(''),
  }).default({ desc: '', nonAdditive: '', howToEat: '', preservationMethod: '', precautions: '', tastePeriod: '' }),
  specifications: z.array(keyValueSchema).default([]),
  nutrition: z.object({
    perServing: z.array(keyValueSchema).default([]),
    perHundred: z.array(keyValueSchema).default([]),
    giftBox: z.array(giftBoxNutrientSchema).default([]),
  }).default({ perServing: [], perHundred: [], giftBox: [] }),
  images: z.array(productImageSchema).max(8, '最多 8 張圖片').default([]),
  sort_order: z.number().int().nullable().optional(),
  available_from: z.string().nullable().optional(),
  available_until: z.string().nullable().optional(),
})

export type ProductFormData = z.infer<typeof productSchema>

export const defaultProductFormData: ProductFormData = {
  name: '',
  slug: '',
  alias: '',
  price: 0,
  compare_price: null,
  category_id: null,
  tags: [],
  is_active: true,
  is_featured: false,
  description: '',
  stock_quantity: null,
  max_order_qty: null,
  min_order_qty: null,
  portion_size: null,
  include_size: '',
  unit: '',
  shelf_life: '',
  storage_instructions: '',
  allergens: '',
  detail: {
    desc: '',
    nonAdditive: '',
    howToEat: '',
    preservationMethod: '',
    precautions: '',
    tastePeriod: '',
  },
  specifications: [],
  nutrition: {
    perServing: [],
    perHundred: [],
    giftBox: [],
  },
  images: [],
  sort_order: null,
  available_from: null,
  available_until: null,
}
