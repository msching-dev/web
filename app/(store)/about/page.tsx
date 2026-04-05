import type { Metadata } from 'next'
import Image from 'next/image'
import { Leaf, HandHeart, CakeSlice } from 'lucide-react'
import PageHero from '@/components/layout/page-hero'
import TimelineSection from '@/components/about/timeline-section'

export const metadata: Metadata = {
  title: '關於我們',
  description:
    '了解蜜絲晴烘焙手作坊的品牌故事、創辦理念與品牌特色。從軟體工程師轉行烘焙師的故事，用愛與熱情製作每一份手工甜點。',
}

const timelineNodes = [
  {
    label: 'Origin',
    title: '從程式碼到麵粉',
    icon: '/images/about/brand_story.png',
    content: (
      <>
        <p>
          老闆白天寫程式，晚上研究烘焙。一開始只是想做出讓家人安心吃的甜點，後來朋友吃了都說「你該賣的」，就這樣一腳踏進了烘焙坑。
        </p>
        <div className="my-3 h-px w-12 bg-sandrift-200/40 md:ml-auto" />
        <p className="text-sandrift-500">
          工程師的職業病 — 凡事講究精準，這個習慣也帶到了廚房。溫度、比例、時間，每一個變數都反覆測試，直到自己滿意為止。
        </p>
      </>
    ),
  },
  {
    label: 'Philosophy',
    title: '做甜點就三件事',
    icon: '/images/about/brand_feature.png',
    content: (
      <div className="space-y-3.5">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sandrift-100/50 ring-1 ring-sandrift-200/30">
            <Leaf className="h-4 w-4 text-sandrift-400" />
          </div>
          <div>
            <span className="text-[13px] font-bold text-sandrift-800">食材天然</span>
            <p className="text-[12px] text-sandrift-500 mt-0.5 leading-relaxed">不加有的沒的。無人工添加、無防腐劑，吃得到食材本身的味道。</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sandrift-100/50 ring-1 ring-sandrift-200/30">
            <HandHeart className="h-4 w-4 text-sandrift-400" />
          </div>
          <div>
            <span className="text-[13px] font-bold text-sandrift-800">全程手作</span>
            <p className="text-[12px] text-sandrift-500 mt-0.5 leading-relaxed">每一個步驟都是手工完成，沒有流水線，只有一雙手和一顆認真的心。</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sandrift-100/50 ring-1 ring-sandrift-200/30">
            <CakeSlice className="h-4 w-4 text-sandrift-400" />
          </div>
          <div>
            <span className="text-[13px] font-bold text-sandrift-800">用料頂級</span>
            <p className="text-[12px] text-sandrift-500 mt-0.5 leading-relaxed">原料就是甜點的靈魂，從源頭把關，不將就。</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    label: 'Brand',
    title: 'MS. CHING 這個名字',
    icon: '/images/about/brand_feature.png',
    content: (
      <>
        <p>
          蜜絲晴，聽起來甜甜的，就像我們想帶給你的感覺。不只是好吃，是收到的時候會微笑、咬一口會覺得被療癒的那種。
        </p>
        <p>
          送禮、犒賞自己、或只是平凡日子裡想來點小確幸 — 都可以。
        </p>
        <blockquote className="mt-3 border-l-2 border-sandrift-300/40 pl-3 text-[12px] text-sandrift-400 italic leading-relaxed">
          用甜點療癒生活，用溫暖陪伴每個重要時刻。
        </blockquote>
      </>
    ),
  },
  {
    label: 'Logo',
    title: 'LOGO 的小故事',
    icon: '/images/about/logo_design.png',
    content: (
      <>
        <p>
          一隻慵懶的法鬥犬配上一塊精緻蛋糕，用<span className="text-sandrift-800 font-medium">香檳金</span>串起整個畫面。
        </p>
        <p>
          法鬥代表的是一種態度 — 放鬆、自在、享受當下。搭配手作甜點，就是我們想說的：慢下來，好好品味這一口。
        </p>
        {/* Logo 展示 */}
        <div className="relative mt-6 rounded-2xl border border-sandrift-200/30 bg-sandrift-50/30 p-6 md:p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-6 rounded-full bg-sandrift-200/12 blur-2xl transition-all duration-500 group-hover:bg-sandrift-200/25" />
              <Image
                src="/images/logo.svg"
                alt="MS. CHING Logo"
                width={140}
                height={140}
                className="relative transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="h-px w-6 bg-sandrift-300/30" />
              <span className="text-[11px] tracking-widest text-sandrift-400/60 uppercase">Handmade Bakery</span>
              <span className="h-px w-6 bg-sandrift-300/30" />
            </div>
          </div>
        </div>
      </>
    ),
  },
]

export default function AboutPage() {
  return (
    <div className="animate-page-enter">
      <PageHero
        title="關於蜜絲晴"
        subtitle="入口即是愛的滋味"
        watermark={2}
      />

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 md:pt-10 md:pb-16">
        <TimelineSection nodes={timelineNodes} />
      </section>
    </div>
  )
}
