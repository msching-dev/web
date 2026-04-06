'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import AdminSidebar from '@/components/admin/admin-sidebar'

export default function AdminHeader() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center border-b border-gray-200 bg-white px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          aria-label="開啟選單"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="ml-3 text-sm font-bold tracking-wide text-sandrift-700">
          MS. CHING 後台
        </span>
      </header>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Sidebar panel */}
          <div className="fixed inset-y-0 left-0 z-50 w-60 animate-in slide-in-from-left duration-200">
            <AdminSidebar showToggle={false} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-2 top-4 rounded-md p-1.5 text-gray-400 hover:text-gray-600"
              aria-label="關閉選單"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
