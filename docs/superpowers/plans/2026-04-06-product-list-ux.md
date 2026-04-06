# 商品列表 UX 改善 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 改善首頁商品區塊 UX（預設推薦、排序邏輯、單位顯示）+ 後台商品列表拖曳排序

**Architecture:** 後台列表拆成 Server（取資料）+ Client（dnd-kit 可拖曳表格），拖曳後批次更新 sort_order。前台修改 home-content 的 tab 預設值、篩選邏輯、標題連動，以及 product-card 加單位顯示。

**Tech Stack:** Next.js App Router, @dnd-kit/core + @dnd-kit/sortable（已安裝）, Supabase, TypeScript

---

## File Structure

| 動作 | 路徑 | 職責 |
|------|------|------|
| Create | `app/(admin)/admin/products/sortable-product-table.tsx` | 可拖曳商品表格（Client Component） |
| Modify | `app/(admin)/admin/products/page.tsx` | 拆出資料層，傳給 Client 元件 |
| Modify | `app/(admin)/admin/products/actions.ts` | 新增 `reorderProducts` Server Action |
| Modify | `components/home-content.tsx` | 預設 tab、篩選邏輯、標題連動 |
| Modify | `components/product-card.tsx` | 價格旁加單位 |

---

### Task 1: 新增 `reorderProducts` Server Action

**Files:**
- Modify: `app/(admin)/admin/products/actions.ts`

- [ ] **Step 1: 新增 reorderProducts function**

在 `actions.ts` 最後面加上：

```ts
export async function reorderProducts(orderedIds: string[]) {
  await requireAdmin()

  // 批次更新 sort_order：index 即為新排序
  const updates = orderedIds.map((id, index) => ({
    id,
    sort_order: index + 1,
  }))

  // Supabase 不支援批次 update，用 Promise.all 逐筆更新
  const results = await Promise.all(
    updates.map(({ id, sort_order }) =>
      supabaseAdmin
        .from('products')
        .update({ sort_order })
        .eq('id', id)
    )
  )

  const failed = results.find((r) => r.error)
  if (failed?.error) {
    return { error: '排序更新失敗：' + failed.error.message }
  }

  revalidateProducts()
  return { success: true }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/(admin)/admin/products/actions.ts
git commit -m "feat(admin): add reorderProducts server action"
```

---

### Task 2: 建立可拖曳商品表格 Client Component

**Files:**
- Create: `app/(admin)/admin/products/sortable-product-table.tsx`

- [ ] **Step 1: 建立 sortable-product-table.tsx**

此元件接收 products 陣列，分成上架/下架兩區，上架區支援拖曳。

```tsx
'use client'

import { useState, useOptimistic, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import StatusBadge from '@/components/admin/status-badge'
import ProductListActions from './product-list-actions'
import { reorderProducts } from './actions'

// 從 getAllProducts 回傳的型別（raw DB row）
type ProductRow = {
  id: string
  name: string
  slug: string
  price: number
  is_active: boolean | null
  sort_order: number | null
  tags: string[] | null
  available_from: string | null
  available_until: string | null
  images: Array<{ url: string; alt: string }> | null
  categories: { name: string; slug: string } | null
}

interface SortableProductTableProps {
  products: ProductRow[]
}

// ── Sortable Row ────────────────────────────────────────────────────────────

function SortableRow({
  product,
  index,
}: {
  product: ProductRow
  index: number
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <tr
      ref={setNodeRef}
      style={{ ...style, '--stagger-index': index } as React.CSSProperties}
      className="animate-stagger-in hover:bg-sandrift-50/30 transition-colors"
    >
      <td className="w-10 px-2 py-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="flex h-8 w-8 cursor-grab items-center justify-center rounded-lg text-sandrift-300 transition-colors hover:bg-sandrift-50 hover:text-sandrift-500 active:cursor-grabbing"
          aria-label="拖曳排序"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </td>
      <ProductCells product={product} />
    </tr>
  )
}

// ── Static Row（下架商品，不可拖曳）────────────────────────────────────────

function StaticRow({
  product,
  index,
}: {
  product: ProductRow
  index: number
}) {
  return (
    <tr
      style={{ '--stagger-index': index } as React.CSSProperties}
      className="animate-stagger-in opacity-50 transition-colors"
    >
      <td className="w-10 px-2 py-3" />
      <ProductCells product={product} />
    </tr>
  )
}

// ── Shared cells ────────────────────────────────────────────────────────────

function ProductCells({ product }: { product: ProductRow }) {
  const images = product.images || []
  const firstImage = images[0]?.url
  const category = product.categories
  const tags = product.tags || []

  return (
    <>
      <td className="whitespace-nowrap px-4 py-3">
        <div className="flex items-center gap-3">
          {firstImage && (
            <Image
              src={firstImage}
              alt={product.name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-lg object-cover"
            />
          )}
          <span className="font-medium text-sandrift-900">{product.name}</span>
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <code className="rounded bg-sandrift-50/60 px-1.5 py-0.5 text-xs text-sandrift-600">
          {product.slug}
        </code>
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-sandrift-900">
        ${product.price}
      </td>
      <td className="px-4 py-3">
        {category && (
          <span className="rounded-full bg-sandrift-50 px-2 py-0.5 text-xs text-sandrift-700">
            {category.name}
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={product.is_active ? 'active' : 'inactive'} />
      </td>
      <td className="px-4 py-3">
        {product.available_from || product.available_until ? (
          (() => {
            const now = new Date()
            const from = product.available_from ? new Date(product.available_from) : null
            const until = product.available_until ? new Date(product.available_until) : null
            const formatDate = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`

            if (from && from > now) {
              return <StatusBadge status="upcoming" label={`${formatDate(from)} 開始`} />
            }
            if (until && until < now) {
              return <StatusBadge status="ended" label={`已結束 ${formatDate(until)}`} />
            }
            return (
              <StatusBadge
                status="ongoing"
                label={`${from ? formatDate(from) : ''} – ${until ? formatDate(until) : ''}`}
              />
            )
          })()
        ) : null}
      </td>
      <td className="px-4 py-3">
        <ProductListActions
          productId={product.id}
          productName={product.name}
          isActive={product.is_active ?? false}
        />
      </td>
    </>
  )
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function SortableProductTable({ products }: SortableProductTableProps) {
  const activeProducts = products.filter((p) => p.is_active)
  const inactiveProducts = products.filter((p) => !p.is_active)

  const [optimisticActive, setOptimisticActive] = useOptimistic(activeProducts)
  const [, startTransition] = useTransition()
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = optimisticActive.findIndex((p) => p.id === active.id)
    const newIndex = optimisticActive.findIndex((p) => p.id === over.id)
    const reordered = arrayMove(optimisticActive, oldIndex, newIndex)

    startTransition(async () => {
      setOptimisticActive(reordered)
      await reorderProducts(reordered.map((p) => p.id))
    })
  }

  const draggedProduct = activeId
    ? optimisticActive.find((p) => p.id === activeId)
    : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={({ active }) => setActiveId(active.id as string)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-sandrift-100/40 text-left text-xs text-sandrift-400">
              <th className="w-10 px-2 py-3" />
              <th className="px-4 py-3">商品</th>
              <th className="px-4 py-3">網址代碼</th>
              <th className="px-4 py-3 text-right">售價</th>
              <th className="px-4 py-3">分類</th>
              <th className="px-4 py-3">標籤</th>
              <th className="px-4 py-3">狀態</th>
              <th className="px-4 py-3">檔期</th>
              <th className="px-4 py-3">操作</th>
            </tr>
          </thead>

          {/* 上架商品 — 可拖曳 */}
          <SortableContext
            items={optimisticActive.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <tbody className="divide-y divide-sandrift-100/30">
              {optimisticActive.map((product, i) => (
                <SortableRow key={product.id} product={product} index={i} />
              ))}
            </tbody>
          </SortableContext>

          {/* 分隔線 + 下架商品 */}
          {inactiveProducts.length > 0 && (
            <tbody className="divide-y divide-sandrift-100/30">
              <tr>
                <td colSpan={9} className="px-4 py-2">
                  <div className="flex items-center gap-3 text-xs text-sandrift-300">
                    <div className="h-px flex-1 bg-sandrift-100/60" />
                    已下架
                    <div className="h-px flex-1 bg-sandrift-100/60" />
                  </div>
                </td>
              </tr>
              {inactiveProducts.map((product, i) => (
                <StaticRow
                  key={product.id}
                  product={product}
                  index={activeProducts.length + i}
                />
              ))}
            </tbody>
          )}
        </table>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {draggedProduct ? (
          <table className="w-full text-left text-sm">
            <tbody>
              <tr className="rounded-xl bg-white/90 shadow-lg ring-1 ring-sandrift-200/50 backdrop-blur">
                <td className="w-10 px-2 py-3">
                  <div className="flex h-8 w-8 items-center justify-center text-sandrift-400">
                    <GripVertical className="h-4 w-4" />
                  </div>
                </td>
                <ProductCells product={draggedProduct} />
              </tr>
            </tbody>
          </table>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/(admin)/admin/products/sortable-product-table.tsx
git commit -m "feat(admin): sortable product table with drag-and-drop"
```

---

### Task 3: 改寫後台商品列表頁使用新表格元件

**Files:**
- Modify: `app/(admin)/admin/products/page.tsx`

- [ ] **Step 1: 改寫 page.tsx**

將表格 markup 替換為 `SortableProductTable` 元件：

```tsx
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAllProducts } from '@/lib/supabase/queries'
import SortableProductTable from './sortable-product-table'
import AdminPageHeader from '@/components/admin/admin-page-header'

export default async function AdminProductsPage() {
  const products = await getAllProducts()

  return (
    <div className="animate-page-enter">
      <AdminPageHeader
        title="商品管理"
        subtitle={`共 ${products.length} 項商品`}
        action={
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 rounded-xl bg-sandrift-500 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-sandrift-600"
          >
            <Plus className="h-4 w-4" />
            新增商品
          </Link>
        }
      />

      <div className="mt-6 rounded-2xl bg-white/60 ring-1 ring-sandrift-100/40 overflow-hidden">
        <SortableProductTable products={products} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 驗證 build**

```bash
pnpm build
```

Expected: 編譯成功，無 TypeScript 錯誤。

- [ ] **Step 3: Commit**

```bash
git add app/(admin)/admin/products/page.tsx
git commit -m "refactor(admin): use SortableProductTable in product list page"
```

---

### Task 4: 前台預設 Tab 改推薦 + 篩選邏輯修正

**Files:**
- Modify: `components/home-content.tsx`

- [ ] **Step 1: 改預設 tab**

在 `home-content.tsx` 第 26 行，將 fallback 從 `'all'` 改為 `'featured'`：

```ts
const categoryParam = searchParams.get('category') || 'featured'
```

- [ ] **Step 2: 修正推薦篩選邏輯**

將第 67-91 行的 `filteredProducts` useMemo 替換為：

```ts
const filteredProducts = useMemo(() => {
  let result: ProductInfo[]

  if (categoryParam === 'all') {
    result = products
  } else if (categoryParam === 'featured') {
    // 推薦 = 所有有 tag 的商品，按 tag 權重排序
    const tagWeight: Record<string, number> = {
      top_1: 1, top_2: 2, top_3: 3, hot: 4, new: 5, christmas: 6,
    }
    result = products
      .filter((p) => p.tag)
      .sort((a, b) => (tagWeight[a.tag] ?? 99) - (tagWeight[b.tag] ?? 99))
  } else {
    result = products.filter((p) =>
      p.categories.includes(categoryParam as Category)
    )
  }

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.alias.toLowerCase().includes(query)
    )
  }

  return result
}, [products, categoryParam, searchQuery])
```

- [ ] **Step 3: Commit**

```bash
git add components/home-content.tsx
git commit -m "feat: default to featured tab + fix recommendation filter logic"
```

---

### Task 5: Section 標題跟 Tab 連動

**Files:**
- Modify: `components/home-content.tsx`

- [ ] **Step 1: 動態標題**

將 `categoryTabs` 陣列加上標題對應，並在 section heading 動態切換：

```ts
const categoryTabs = [
  { value: 'all', label: '全部', heading: '所有商品' },
  { value: 'featured', label: '推薦', heading: '推薦商品' },
  { value: 'hot' as Category, label: '熱賣中', heading: '熱賣商品' },
  { value: 'cookie' as Category, label: '餅乾', heading: '餅乾' },
  { value: 'madeleine' as Category, label: '瑪德蓮', heading: '瑪德蓮' },
  { value: 'festival' as Category, label: '節慶禮盒', heading: '節慶禮盒' },
]
```

在 JSX 中，將固定標題替換為動態：

```tsx
<h2 className="text-xl md:text-2xl font-bold tracking-tight text-sandrift-950">
  {categoryTabs.find((t) => t.value === categoryParam)?.heading ?? '所有商品'}
</h2>
```

- [ ] **Step 2: Commit**

```bash
git add components/home-content.tsx
git commit -m "feat: dynamic section heading synced with active tab"
```

---

### Task 6: 產品卡片顯示單位

**Files:**
- Modify: `components/product-card.tsx`

- [ ] **Step 1: 價格旁加單位**

在 `product-card.tsx` 的價格顯示區（約第 80 行），將：

```tsx
<span className="text-[14px] font-bold text-sandrift-600">
  ${product.price}
</span>
```

改為：

```tsx
<span className="text-[14px] font-bold text-sandrift-600">
  ${product.price}
  <span className="text-[11px] font-normal text-sandrift-400">
    /{product.unit}
  </span>
</span>
```

- [ ] **Step 2: 驗證 build**

```bash
pnpm build
```

Expected: 編譯成功。

- [ ] **Step 3: Commit**

```bash
git add components/product-card.tsx
git commit -m "feat: show unit next to price on product card"
```

---

### Task 7: 最終驗證

- [ ] **Step 1: 完整 build + lint**

```bash
pnpm lint && pnpm build
```

Expected: 無錯誤，build 成功。

- [ ] **Step 2: 手動驗證清單**

開啟 dev server (`pnpm dev`)，逐項確認：

**後台 `/admin/products`：**
- 上架商品在上方，有拖曳 handle
- 已下架商品在底部灰顯，無拖曳 handle
- 拖曳後排序立即反映
- 重新整理頁面，排序持久化

**前台首頁 `/`：**
- 預設顯示「推薦」tab，標題為「推薦商品」
- 推薦包含所有有 tag 的商品（top_1、top_2、top_3、hot、new）
- 切換 tab，標題跟著變
- 產品卡片價格顯示單位（如 `$60/顆`）
- 點「全部」tab 仍可看到所有商品
