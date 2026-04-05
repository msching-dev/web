import type { Metadata } from 'next'
import Image from 'next/image'
import PageHero from '@/components/layout/page-hero'

export const metadata: Metadata = {
  title: '關於我們',
  description:
    '了解蜜絲晴烘焙手作坊的品牌故事、創辦理念與品牌特色。從軟體工程師轉行烘焙師的故事，用愛與熱情製作每一份手工甜點，傳遞幸福滋味。',
}

const sections = [
  {
    title: '品牌特色',
    icon: '/images/about/brand_feature.png',
    content:
      '堅持天然食材、手工製作、傳遞幸福滋味。品牌色系：奶油白、粉色、香檳金，呈現出溫暖而優雅的品牌形象，讓每一位顧客感受到我們對烘焙的熱愛與用心。',
  },
  {
    title: '品牌故事',
    icon: '/images/about/brand_story.png',
    content:
      '創辦人從軟體工程師轉行烘焙師的故事，用愛與熱情製作每一份甜點。從一個小小的廚房開始，憑藉著對烘焙的執著與堅持，逐漸打造出屬於自己的手作烘焙品牌，希望將這份幸福的滋味傳遞給每一位品嚐的人。',
  },
  {
    title: 'LOGO 設計理念',
    icon: '/images/about/logo_design.png',
    content:
      '慵懶法鬥犬象徵放鬆享受，搭配手工蛋糕元素，傳達品牌「享受當下、品味生活」的核心理念。圓潤的線條與溫暖的色調，讓人感受到家的溫馨與手作的質感。',
  },
]

export default function AboutPage() {
  return (
    <div className="animate-page-enter">
      <PageHero
        breadcrumbs={[
          { label: '首頁', href: '/' },
          { label: '關於我們' },
        ]}
        title="關於我們"
        watermark={2}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {sections.map((section) => (
            <div
              key={section.title}
              className="group rounded-2xl bg-white/70 p-5 ring-1 ring-sandrift-100/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(176,141,98,0.08)]"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-sandrift-50/80">
                <Image
                  src={section.icon}
                  alt={section.title}
                  width={32}
                  height={32}
                  className="opacity-70"
                />
              </div>
              <h2 className="mb-2 text-[15px] font-bold text-sandrift-900">
                {section.title}
              </h2>
              <p className="text-[13px] leading-relaxed text-sandrift-500">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
