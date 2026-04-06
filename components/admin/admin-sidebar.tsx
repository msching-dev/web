'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
  Truck,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: '總覽', icon: LayoutDashboard },
  { href: '/admin/products', label: '商品管理', icon: Package },
  { href: '/admin/orders', label: '訂單管理', icon: ClipboardList },
  { href: '/admin/customers', label: '會員管理', icon: Users },
  { href: '/admin/shipping', label: '運費設定', icon: Truck },
]

interface AdminSidebarProps {
  collapsed?: boolean
  onToggle?: () => void
  showToggle?: boolean
}

export default function AdminSidebar({ collapsed = false, onToggle, showToggle = true }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={`group/sidebar relative flex h-screen flex-col border-r border-gray-200 bg-white transition-[width] duration-300 ease-in-out ${
        collapsed ? 'w-17' : 'w-60'
      }`}
    >
      {/* Edge toggle — 浮在右邊緣的小圓按鈕，hover sidebar 才出現 */}
      {showToggle && onToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute -right-3 top-7 z-40 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm opacity-0 transition-all duration-200 hover:bg-gray-50 hover:text-gray-600 hover:scale-110 group-hover/sidebar:opacity-100"
          title={collapsed ? '展開側邊欄' : '收合側邊欄'}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>
      )}

      {/* Header — Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-4 overflow-hidden">
        {collapsed ? (
          <span className="mx-auto text-lg font-bold text-sandrift-700 animate-fade-in">MC</span>
        ) : (
          <span className="whitespace-nowrap text-lg font-bold tracking-wide text-sandrift-700 transition-opacity duration-300">
            MS. CHING 後台
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`group relative flex items-center rounded-lg transition-all duration-200 hover:translate-x-0.5 ${
                collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'
              } text-sm font-medium ${
                isActive
                  ? 'bg-sandrift-50 text-sandrift-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span
                className={`whitespace-nowrap transition-all duration-300 ${
                  collapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'
                }`}
              >
                {label}
              </span>

              {collapsed && (
                <span className="pointer-events-none absolute left-full ml-2 rounded-lg bg-white/90 backdrop-blur-sm px-2.5 py-1.5 text-xs font-medium text-sandrift-700 ring-1 ring-sandrift-100/50 opacity-0 shadow-sm transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1 z-50">
                  {label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 px-2 py-3">
        <Link
          href="/"
          title={collapsed ? '返回前台' : undefined}
          className={`group relative flex items-center rounded-lg text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 ${
            collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'
          }`}
        >
          <ArrowLeft className="h-5 w-5 shrink-0" />
          <span
            className={`whitespace-nowrap transition-all duration-300 ${
              collapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'
            }`}
          >
            返回前台
          </span>

          {collapsed && (
            <span className="pointer-events-none absolute left-full ml-2 rounded-lg bg-white/90 backdrop-blur-sm px-2.5 py-1.5 text-xs font-medium text-sandrift-700 ring-1 ring-sandrift-100/50 opacity-0 shadow-sm transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1 z-50">
              返回前台
            </span>
          )}
        </Link>
      </div>
    </aside>
  )
}
