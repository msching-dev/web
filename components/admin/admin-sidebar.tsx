'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  ArrowLeft,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: '總覽', icon: LayoutDashboard },
  { href: '/admin/products', label: '商品管理', icon: Package },
  { href: '/admin/orders', label: '訂單管理', icon: ClipboardList },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <span className="text-lg font-bold tracking-wide text-sandrift-700">
          MS. CHING 後台
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sandrift-50 text-sandrift-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 shrink-0" />
          返回前台
        </Link>
      </div>
    </aside>
  )
}
