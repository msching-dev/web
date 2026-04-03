'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, ShoppingBag, User } from 'lucide-react'
import { menuItems } from '@/lib/menus'

interface HeaderProps {
  onMobileMenuToggle: () => void
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 border-b ${
        scrolled
          ? 'border-sandrift-200/20 bg-white/80 backdrop-blur-2xl backdrop-saturate-[1.4] shadow-[0_1px_12px_rgba(176,141,98,0.06)]'
          : 'border-sandrift-200/10 bg-white/60 backdrop-blur-xl'
      }`}
    >
      {/* Mobile */}
      <div className="flex h-14 items-center justify-between px-4 lg:hidden">
        <button
          type="button"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sandrift-600 transition-colors hover:text-sandrift-900"
          onClick={onMobileMenuToggle}
          aria-label="開啟選單"
        >
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </button>

        <Link href="/" className="absolute left-1/2 -translate-x-1/2 cursor-pointer">
          <Image src="/images/logo.svg" alt="MS. CHING" width={48} height={48} className="h-12 w-auto" priority />
        </Link>

        <div className="flex items-center">
          <Link href="/cart" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sandrift-500 transition-colors hover:text-sandrift-800" aria-label="購物車">
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </Link>
          <Link href="/account" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sandrift-500 transition-colors hover:text-sandrift-800" aria-label="帳號">
            <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      {/* Desktop */}
      <div className="mx-auto hidden h-14 max-w-7xl items-center justify-between px-6 lg:flex xl:px-8">
        <Link href="/" className="flex-shrink-0 cursor-pointer">
          <Image src="/images/logo.svg" alt="MS. CHING" width={40} height={40} className="h-10 w-auto" priority />
        </Link>

        <nav className="flex items-center gap-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path || '/'}
              className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-sandrift-700 transition-colors duration-200 hover:bg-sandrift-100/40 hover:text-sandrift-950"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link href="/cart" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sandrift-500 transition-colors hover:text-sandrift-800" aria-label="購物車">
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </Link>
          <Link href="/account" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sandrift-500 transition-colors hover:text-sandrift-800" aria-label="帳號">
            <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </header>
  )
}
