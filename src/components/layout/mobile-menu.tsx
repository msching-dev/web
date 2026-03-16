'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, ChevronDown } from 'lucide-react'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'
import { menuItems } from '@/lib/menus'
import { socialMediaLinks } from '@/lib/constants'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-sandrift-950/15 backdrop-blur-[3px] transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col bg-white/95 backdrop-blur-2xl backdrop-saturate-150 shadow-[4px_0_24px_rgba(0,0,0,0.06)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-end px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-sandrift-400 transition-colors hover:text-sandrift-700"
            aria-label="關閉選單"
          >
            <X className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto px-2">
          {menuItems
            .filter((item) => !item.hidden)
            .map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <Collapsible
                    open={expandedItem === item.name}
                    onOpenChange={(open) =>
                      setExpandedItem(open ? item.name : null)
                    }
                  >
                    <CollapsibleTrigger className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors active:bg-sandrift-50/60">
                      {item.icon && (
                        <Image src={item.icon} alt="" width={18} height={18} className="h-[18px] w-[18px] opacity-50" />
                      )}
                      <span className="flex-1 text-[14px] font-medium text-sandrift-800">
                        {item.name}
                      </span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 text-sandrift-300 transition-transform duration-300 ${
                          expandedItem === item.name ? 'rotate-180' : ''
                        }`}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="pb-1">
                        {item.children
                          .filter((child) => !child.hidden)
                          .map((child) => (
                            <Link
                              key={child.name}
                              href={child.path || '#'}
                              className="block cursor-pointer rounded-lg py-2.5 pl-12 pr-3 text-[13px] text-sandrift-500 transition-colors active:bg-sandrift-50/60"
                              onClick={onClose}
                            >
                              {child.name}
                            </Link>
                          ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <Link
                    href={item.path || '#'}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition-colors active:bg-sandrift-50/60"
                    onClick={onClose}
                  >
                    {item.icon && (
                      <Image src={item.icon} alt="" width={18} height={18} className="h-[18px] w-[18px] opacity-50" />
                    )}
                    <span className="text-[14px] font-medium text-sandrift-800">{item.name}</span>
                  </Link>
                )}
              </div>
            ))}
        </nav>

        {/* Bottom */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-2.5">
            <a href={socialMediaLinks.lineOfficial} target="_blank" rel="noopener noreferrer" aria-label="LINE" className="cursor-pointer transition-opacity hover:opacity-70">
              <Image src="/images/footer/icon_line.png" alt="LINE" width={24} height={24} className="h-6 w-6" />
            </a>
            <a href={socialMediaLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="cursor-pointer transition-opacity hover:opacity-70">
              <Image src="/images/footer/icon_ig.png" alt="Instagram" width={24} height={24} className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
