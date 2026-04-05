import Image from 'next/image'
import { Star } from 'lucide-react'

const testimonials = [
  {
    initial: 'L',
    name: '林小姐',
    quote: '杏仁瓦片酥脆香甜，每次買都讓家人搶著吃！',
  },
  {
    initial: 'C',
    name: '陳先生',
    quote: '送禮首選！包裝精美，朋友收到都很開心。',
  },
  {
    initial: 'W',
    name: '王小姐',
    quote: '瑪德蓮口感綿密，茶香味很自然，回購好幾次了。',
  },
]

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section className="relative bg-sandrift-50/30">
      {/* Top gradient fade-in */}
      <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-background to-transparent" />
      {/* Bottom gradient fade-out */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-background to-transparent" />

      {/* Watermark */}
      <div className="pointer-events-none absolute -left-10 top-1/2 -translate-y-1/2 h-56 w-56 opacity-[0.03] hidden md:block">
        <Image src="/images/watermark_3.png" alt="" fill className="object-contain" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <h2 className="text-xl md:text-2xl font-bold text-sandrift-950 text-center mb-6 md:mb-8">
          顧客好評
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.initial}
              className="rounded-2xl bg-white p-6 ring-1 ring-sandrift-100/60"
            >
              <Stars />
              <p className="text-sm text-sandrift-600 leading-relaxed mt-3">
                「{t.quote}」
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-9 h-9 rounded-full bg-sandrift-200/60 flex items-center justify-center text-xs font-semibold text-sandrift-600">
                  {t.initial}
                </div>
                <span className="text-sm font-medium text-sandrift-800">
                  {t.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
