'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, User, LogOut, Settings, ChevronRight } from 'lucide-react'
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

/** 取得使用者偏好的 avatar（優先用 preferred_avatar） */
function getUserAvatar(user: { email?: string | null; user_metadata?: Record<string, string> }) {
  const preferred = user.user_metadata?.preferred_avatar
  if (preferred && preferred !== 'letter') return preferred
  return getAvatarForUser(user.email || '')
}

/** 是否使用字母樣式 avatar */
function isLetterAvatar(user: { user_metadata?: Record<string, string> }) {
  return user.user_metadata?.preferred_avatar === 'letter'
}

/** 取得顯示名稱（優先 user_metadata，fallback email 前綴） */
function getDisplayName(user: { email?: string | null; user_metadata?: Record<string, string> }) {
  return user.user_metadata?.full_name
    || user.user_metadata?.name
    || user.user_metadata?.line_display_name
    || null
}
import CartBadge from '@/components/cart/cart-badge'
import { useAuth } from '@/hooks/use-auth'
import { createClient } from '@/lib/supabase/client'

/**
 * 建立專屬 portal container（避開 Next.js dev overlay 和 sticky header 的 hit-testing 限制）。
 * 用 id 確保只建一次，z-index 用 inline style 確保生效。
 */
function getPortalContainer() {
  const id = '__user-menu-portal'
  let el = document.getElementById(id)
  if (!el) {
    el = document.createElement('div')
    el.id = id
    el.style.position = 'fixed'
    el.style.top = '0'
    el.style.left = '0'
    el.style.width = '0'
    el.style.height = '0'
    el.style.zIndex = '99999'
    el.style.pointerEvents = 'none'
    document.body.appendChild(el)
  }
  return el
}

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
  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 })
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)

  // Client-side only: 取得 portal container
  useEffect(() => {
    setPortalTarget(getPortalContainer())
  }, [])

  const updatePos = useCallback(() => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    setMenuPos({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    })
  }, [])

  useEffect(() => {
    if (!showUserMenu) return
    updatePos()
    window.addEventListener('scroll', updatePos, { passive: true })
    window.addEventListener('resize', updatePos, { passive: true })
    return () => {
      window.removeEventListener('scroll', updatePos)
      window.removeEventListener('resize', updatePos)
    }
  }, [showUserMenu, updatePos])

  // Escape 關閉
  useEffect(() => {
    if (!showUserMenu) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowUserMenu(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showUserMenu, setShowUserMenu])

  if (loading) {
    return (
      <div className="flex h-9 w-9 items-center justify-center">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-sandrift-200 border-t-sandrift-500" />
      </div>
    )
  }

  if (!user) {
    return (
      <Link href="/account" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sandrift-500 transition-all duration-200 hover:bg-sandrift-100/50 hover:text-sandrift-800" aria-label="帳號">
        <User className="h-4.5 w-4.5" strokeWidth={1.5} />
      </Link>
    )
  }

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={(e) => { e.stopPropagation(); setShowUserMenu(!showUserMenu) }}
        className="group/avatar relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-linear-to-br from-sandrift-200/40 via-sandrift-100/25 to-sandrift-200/35 p-0.5 transition-all duration-200 hover:from-sandrift-200/60 hover:via-sandrift-100/40 hover:to-sandrift-200/50"
        aria-label="使用者選單"
      >
        <span className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
          {isLetterAvatar(user) ? (
            <span className="flex h-full w-full items-center justify-center bg-sandrift-50 text-sm font-semibold text-sandrift-500 transition-all duration-300">
              {(user.email || '?')[0].toUpperCase()}
            </span>
          ) : (
            <Image
              key={getUserAvatar(user)}
              src={getUserAvatar(user)}
              alt="Avatar"
              width={34}
              height={34}
              className="h-full w-full object-cover animate-fade-in"
            />
          )}
          {/* Apple-style gloss */}
          <span className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-b from-white/25 via-transparent to-black/6" />
        </span>
      </button>

      {showUserMenu && portalTarget && createPortal(
        <>
          {/* 透明 backdrop — 點擊關閉選單 */}
          <div
            className="fixed inset-0"
            style={{ zIndex: 99998, pointerEvents: 'auto' }}
            onClick={() => setShowUserMenu(false)}
          />
          {/* 選單 */}
          <div
            ref={menuRef}
            role="menu"
            className="fixed w-56 origin-top-right animate-pop rounded-2xl bg-white/45 backdrop-blur-3xl backdrop-saturate-150 border border-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-1px_0_rgba(176,141,98,0.1),0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)]"
            style={{ top: menuPos.top, right: menuPos.right, zIndex: 99999, pointerEvents: 'auto' }}
          >
          {/* User card */}
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="relative h-10 w-10 shrink-0 rounded-full bg-linear-to-br from-sandrift-200/40 via-sandrift-100/25 to-sandrift-200/35 p-[1.5px]">
              <span className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
                {isLetterAvatar(user) ? (
                  <span className="flex h-full w-full items-center justify-center bg-sandrift-50 text-sm font-bold text-sandrift-500">
                    {(user.email || '?')[0].toUpperCase()}
                  </span>
                ) : (
                  <Image
                    key={getUserAvatar(user)}
                    src={getUserAvatar(user)}
                    alt="Avatar"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                )}
                <span className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-b from-white/20 via-transparent to-black/5" />
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-sandrift-900">
                {getDisplayName(user) || '尚未設定姓名'}
              </p>
              <p className="truncate text-[11px] text-sandrift-400">{user.email}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-3 border-t border-sandrift-100/50" />

          {/* Menu items */}
          <div className="py-1.5">
            <Link
              role="menuitem"
              href="/account/profile"
              className="group/item flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-sandrift-700 transition-colors hover:bg-sandrift-50/70"
              onClick={() => setShowUserMenu(false)}
            >
              <User className="h-4 w-4 text-sandrift-400 transition-colors group-hover/item:text-sandrift-600" strokeWidth={1.5} />
              <span className="flex-1">個人資訊</span>
              <ChevronRight className="h-3.5 w-3.5 text-sandrift-200 transition-all group-hover/item:text-sandrift-400 group-hover/item:translate-x-0.5" strokeWidth={1.5} />
            </Link>
            {isAdmin && (
              <Link
                role="menuitem"
                href="/admin"
                className="group/item flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-sandrift-700 transition-colors hover:bg-sandrift-50/70"
                onClick={() => setShowUserMenu(false)}
              >
                <Settings className="h-4 w-4 text-sandrift-400 transition-colors group-hover/item:text-sandrift-600" strokeWidth={1.5} />
                <span className="flex-1">後台管理</span>
                <ChevronRight className="h-3.5 w-3.5 text-sandrift-200 transition-all group-hover/item:text-sandrift-400 group-hover/item:translate-x-0.5" strokeWidth={1.5} />
              </Link>
            )}
          </div>

          {/* Divider */}
          <div className="mx-3 border-t border-sandrift-100/50" />

          {/* Logout */}
          <div className="py-1.5">
            <button
              role="menuitem"
              type="button"
              onClick={onLogout}
              className="group/item flex w-full items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-500/80 transition-colors hover:bg-red-50/50 hover:text-red-600 cursor-pointer"
            >
              <LogOut className="h-4 w-4 transition-colors group-hover/item:text-red-500" strokeWidth={1.5} />
              登出
            </button>
          </div>
        </div>
        </>,
        portalTarget
      )}
    </>
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

  const handleLogout = async () => {
    setShowUserMenu(false)
    await supabase.auth.signOut()
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
          ? 'border-sandrift-200/15 bg-white/40 backdrop-blur-[40px] backdrop-saturate-[1.8] shadow-[inset_0_-1px_0_rgba(176,141,98,0.08),0_4px_16px_rgba(176,141,98,0.06)]'
          : 'border-sandrift-100/20 bg-white/30 backdrop-blur-[28px] backdrop-saturate-150 shadow-[inset_0_-0.5px_0_rgba(176,141,98,0.06)]'
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
          <Image src="/images/logo.svg" alt="MS. CHING" width={52} height={52} className="h-13" style={{ width: 'auto' }} priority />
        </Link>

        <div className="flex items-center gap-1">
          <CartBadge />
          <UserButton {...userButtonProps} />
        </div>
      </div>

      {/* Desktop */}
      <div className="mx-auto hidden h-18 max-w-7xl items-center justify-between px-6 lg:flex xl:h-20 xl:px-8">
        <Link href="/" className="shrink-0 cursor-pointer">
          <Image src="/images/logo.svg" alt="MS. CHING" width={48} height={48} className="w-11 xl:w-12" style={{ height: 'auto' }} priority />
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
