import type { Metadata } from 'next'
import Image from 'next/image'
import { socialMediaLinks } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Coming Soon',
}

export default function ComingSoonPage() {
  return (
    <div className="flex min-h-[80dvh] items-center justify-center px-4 sm:px-6">
      <div className="text-center animate-page-enter">
        <h1 className="mb-5 text-5xl font-bold tracking-wider text-sandrift-800 md:text-7xl">
          Coming
          <br />
          <span className="bg-gradient-to-r from-sandrift-500 via-sandrift-400 to-sandrift-600 bg-clip-text text-transparent">
            Soon
          </span>
        </h1>

        <p className="mx-auto mb-8 max-w-xs text-[14px] text-sandrift-500 leading-relaxed">
          即將推出，追蹤我們的社交平台，掌握最新資訊。
        </p>

        <div className="glass-subtle inline-flex items-center gap-2.5 rounded-2xl p-1.5 ring-1 ring-white/30">
          <a
            href={socialMediaLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-white/70 px-5 py-2.5 text-[13px] font-medium text-sandrift-700 transition-colors hover:bg-white"
          >
            <Image
              src="/images/footer/icon_ig.png"
              alt="Instagram"
              width={20}
              height={20}
              className="h-5 w-5"
            />
            Instagram
          </a>
          <a
            href={socialMediaLinks.lineOfficial}
            target="_blank"
            rel="noopener noreferrer"
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-white/70 px-5 py-2.5 text-[13px] font-medium text-sandrift-700 transition-colors hover:bg-white"
          >
            <Image
              src="/images/footer/icon_line.png"
              alt="LINE"
              width={20}
              height={20}
              className="h-5 w-5"
            />
            LINE
          </a>
        </div>
      </div>
    </div>
  )
}
