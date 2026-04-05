'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X } from 'lucide-react'
import { menuItems } from '@/lib/menus'
import { socialMediaLinks } from '@/lib/constants'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  // Escape 鍵關閉 + 開啟時 focus 到關閉按鈕
  useEffect(() => {
    if (!isOpen) return
    closeRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-sandrift-950/15 backdrop-blur-[3px] transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        role="dialog"
        aria-modal={isOpen}
        aria-label="導覽選單"
        className={`fixed left-0 top-0 z-60 flex h-full w-70 flex-col bg-white/95 backdrop-blur-2xl backdrop-saturate-150 shadow-[4px_0_24px_rgba(0,0,0,0.06)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" onClick={onClose} className="cursor-pointer">
            <Image src="/images/logo.svg" alt="MS. CHING" width={36} height={36} className="h-9 w-auto" />
          </Link>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-sandrift-400 transition-colors hover:text-sandrift-700"
            aria-label="關閉選單"
          >
            <X className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pt-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path || '/'}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition-colors active:bg-sandrift-50/60"
              onClick={onClose}
            >
              {item.icon && (
                <Image src={item.icon} alt="" width={18} height={18} className="h-[18px] w-[18px] opacity-50" />
              )}
              <span className="text-sm font-medium text-sandrift-800">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-sandrift-100/40 px-5 py-4">
          <div className="flex items-center gap-3">
            <a href={socialMediaLinks.lineOfficial} target="_blank" rel="noopener noreferrer" aria-label="LINE" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-sandrift-50 transition-colors hover:bg-sandrift-100">
              <Image src="/images/footer/icon_line.png" alt="LINE" width={20} height={20} className="h-5 w-5" />
            </a>
            <a href={socialMediaLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-sandrift-50 transition-colors hover:bg-sandrift-100">
              <Image src="/images/footer/icon_ig.png" alt="Instagram" width={20} height={20} className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
