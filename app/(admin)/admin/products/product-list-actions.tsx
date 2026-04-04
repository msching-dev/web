'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Pencil, Power, Trash2 } from 'lucide-react'
import ConfirmDialog from '@/components/admin/confirm-dialog'
import { toggleProductActive, deleteProduct } from './actions'

interface ProductListActionsProps {
  productId: string
  productName: string
  isActive: boolean
}

export default function ProductListActions({
  productId,
  productName,
  isActive,
}: ProductListActionsProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [loadingToggle, setLoadingToggle] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)

  async function handleToggle() {
    setLoadingToggle(true)
    try {
      await toggleProductActive(productId)
    } finally {
      setLoadingToggle(false)
    }
  }

  async function handleDelete() {
    setLoadingDelete(true)
    try {
      await deleteProduct(productId)
      setDeleteOpen(false)
    } finally {
      setLoadingDelete(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-1">
        <Link
          href={`/admin/products/${productId}/edit`}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          title="編輯"
        >
          <Pencil className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={handleToggle}
          disabled={loadingToggle}
          className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors disabled:opacity-50 ${
            isActive
              ? 'text-green-500 hover:bg-green-50 hover:text-green-700'
              : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
          }`}
          title={isActive ? '下架' : '上架'}
        >
          <Power className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          title="刪除"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="刪除商品"
        description={`確定要刪除「${productName}」嗎？此操作無法復原，商品圖片也將一併刪除。`}
        confirmLabel="確認刪除"
        loading={loadingDelete}
      />
    </>
  )
}
