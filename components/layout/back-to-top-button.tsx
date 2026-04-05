'use client'

import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`fixed bottom-5 right-4 z-40 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/80 text-sandrift-500 ring-1 ring-sandrift-200/30 shadow-[0_2px_12px_rgba(176,141,98,0.08)] backdrop-blur-xl transition-all duration-300 hover:text-sandrift-800 hover:shadow-[0_4px_16px_rgba(176,141,98,0.15)] lg:bottom-8 lg:right-8 ${
        visible
          ? 'scale-100 opacity-100'
          : 'pointer-events-none scale-90 opacity-0'
      }`}
      aria-label="回到頂部"
    >
      <ChevronUp className="h-5 w-5" strokeWidth={1.5} />
    </button>
  )
}
