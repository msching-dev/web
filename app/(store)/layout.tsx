import ClientLayout from '@/components/layout/client-layout'
import StoreCta from '@/components/store-cta'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ClientLayout>{children}</ClientLayout>
      <StoreCta />
    </>
  )
}
