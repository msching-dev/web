import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: '訂購Q&A',
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
  return (
    <div className="animate-page-enter">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>首頁</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>訂購Q&A</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Page title */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-5 text-center">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-sandrift-950">
          訂購Q&A
        </h1>
        <p className="mt-2 text-[13px] text-sandrift-400">
          常見問題一次解答，讓您購物更安心
        </p>
      </div>

      {/* FAQ content */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-10">
        <Accordion>
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={index}>
              <AccordionTrigger className="cursor-pointer text-left text-sandrift-800 text-[14px] py-3.5 px-3 -mx-3 rounded-xl transition-colors hover:no-underline hover:bg-sandrift-50/50">
                <span className="font-semibold text-sandrift-400 mr-2 text-[13px]">Q{index + 1}.</span>
                <span className="font-medium">{item.question}</span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="pl-10 pr-3 pb-1 text-[13px] text-sandrift-500 leading-relaxed">
                  {item.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
