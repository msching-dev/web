'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, ShoppingBag, User } from 'lucide-react'
import { menuItems } from '@/lib/menus'

interface HeaderProps {
  onMobileMenuToggle: () => void
}

function Logo({ className = '' }: { className?: string }) {
  return (
    <Image
      src="/images/logo.svg"
      alt="MS. CHING"
      width={48}
      height={48}
      className={className}
      priority
    />
  )
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
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
      {/* Mobile Header */}
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
          <Logo className="h-12 w-auto" />
        </Link>

        <div className="flex items-center">
          <Link
            href="/cart"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sandrift-500 transition-colors hover:text-sandrift-800"
            aria-label="購物車"
          >
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </Link>
          <Link
            href="/account"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sandrift-500 transition-colors hover:text-sandrift-800"
            aria-label="帳號"
          >
            <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="mx-auto hidden h-14 max-w-7xl items-center justify-between px-6 lg:flex xl:px-8">
        <Link href="/" className="flex-shrink-0 cursor-pointer">
          <Logo className="h-10 w-auto" />
        </Link>

        <nav className="flex items-center gap-0.5">
          {menuItems
            .filter((item) => !item.hidden)
            .map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() =>
                  item.children ? setOpenDropdown(item.name) : undefined
                }
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.path ? (
                  <Link
                    href={item.path}
                    className="cursor-pointer rounded-lg px-3.5 py-2 text-[14px] font-medium text-sandrift-700 transition-colors duration-200 hover:bg-sandrift-100/40 hover:text-sandrift-950"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="cursor-pointer rounded-lg px-3.5 py-2 text-[14px] font-medium text-sandrift-700 transition-colors duration-200 hover:bg-sandrift-100/40 hover:text-sandrift-950"
                    onClick={() =>
                      setOpenDropdown(openDropdown === item.name ? null : item.name)
                    }
                  >
                    {item.name}
                  </button>
                )}

                {item.children && openDropdown === item.name && (
                  <div className="absolute left-1/2 top-full z-50 min-w-[150px] -translate-x-1/2 pt-1.5">
                    <div className="glass animate-pop rounded-2xl p-1 ring-1 ring-white/20">
                      {item.children
                        .filter((child) => !child.hidden)
                        .map((child) => (
                          <Link
                            key={child.name}
                            href={child.path || '#'}
                            className="block cursor-pointer rounded-xl px-3.5 py-2.5 text-[13px] text-sandrift-700 transition-colors duration-150 hover:bg-sandrift-100/50 hover:text-sandrift-950"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {child.name}
                          </Link>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </nav>

        <div className="flex items-center gap-0.5">
          <Link
            href="/cart"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sandrift-500 transition-colors hover:text-sandrift-800"
            aria-label="購物車"
          >
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </Link>
          <Link
            href="/account"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sandrift-500 transition-colors hover:text-sandrift-800"
            aria-label="帳號"
          >
            <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </header>
  )
}
