'use client'

import { useState } from 'react'
import { useCartSync } from '@/hooks/use-cart-sync'
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
