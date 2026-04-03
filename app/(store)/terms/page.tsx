import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: '購買須知',
}

const paymentRules = [
  '請透過LINE或IG私訊下單，提供商品名稱、數量及取貨資訊。',
  '下單後請於24小時內完成付款，逾時訂單將自動取消。',
  '僅接受銀行轉帳，付款完成後請提供轉帳後五碼以利對帳。',
  '產品含小麥、蛋、乳製品等過敏原，有食物過敏者請自行評估後再行購買。',
  '商品價格以官方公告為準，如有調整將提前通知。',
  '個人資料僅用於訂單處理，本店將妥善保管不外洩。',
  '未成年人請由法定代理人下單及付款。',
  '付款後不可修改訂單，請於下單前確認訂單內容無誤。',
  '本店保留最終解釋權，如有任何疑問歡迎透過LINE或IG聯繫。',
]

const shippingRules = [
  '僅提供全家超商取貨服務，請確認取貨門市名稱及地址正確。',
  '運送途中因不可抗力因素造成商品損壞，本店不負責賠償。',
  '付款確認後2-3個工作天出貨，出貨後將提供取貨通知。',
  '如遇不可抗力因素（天災、物流異常等）將另行通知出貨時間。',
  '請確認取貨門市正確，如因資訊錯誤導致無法取貨，需自行負責。',
  '超商取貨請於期限內前往領取，逾期退回恕不負責。',
  '生鮮食品不適用七天鑑賞期，請於收到後盡快食用。',
  '商品圖片僅供參考，實際商品可能因批次不同略有差異。',
  '節慶期間出貨時間可能延長，請提前預訂以確保如期收到。',
  '收到商品請當面確認商品完整性，如有問題請立即反映。',
]

export default function TermsPage() {
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
              <BreadcrumbPage>購買須知</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Page title */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 text-center">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-sandrift-950">
          購買須知
        </h1>
        <p className="mt-2 text-[13px] text-sandrift-400">
          下單前請詳閱以下規則，感謝您的配合
        </p>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Payment Rules */}
          <div className="rounded-2xl bg-white/70 p-5 ring-1 ring-sandrift-100/40 backdrop-blur-sm">
            <h2 className="mb-3 text-[15px] font-bold text-sandrift-900">
              付款規則
            </h2>
            <ol className="list-decimal pl-5 space-y-1.5 text-[13px] text-sandrift-600">
              {paymentRules.map((rule, index) => (
                <li key={index} className="leading-relaxed">
                  {rule}
                </li>
              ))}
            </ol>
          </div>

          {/* Shipping Rules */}
          <div className="rounded-2xl bg-white/70 p-5 ring-1 ring-sandrift-100/40 backdrop-blur-sm">
            <h2 className="mb-3 text-[15px] font-bold text-sandrift-900">
              出貨規則
            </h2>
            <ol className="list-decimal pl-5 space-y-1.5 text-[13px] text-sandrift-600">
              {shippingRules.map((rule, index) => (
                <li key={index} className="leading-relaxed">
                  {rule}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
