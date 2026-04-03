import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left — copy */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-sandrift-950">
            手作烘焙的溫度
          </h1>
          <p className="text-base md:text-lg text-sandrift-500 mt-4">
            堅持天然食材、新鮮現做，每一口都是用心的味道
          </p>
          <div className="flex items-center gap-4 mt-8">
            <a
              href="#products"
              className="inline-flex items-center gap-2 bg-sandrift-500 text-white rounded-xl px-8 py-3.5 text-sm font-semibold hover:bg-sandrift-600 transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              探索商品
            </a>
            <Link
              href="/about"
              className="text-sm font-medium text-sandrift-600 hover:text-sandrift-800 transition-colors"
            >
              了解我們
            </Link>
          </div>
        </div>

        {/* Right — product image */}
        <div className="rounded-3xl bg-sandrift-50/50 p-8 aspect-square flex items-center justify-center">
          <Image
            src="/images/products/almond_cookie.png"
            alt="手作杏仁瓦片"
            width={600}
            height={600}
            className="max-w-[80%] object-contain"
            priority
          />
        </div>
      </div>
    </section>
  )
}
