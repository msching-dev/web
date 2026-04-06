import type { Metadata } from 'next'
import AdminHeader from '@/components/admin/admin-header'
import AdminLayoutShell from '@/components/admin/admin-layout-shell'

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
      {/* Mobile header */}
      <AdminHeader />

      {/* Desktop sidebar + content */}
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </div>
  )
}
