'use client'

import { useEffect, useRef } from 'react'
import { AlertTriangle, Info } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  loading?: boolean
  /** danger (紅色，預設) | warning (橙色) | primary (品牌色) */
  variant?: 'danger' | 'warning' | 'primary'
}

const variantStyles = {
  danger: {
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    btnBg: 'bg-red-500 hover:bg-red-600',
    Icon: AlertTriangle,
  },
  warning: {
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    btnBg: 'bg-amber-500 hover:bg-amber-600',
    Icon: AlertTriangle,
  },
  primary: {
    iconBg: 'bg-sandrift-50',
    iconColor: 'text-sandrift-500',
    btnBg: 'bg-sandrift-500 hover:bg-sandrift-600',
    Icon: Info,
  },
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = '確認',
  loading = false,
  variant = 'danger',
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const style = variantStyles[variant]
  const VIcon = style.Icon

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="rounded-2xl border-0 bg-white p-0 shadow-xl backdrop:bg-black/40 max-w-sm w-full animate-fade-in"
    >
      <div className="p-6">
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${style.iconBg}`}>
          <VIcon className={`h-6 w-6 ${style.iconColor}`} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">{description}</p>
      </div>
      <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="flex-1 cursor-pointer rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 disabled:opacity-50"
        >
          取消
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={`flex-1 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 disabled:opacity-50 ${style.btnBg}`}
        >
          {loading ? '處理中...' : confirmLabel}
        </button>
      </div>
    </dialog>
  )
}
