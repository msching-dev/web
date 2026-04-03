import Link from 'next/link'
import { Camera } from 'lucide-react'

export default function BrandStorySection() {
  return (
    <section className="bg-sandrift-50/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left — photo placeholder */}
          <div className="aspect-[4/3] rounded-2xl bg-sandrift-100/50 flex flex-col items-center justify-center gap-3">
            <Camera className="h-10 w-10 text-sandrift-300" />
            <span className="text-sm text-sandrift-400">照片即將更新</span>
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
