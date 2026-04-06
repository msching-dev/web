'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Pencil, Power, Trash2, Check } from 'lucide-react'
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
  const [toggleOpen, setToggleOpen] = useState(false)
  const [loadingToggle, setLoadingToggle] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function showSuccess(msg: string) {
    setSuccess(msg)
    setTimeout(() => setSuccess(null), 2000)
  }

  async function handleToggle() {
    setError(null)
    setLoadingToggle(true)
    try {
      const result = await toggleProductActive(productId)
      if (result?.error) {
        setError(result.error)
      } else {
        setToggleOpen(false)
        showSuccess(isActive ? '已下架' : '已上架')
      }
    } catch {
      setError('操作失敗，請稍後再試')
    } finally {
      setLoadingToggle(false)
    }
  }

  async function handleDelete() {
    setError(null)
    setLoadingDelete(true)
    try {
      const result = await deleteProduct(productId)
      if (result?.error) {
        setError(result.error)
      } else {
        setDeleteOpen(false)
      }
    } catch {
      setError('刪除失敗，請稍後再試')
    } finally {
      setLoadingDelete(false)
    }
  }

  return (
    <div className="relative">
      {/* 成功提示 */}
      {success && (
        <div className="absolute right-0 top-full mt-1 z-10 flex items-center gap-1 rounded-lg bg-green-50 px-2.5 py-1.5 text-[11px] font-medium text-green-600 shadow-sm whitespace-nowrap animate-fade-in">
          <Check className="h-3 w-3" />
          {success}
        </div>
      )}

      {/* 錯誤提示 */}
      {error && (
        <div className="absolute right-0 top-full mt-1 z-10 rounded-lg bg-red-50 px-3 py-1.5 text-[11px] text-red-600 shadow-sm whitespace-nowrap animate-fade-in">
          {error}
        </div>
      )}

      <div className="flex items-center gap-0.5">
        {/* 編輯 */}
        <Link
          href={`/admin/products/${productId}/edit`}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-sandrift-50 hover:text-sandrift-600"
          title="編輯"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Link>

        {/* 上下架 — 需確認 */}
        <button
          type="button"
          onClick={() => setToggleOpen(true)}
          disabled={loadingToggle}
          className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-50 ${
            isActive
              ? 'text-green-500 hover:bg-green-50 hover:text-green-700'
              : 'text-gray-400 hover:bg-amber-50 hover:text-amber-600'
          }`}
          title={isActive ? '下架商品' : '上架商品'}
        >
          <Power className="h-3.5 w-3.5" />
        </button>

        {/* 刪除 — 需確認 */}
        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500"
          title="刪除商品"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 上下架確認 */}
      <ConfirmDialog
        open={toggleOpen}
        onClose={() => setToggleOpen(false)}
        onConfirm={handleToggle}
        title={isActive ? '下架商品' : '上架商品'}
        description={
          isActive
            ? `確定要下架「${productName}」嗎？下架後前台將不再顯示此商品。`
            : `確定要上架「${productName}」嗎？上架後前台將顯示此商品。`
        }
        confirmLabel={isActive ? '確認下架' : '確認上架'}
        variant={isActive ? 'warning' : 'primary'}
        loading={loadingToggle}
      />

      {/* 刪除確認 */}
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="刪除商品"
        description={`確定要刪除「${productName}」嗎？此操作無法復原，商品圖片也將一併刪除。`}
        confirmLabel="確認刪除"
        loading={loadingDelete}
      />
    </div>
  )
}
