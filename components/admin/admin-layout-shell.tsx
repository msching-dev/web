'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import AdminSidebar from './admin-sidebar'

const STORAGE_KEY = 'admin-sidebar-collapsed'
const XL_BREAKPOINT = 1280

export default function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  // 使用者是否手動切過（本次 session 內）
  const userOverride = useRef(false)

  // RWD 自動適配：lg~xl 自動收合，xl+ 自動展開
  // 若使用者手動切過，則不再自動切換
  const syncWithBreakpoint = useCallback(() => {
    if (userOverride.current) return
    setCollapsed(window.innerWidth < XL_BREAKPOINT)
  }, [])

  useEffect(() => {
    // 優先讀 localStorage（上次手動設定的偏好）
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved !== null) {
      setCollapsed(saved === 'true')
      userOverride.current = true
    } else {
      syncWithBreakpoint()
    }

    const onResize = () => {
      if (!userOverride.current) {
        syncWithBreakpoint()
      }
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [syncWithBreakpoint])

  const handleToggle = () => {
    userOverride.current = true
    setCollapsed(prev => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }

  return (
    <>
      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:flex">
        <AdminSidebar collapsed={collapsed} onToggle={handleToggle} />
      </div>

      {/* Main content */}
      <main className={`transition-[padding-left] duration-300 ease-in-out ${
        collapsed ? 'lg:pl-17' : 'lg:pl-60'
      }`}>
        <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
      </main>
    </>
  )
}
