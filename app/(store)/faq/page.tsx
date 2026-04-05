import type { Metadata } from 'next'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import PageHero from '@/components/layout/page-hero'

export const metadata: Metadata = {
  title: '訂購Q&A',
  description:
    '蜜絲晴烘焙手作坊常見問題解答，包含訂購方式、出貨時間、付款方式、商品保存及退換貨說明，讓您購物更安心。',
}

const faqItems = [
  {
    question: '如何訂購？',
    answer:
      '透過LINE或IG私訊下單，請告知商品名稱、數量、取貨門市、收件人姓名及電話，我們會盡快為您處理訂單。',
  },
  {
    question: '出貨方式？',
    answer:
      '目前僅提供全家超商取貨服務，請在下單時提供正確的取貨門市資訊。',
  },
  {
    question: '出貨時間？',
    answer:
      '付款確認後2-3個工作天出貨，如遇假日或節慶期間可能會稍有延遲，我們會另行通知。',
  },
  {
    question: '付款方式？',
    answer:
      '目前僅接受銀行轉帳，下單後請於24小時內完成付款，並提供轉帳後五碼以利對帳。',
  },
  {
    question: '商品如何保存？',
    answer:
      '請將商品保存於常溫陰涼處，避免陽光直射及高溫潮濕環境，以維持最佳口感。',
  },
  {
    question: '可以修改訂單嗎？',
    answer:
      '付款前可透過LINE或IG私訊修改訂單內容，一旦完成付款，恕無法修改訂單。',
  },
  {
    question: '可以客製化嗎？',
    answer:
      '目前不提供客製化服務，所有商品皆依照官方公告品項製作。未來如有客製化服務，將另行公告。',
  },
  {
    question: '商品損壞怎麼辦？',
    answer:
      '收到商品後24小時內，如發現商品有破損或品質異常，請立即拍照並透過LINE或IG回報，我們會盡快為您處理。',
  },
  {
    question: '有實體店面嗎？',
    answer:
      '目前僅提供線上訂購服務，尚未設立實體店面。請透過LINE或IG下單選購。',
  },
]

export default function FaqPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <div className="animate-page-enter">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <PageHero
        title="訂購Q&A"
        subtitle="常見問題一次解答，讓您購物更安心"
        watermark={3}
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-16">
        <Accordion className="space-y-2.5">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={index}
              className="group/item rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_1px_4px_0_rgb(176_141_98/0.06),inset_0_1px_0_0_rgb(255_255_255/0.5)] transition-all duration-300 hover:bg-white/55 hover:shadow-[0_6px_20px_0_rgb(176_141_98/0.1),inset_0_1px_0_0_rgb(255_255_255/0.7)] hover:-translate-y-0.5 data-open:bg-white/65 data-open:shadow-[0_8px_24px_0_rgb(176_141_98/0.12),inset_0_1px_0_0_rgb(255_255_255/0.8)] data-open:border-white/80"
            >
              <AccordionTrigger className="cursor-pointer text-left text-sandrift-800 text-[14px] py-4 px-5 rounded-2xl transition-all duration-300 hover:no-underline">
                <span className="mr-3 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sandrift-100/70 text-[11px] font-bold text-sandrift-500 transition-all duration-300 group-data-open/item:bg-sandrift-400 group-data-open/item:text-white group-data-open/item:shadow-[0_2px_8px_0_rgb(176_141_98/0.3)]">
                  {index + 1}
                </span>
                <span className="font-medium transition-colors duration-300 group-data-open/item:text-sandrift-900">{item.question}</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="mx-5 mb-4 ml-15 rounded-xl bg-sandrift-50/30 backdrop-blur-sm px-4 py-3 border border-sandrift-100/40">
                  <p className="text-[13px] text-sandrift-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
