import type { Metadata } from 'next'
import AdminSidebar from '@/components/admin/admin-sidebar'
import AdminHeader from '@/components/admin/admin-header'

export const metadata: Metadata = {
  title: '後台管理',
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:flex">
        <AdminSidebar />
      </div>

      {/* Mobile header */}
      <AdminHeader />

      {/* Main content */}
      <main className="lg:pl-60">
        <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
      </main>
    </div>
  )
}
