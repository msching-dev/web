'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, User, LogOut, Settings } from 'lucide-react'
import { menuItems } from '@/lib/menus'

const avatarImages = [
  '/images/avatar/cake.png',
  '/images/avatar/cupcake.png',
  '/images/avatar/donut.png',
  '/images/avatar/toast.png',
]

/** 根據 email 穩定選一個甜點 avatar */
function getAvatarForUser(email: string) {
  let hash = 0
  for (let i = 0; i < email.length; i++) {
    hash = ((hash << 5) - hash + email.charCodeAt(i)) | 0
  }
  return avatarImages[Math.abs(hash) % avatarImages.length]
}
import CartBadge from '@/components/cart/cart-badge'
import { useAuth } from '@/hooks/use-auth'
import { createClient } from '@/lib/supabase/client'

function UserButton({
  user,
  loading,
  isAdmin,
  showUserMenu,
  setShowUserMenu,
  onLogout,
}: {
  user: ReturnType<typeof useAuth>['user']
  loading: boolean
  isAdmin: boolean
  showUserMenu: boolean
  setShowUserMenu: (show: boolean) => void
  onLogout: () => void
}) {
  if (loading) {
    return (
      <div className="flex h-9 w-9 items-center justify-center">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-sandrift-200 border-t-sandrift-500" />
      </div>
    )
  }

  if (!user) {
    return (
      <Link href="/account" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sandrift-500 transition-colors hover:text-sandrift-800" aria-label="帳號">
        <User className="h-4.5 w-4.5" strokeWidth={1.5} />
      </Link>
    )
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setShowUserMenu(!showUserMenu) }}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full overflow-hidden ring-1 ring-sandrift-200/60 transition-all hover:ring-2 hover:ring-sandrift-300/50"
        aria-label="使用者選單"
      >
        <Image
          src={getAvatarForUser(user.email || '')}
          alt="Avatar"
          width={32}
          height={32}
          className="h-8 w-8 object-cover"
        />
      </button>

      {showUserMenu && (
        <div role="menu" className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-sandrift-100 bg-white py-1.5 shadow-lg z-50">
          <div className="border-b border-sandrift-50 px-3 py-2">
            <p className="truncate text-xs text-sandrift-500">{user.email}</p>
          </div>
          <Link
            role="menuitem"
            href="/account/profile"
            className="flex items-center gap-2 px-3 py-2 text-[13px] text-sandrift-700 hover:bg-sandrift-50 transition-colors"
            onClick={() => setShowUserMenu(false)}
          >
            <User className="h-3.5 w-3.5" strokeWidth={1.5} />
            個人資訊
          </Link>
          {isAdmin && (
            <Link
              role="menuitem"
              href="/admin"
              className="flex items-center gap-2 px-3 py-2 text-[13px] text-sandrift-700 hover:bg-sandrift-50 transition-colors"
              onClick={() => setShowUserMenu(false)}
            >
              <Settings className="h-3.5 w-3.5" strokeWidth={1.5} />
              後台管理
            </Link>
          )}
          <button
            role="menuitem"
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-2 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
            登出
          </button>
        </div>
      )}
    </div>
  )
}

interface HeaderProps {
  onMobileMenuToggle: () => void
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!showUserMenu) return
    const handleClick = () => setShowUserMenu(false)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowUserMenu(false)
    }
    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showUserMenu])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setShowUserMenu(false)
    router.push('/')
    router.refresh()
  }

  const userButtonProps = {
    user,
    loading,
    isAdmin,
    showUserMenu,
    setShowUserMenu,
    onLogout: handleLogout,
  }

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
          <CartBadge />
          <UserButton {...userButtonProps} />
        </div>
      </div>

      {/* Desktop */}
      <div className="mx-auto hidden h-14 max-w-7xl items-center justify-between px-6 lg:flex xl:px-8">
        <Link href="/" className="shrink-0 cursor-pointer">
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
          <CartBadge />
          <UserButton {...userButtonProps} />
        </div>
      </div>
    </header>
  )
}
