'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X, ImagePlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type ImageItem = {
  url: string
  alt: string
  sort_order: number
}

interface ImageUploaderProps {
  slug: string
  images: ImageItem[]
  onChange: (images: ImageItem[]) => void
}

const BUCKET = 'product-images'
const MAX_IMAGES = 8
const MAX_SIZE_BYTES = 2 * 1024 * 1024 // 2 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// ── Sortable thumbnail ──────────────────────────────────────────────────────

interface SortableImageProps {
  item: ImageItem
  index: number
  onDelete: (url: string) => void
}

function SortableImage({ item, index, onDelete }: SortableImageProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.url,
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative aspect-square overflow-hidden rounded-xl bg-white/60 ring-1 ring-sandrift-100/40"
    >
      <Image
        src={item.url}
        alt={item.alt || `商品圖片 ${index + 1}`}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 50vw, 25vw"
      />

      {/* Main image badge */}
      {index === 0 && (
        <span className="absolute left-1.5 top-1.5 rounded bg-sandrift-500 px-1.5 py-0.5 text-[10px] font-semibold text-white leading-none">
          主圖
        </span>
      )}

      {/* Grip handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute bottom-1.5 left-1.5 cursor-grab rounded bg-black/40 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
        aria-label="拖曳排序"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>

      {/* Delete button */}
      <button
        type="button"
        onClick={() => onDelete(item.url)}
        className="absolute right-1.5 top-1.5 rounded bg-black/40 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500/80"
        aria-label="刪除圖片"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export default function ImageUploader({ slug, images, onChange }: ImageUploaderProps) {
  const supabase = createClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  // ── Drag end ──────────────────────────────────────────────────────────────

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = images.findIndex((img) => img.url === active.id)
    const newIndex = images.findIndex((img) => img.url === over.id)
    const reordered = arrayMove(images, oldIndex, newIndex).map((img, i) => ({
      ...img,
      sort_order: i,
    }))
    onChange(reordered)
  }

  // ── Upload ────────────────────────────────────────────────────────────────

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return
      setError(null)

      if (!slug.trim()) {
        setError('請先填入 Slug 再上傳圖片')
        return
      }

      const remaining = MAX_IMAGES - images.length
      if (remaining <= 0) {
        setError(`最多上傳 ${MAX_IMAGES} 張圖片`)
        return
      }

      const selected = Array.from(files).slice(0, remaining)

      // Validate
      for (const file of selected) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          setError('僅支援 JPG、PNG、WebP 格式')
          return
        }
        if (file.size > MAX_SIZE_BYTES) {
          setError(`每張圖片不得超過 2MB（${file.name}）`)
          return
        }
      }

      setUploading(true)

      try {
        const uploaded: ImageItem[] = []

        for (const file of selected) {
          const ext = file.name.split('.').pop() ?? 'jpg'
          const rand = Math.random().toString(36).slice(2, 7)
          const filename = `${Date.now()}-${rand}.${ext}`
          const storagePath = `${slug}/${filename}`

          const { error: uploadError } = await supabase.storage
            .from(BUCKET)
            .upload(storagePath, file, { upsert: false })

          if (uploadError) {
            setError(`上傳失敗：${uploadError.message}`)
            setUploading(false)
            return
          }

          const {
            data: { publicUrl },
          } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)

          uploaded.push({
            url: publicUrl,
            alt: '',
            sort_order: images.length + uploaded.length,
          })
        }

        onChange([...images, ...uploaded])
      } finally {
        setUploading(false)
        if (inputRef.current) inputRef.current.value = ''
      }
    },
    [slug, images, onChange, supabase],
  )

  // ── Delete ────────────────────────────────────────────────────────────────

  const handleDelete = useCallback(
    async (url: string) => {
      // Extract storage path from public URL
      // URL form: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
      const marker = `/storage/v1/object/public/${BUCKET}/`
      const idx = url.indexOf(marker)
      if (idx !== -1) {
        const storagePath = url.slice(idx + marker.length)
        const { error } = await supabase.storage.from(BUCKET).remove([storagePath])
        if (error) {
          console.error('Failed to delete image from storage:', error.message)
          // 仍繼續移除表單中的圖片，避免 UI 卡住
        }
      }

      const updated = images
        .filter((img) => img.url !== url)
        .map((img, i) => ({ ...img, sort_order: i }))
      onChange(updated)
    },
    [images, onChange, supabase],
  )

  // ── Drop zone handlers ────────────────────────────────────────────────────

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const canUploadMore = images.length < MAX_IMAGES

  return (
    <div className="space-y-3">
      {/* Error message */}
      {error && (
        <div className="rounded-xl ring-1 ring-red-100/50 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Grid */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images.map((img) => img.url)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {images.map((img, i) => (
              <SortableImage key={img.url} item={img} index={i} onDelete={handleDelete} />
            ))}

            {/* Upload zone */}
            {canUploadMore && (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => !uploading && inputRef.current?.click()}
                className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-sandrift-200/50 bg-white/40 text-sandrift-400 transition-all duration-200 hover:border-sandrift-300/50 hover:bg-sandrift-50 hover:text-sandrift-500"
              >
                {uploading ? (
                  <span className="text-xs">上傳中…</span>
                ) : (
                  <>
                    <ImagePlus className="h-6 w-6" />
                    <span className="text-xs font-medium">新增圖片</span>
                    <span className="text-[10px] text-sandrift-300">
                      {images.length}/{MAX_IMAGES}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <p className="text-xs text-sandrift-400">
        支援 JPG / PNG / WebP，單檔最大 2MB，最多 {MAX_IMAGES} 張。拖曳縮圖可重新排序。
      </p>
    </div>
  )
}
