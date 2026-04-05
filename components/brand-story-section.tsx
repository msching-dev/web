import Image from 'next/image'
import Link from 'next/link'
import { Cookie } from 'lucide-react'

export default function BrandStorySection() {
  return (
    <section className="relative bg-sandrift-50/30">
      {/* Top gradient fade-in */}
      <div className="absolute inset-x-0 top-0 h-10 bg-linear-to-b from-background to-transparent" />
      {/* Bottom gradient fade-out */}
      <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-background to-transparent" />

      {/* Watermark decoration */}
      <div className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 h-72 w-72 opacity-[0.03] hidden md:block">
        <Image src="/images/watermark_4.png" alt="" fill sizes="288px" className="object-contain" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left — photo placeholder */}
          <div className="relative aspect-4/3 rounded-2xl bg-sandrift-100/40 flex flex-col items-center justify-center gap-4 overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-linear-to-br from-sandrift-200/30 via-sandrift-50/10 to-sandrift-200/20" />
            {/* Center halo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 rounded-full bg-sandrift-200/25 blur-3xl" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-sandrift-50/80 shadow-[0_0_24px_rgba(176,141,98,0.12)] ring-1 ring-sandrift-200/20">
              <Cookie className="h-9 w-9 text-sandrift-300" />
            </div>
            <span className="relative text-sm font-medium tracking-wide text-sandrift-400/80">Coming Soon</span>
          </div>

          {/* Right — copy */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-sandrift-400 mb-2 block">
              Our Story
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-sandrift-950">
              從工程師到烘焙師
            </h2>
            <div className="text-sm leading-relaxed text-sandrift-500 mt-4 space-y-3">
              <p>
                一切的起點，是想為家人做出安心又美味的甜點。身為工程師的我，習慣追求精準與品質，這份堅持也延續到了烘焙之中。
              </p>
              <p>
                每一款產品都經過反覆測試與調整，從食材的挑選到製程的溫度控制，不放過任何細節。我相信，好的甜點不需要過多添加，天然的風味就是最好的味道。
              </p>
              <p>
                MS. CHING 不只是一個品牌，更是一份對生活品質的堅持。希望每一口都能帶給你幸福的感受。
              </p>
            </div>
            <Link
              href="/about"
              className="text-sm font-medium text-sandrift-600 hover:text-sandrift-800 mt-6 inline-block transition-colors"
            >
              了解更多 →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
