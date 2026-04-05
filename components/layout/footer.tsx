import Image from 'next/image'
import Link from 'next/link'
import { socialMediaLinks } from '@/lib/constants'

const quickLinks = [
  { name: '首頁', href: '/' },
  { name: '所有商品', href: '/#products' },
  { name: '常見問題', href: '/faq' },
  { name: '關於我們', href: '/about' },
]

const policyLinks = [
  { name: '購買須知', href: '/terms' },
  { name: '服務條款及退換貨', href: '/service-and-return-terms' },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-sandrift-100/60 pb-20 lg:pb-0 overflow-hidden">
      {/* Watermark decoration */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 opacity-[0.03]">
        <Image src="/images/watermark_3.png" alt="" fill className="object-contain" />
      </div>
      <div className="pointer-events-none absolute -left-12 -bottom-12 h-48 w-48 opacity-[0.03]">
        <Image src="/images/watermark_4.png" alt="" fill className="object-contain" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Mobile */}
        <div className="py-8 lg:hidden">
          <div className="flex flex-col items-center gap-6">
            <Link href="/" className="cursor-pointer">
              <Image src="/images/logo.svg" alt="MS. CHING" width={40} height={40} className="h-10 w-auto" />
            </Link>

            {/* Quick links */}
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-sandrift-500 transition-colors hover:text-sandrift-800"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Social */}
            <div className="flex items-center gap-4">
              <a
                href={socialMediaLinks.lineOfficial}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LINE"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-sandrift-50 transition-all duration-200 hover:bg-sandrift-100 hover:scale-110 hover:shadow-sm"
              >
                <Image src="/images/footer/icon_line.png" alt="LINE" width={28} height={28} className="h-7 w-7" />
              </a>
              <a
                href={socialMediaLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-sandrift-50 transition-all duration-200 hover:bg-sandrift-100 hover:scale-110 hover:shadow-sm"
              >
                <Image src="/images/footer/icon_ig.png" alt="Instagram" width={28} height={28} className="h-7 w-7" />
              </a>
            </div>

            <p className="text-xs text-sandrift-400">msching.handmade@gmail.com</p>

            <div className="flex items-center gap-3">
              <p className="text-xs text-sandrift-300">&copy; {new Date().getFullYear()} msching.com</p>
              <Image src="/images/footer/icon_kristy_ad.png" alt="Designed by Kristy" width={72} height={14} className="h-3.5 w-auto opacity-30" />
            </div>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden py-12 lg:block">
          <div className="grid grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1">
              <Link href="/" className="cursor-pointer">
                <Image src="/images/logo.svg" alt="MS. CHING" width={44} height={44} className="h-11 w-auto" />
              </Link>
              <p className="mt-3 text-sm text-sandrift-500">
                手作烘焙的溫度，入口即是愛的滋味
              </p>
              <p className="mt-2 text-xs text-sandrift-400">
                msching.handmade@gmail.com
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-sandrift-400">快速連結</h4>
              <nav className="mt-3 flex flex-col gap-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-sandrift-600 transition-colors hover:text-sandrift-900"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Policies */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-sandrift-400">購物資訊</h4>
              <nav className="mt-3 flex flex-col gap-2">
                {policyLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-sandrift-600 transition-colors hover:text-sandrift-900"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              <p className="mt-3 text-xs text-sandrift-400">純線上經營，無實體店面</p>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-sandrift-400">社群</h4>
              <div className="mt-3 flex items-center gap-3">
                <a
                  href={socialMediaLinks.lineOfficial}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LINE"
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-sandrift-50 transition-all duration-200 hover:bg-sandrift-100 hover:scale-110 hover:shadow-sm"
                >
                  <Image src="/images/footer/icon_line.png" alt="LINE" width={28} height={28} className="h-7 w-7" />
                </a>
                <a
                  href={socialMediaLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-sandrift-50 transition-all duration-200 hover:bg-sandrift-100 hover:scale-110 hover:shadow-sm"
                >
                  <Image src="/images/footer/icon_ig.png" alt="Instagram" width={28} height={28} className="h-7 w-7" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 flex items-center justify-between border-t border-sandrift-100/40 pt-6">
            <p className="text-xs text-sandrift-300">&copy; {new Date().getFullYear()} msching.com</p>
            <Image src="/images/footer/icon_kristy_ad.png" alt="Designed by Kristy" width={96} height={18} className="h-4 w-auto opacity-30" />
          </div>
        </div>
      </div>
    </footer>
  )
}
