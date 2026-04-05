import Image from 'next/image'
import { socialMediaLinks } from '@/lib/constants'

const channels = [
  {
    name: '蝦皮商城',
    href: 'https://shopee.tw/msching_2022',
    banner: '/images/banner/shopee.png',
    description: '前往蝦皮選購',
  },
  {
    name: 'Instagram',
    href: socialMediaLinks.instagram,
    banner: '/images/banner/ig.png',
    description: '追蹤最新動態',
  },
  {
    name: 'LINE 官方帳號',
    href: socialMediaLinks.lineOfficial,
    banner: '/images/banner/line.png',
    description: '加入好友享優惠',
  },
]

export default function SocialLinksBar() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h2 className="text-xl md:text-2xl font-bold text-sandrift-950 text-center mb-2">
        更多購買管道
      </h2>
      <p className="text-sm text-sandrift-400 text-center mb-6 md:mb-8">
        選擇你習慣的方式，輕鬆下單
      </p>

      <div className="grid grid-cols-3 gap-3 md:gap-5">
        {channels.map((channel) => (
          <a
            key={channel.name}
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-2xl ring-1 ring-sandrift-100/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(176,141,98,0.1)]"
          >
            {/* Banner image as background */}
            <div className="relative aspect-16/10 sm:aspect-video">
              <Image
                src={channel.banner}
                alt={channel.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Gradient overlay — bottom fade for text readability */}
              <div className="absolute inset-0 bg-linear-to-t from-sandrift-950/60 via-sandrift-950/10 to-transparent" />
            </div>

            {/* Text overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
              <p className="text-[13px] sm:text-sm font-semibold text-white drop-shadow-sm">
                {channel.name}
              </p>
              <p className="text-[11px] text-white/70 mt-0.5 hidden sm:block">
                {channel.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
