'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useCartSync } from '@/hooks/use-cart-sync'
import { useAuthSync } from '@/hooks/use-auth'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import BackToTopButton from '@/components/layout/back-to-top-button'
import MobileMenu from '@/components/layout/mobile-menu'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useCartSync()
  useAuthSync()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // 切頁時自動滾動到頂部
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <>
      <Header onMobileMenuToggle={toggleMobileMenu} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      <main className="min-h-[calc(100dvh-4rem)]">{children}</main>
      <Footer />
      <BackToTopButton />
    </>
  )
}
