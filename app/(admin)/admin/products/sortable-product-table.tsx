'use client'

import { useOptimistic, useTransition, useState } from 'react'
import Image from 'next/image'
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  MeasuringStrategy,
  type DropAnimation,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  arrayMove,
  defaultAnimateLayoutChanges,
  type AnimateLayoutChanges,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import StatusBadge from '@/components/admin/status-badge'
import ProductListActions from './product-list-actions'
import { reorderProducts } from './actions'

// ── Types ───────────────────────────────────────────────────────────────────

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

// ── Shared Row Cells ────────────────────────────────────────────────────────

function RowCells({ product }: { product: ProductRow }) {
  const images = (product.images as Array<{ url: string; alt: string }>) || []
  const firstImage = images[0]?.url
  const category = product.categories as { name: string; slug: string } | null
  const tags = (product.tags as string[]) || []

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
        <DateRangeCell product={product} />
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

function DateRangeCell({ product }: { product: ProductRow }) {
  if (!product.available_from && !product.available_until) return null

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
}

// ── Sortable Row ────────────────────────────────────────────────────────────

// 只在非拖曳的排序動畫中做 layout 動畫，拖曳中的原位行不動畫
const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true })

type DropPosition = 'before' | 'after' | null

function SortableRow({
  product,
  index,
  dropPosition,
}: {
  product: ProductRow
  index: number
  dropPosition: DropPosition
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: product.id,
    animateLayoutChanges,
  })

  const style = {
    // Translate only — 不帶 scale，避免 table row 變形
    transform: CSS.Translate.toString(transform),
    transition,
    '--stagger-index': index,
  } as React.CSSProperties

  // 目標插入指示線的樣式
  const indicatorClass = dropPosition === 'before'
    ? 'after:absolute after:inset-x-3 after:top-0 after:h-0.5 after:rounded-full after:bg-sandrift-400 after:shadow-[0_0_6px_rgba(176,141,98,0.4)]'
    : dropPosition === 'after'
      ? 'after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-sandrift-400 after:shadow-[0_0_6px_rgba(176,141,98,0.4)]'
      : ''

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`animate-stagger-in transition-colors relative ${
        isDragging
          ? 'z-0 bg-sandrift-50/40 [&>td]:invisible'
          : 'hover:bg-sandrift-50/30'
      } ${indicatorClass}`}
      {...attributes}
    >
      {/* 原位 placeholder — 拖曳時顯示虛線框 */}
      {isDragging && (
        <td colSpan={9} className="visible p-0!">
          <div className="mx-2 h-10 rounded-lg border-2 border-dashed border-sandrift-200/60 bg-sandrift-50/20" />
        </td>
      )}

      {/* 正常內容 — 拖曳時被 invisible 隱藏 */}
      {!isDragging && (
        <>
          <td className="w-10 px-2 py-3">
            <button
              type="button"
              className="flex h-8 w-8 cursor-grab items-center justify-center rounded-lg text-sandrift-300 transition-colors hover:bg-sandrift-50 hover:text-sandrift-500 active:cursor-grabbing"
              {...listeners}
            >
              <GripVertical className="h-4 w-4" />
            </button>
          </td>
          <RowCells product={product} />
        </>
      )}
    </tr>
  )
}

// ── DragOverlay config ──────────────────────────────────────────────────────

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: { opacity: '0.4' },
    },
  }),
  // 絲滑回彈 — 用 spring-like easing
  duration: 280,
  easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
}

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
}

// ── Main Component ──────────────────────────────────────────────────────────

interface SortableProductTableProps {
  products: ProductRow[]
}

export default function SortableProductTable({ products }: SortableProductTableProps) {
  const activeProducts = products.filter((p) => p.is_active)
  const inactiveProducts = products.filter((p) => !p.is_active)

  const [optimisticActive, setOptimisticActive] = useOptimistic(
    activeProducts,
    (_current: ProductRow[], newOrder: ProductRow[]) => newOrder
  )
  const [, startTransition] = useTransition()
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const draggedProduct = draggingId
    ? optimisticActive.find((p) => p.id === draggingId) ?? null
    : null

  // 計算每一行的 drop position（插入指示線在上方還是下方）
  function getDropPosition(productId: string): DropPosition {
    if (!draggingId || !overId || overId === draggingId) return null
    if (productId !== overId) return null

    const dragIndex = optimisticActive.findIndex((p) => p.id === draggingId)
    const overIndex = optimisticActive.findIndex((p) => p.id === overId)
    if (dragIndex === -1 || overIndex === -1) return null

    // 往下拖 → 線在目標下方，往上拖 → 線在目標上方
    return dragIndex < overIndex ? 'after' : 'before'
  }

  function handleDragOver(event: DragOverEvent) {
    setOverId((event.over?.id as string) ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    setDraggingId(null)
    setOverId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = optimisticActive.findIndex((p) => p.id === active.id)
    const newIndex = optimisticActive.findIndex((p) => p.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(optimisticActive, oldIndex, newIndex)

    startTransition(async () => {
      setOptimisticActive(reordered)
      await reorderProducts(reordered.map((p) => p.id))
    })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={measuring}
      onDragStart={(event) => setDraggingId(event.active.id as string)}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => { setDraggingId(null); setOverId(null) }}
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
                <SortableRow
                  key={product.id}
                  product={product}
                  index={i}
                  dropPosition={getDropPosition(product.id)}
                />
              ))}
            </tbody>
          </SortableContext>

          {/* 分隔線 + 下架商品 */}
          {inactiveProducts.length > 0 && (
            <tbody className="divide-y divide-sandrift-100/30">
              <tr>
                <td colSpan={9} className="px-4 py-3">
                  <div className="flex items-center gap-3 text-xs text-sandrift-300">
                    <div className="flex-1 border-t border-sandrift-200/50" />
                    <span>已下架</span>
                    <div className="flex-1 border-t border-sandrift-200/50" />
                  </div>
                </td>
              </tr>
              {inactiveProducts.map((product, i) => (
                <tr
                  key={product.id}
                  className="animate-stagger-in opacity-50 hover:bg-sandrift-50/30 transition-colors"
                  style={{ '--stagger-index': activeProducts.length + i + 1 } as React.CSSProperties}
                >
                  <td className="w-10 px-2 py-3" />
                  <RowCells product={product} />
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {/* Drag overlay — 跟隨游標的浮動行 */}
      <DragOverlay dropAnimation={dropAnimation}>
        {draggedProduct && (
          <table className="w-full text-left text-sm pointer-events-none">
            <tbody>
              <tr className="bg-white/95 shadow-xl shadow-sandrift-200/30 ring-1 ring-sandrift-200/60 backdrop-blur-sm">
                <td className="w-10 px-2 py-3">
                  <span className="flex items-center justify-center text-sandrift-500">
                    <GripVertical className="h-4 w-4" />
                  </span>
                </td>
                <RowCells product={draggedProduct} />
              </tr>
            </tbody>
          </table>
        )}
      </DragOverlay>
    </DndContext>
  )
}
