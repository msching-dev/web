import Image from 'next/image'
import Link from 'next/link'
import { socialMediaLinks } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="border-t border-sandrift-100/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
        {/* Mobile: 居中堆疊 */}
        <div className="flex flex-col items-center gap-3 lg:hidden">
          <Link href="/" className="cursor-pointer">
            <Image src="/images/logo.svg" alt="MS. CHING" width={36} height={36} className="h-9 w-auto opacity-40" />
          </Link>
          <div className="flex items-center gap-3">
            <a href={socialMediaLinks.lineOfficial} target="_blank" rel="noopener noreferrer" aria-label="LINE" className="cursor-pointer transition-opacity hover:opacity-60">
              <Image src="/images/footer/icon_line.png" alt="LINE" width={32} height={32} className="h-8 w-8" />
            </a>
            <a href={socialMediaLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="cursor-pointer transition-opacity hover:opacity-60">
              <Image src="/images/footer/icon_ig.png" alt="Instagram" width={32} height={32} className="h-8 w-8" />
            </a>
          </div>
          <p className="text-[12px] text-sandrift-400">msching.handmade@gmail.com</p>
          <div className="flex items-center gap-2.5">
            <p className="text-[11px] text-sandrift-300">&copy; {new Date().getFullYear()} msching.com</p>
            <Image src="/images/footer/icon_kristy_ad.png" alt="Designed by Kristy" width={72} height={14} className="h-3.5 w-auto opacity-25" />
          </div>
        </div>

        {/* Desktop: 三欄對齊 */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:items-center">
          {/* 左：聯絡 */}
          <div>
            <p className="text-[13px] font-medium text-sandrift-700">聯繫我們</p>
            <p className="mt-0.5 text-[12px] text-sandrift-400">msching.handmade@gmail.com</p>
          </div>

          {/* 中：Logo + 社群 + 版權 */}
          <div className="flex flex-col items-center gap-2.5">
            <Link href="/" className="cursor-pointer">
              <Image src="/images/logo.svg" alt="MS. CHING" width={36} height={36} className="h-9 w-auto opacity-40" />
            </Link>
            <div className="flex items-center gap-3">
              <a href={socialMediaLinks.lineOfficial} target="_blank" rel="noopener noreferrer" aria-label="LINE" className="cursor-pointer transition-opacity hover:opacity-60">
                <Image src="/images/footer/icon_line.png" alt="LINE" width={28} height={28} className="h-7 w-7" />
              </a>
              <a href={socialMediaLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="cursor-pointer transition-opacity hover:opacity-60">
                <Image src="/images/footer/icon_ig.png" alt="Instagram" width={28} height={28} className="h-7 w-7" />
              </a>
            </div>
            <p className="text-[11px] text-sandrift-300">&copy; {new Date().getFullYear()} msching.com</p>
          </div>

          {/* 右：設計師 */}
          <div className="flex justify-end">
            <Image src="/images/footer/icon_kristy_ad.png" alt="Designed by Kristy" width={96} height={18} className="h-4 w-auto opacity-30" />
          </div>
        </div>
      </div>
    </footer>
  )
}
