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
  title: '服務條款及退換貨流程',
}

const serviceTerms = [
  '本店提供LINE Pay、信用卡及ATM轉帳等多元付款方式，請依訂單指示完成付款。',
  '所有商品皆為接單後製作（made-to-order），確保每位顧客收到最新鮮的產品。',
  '商品製作時間約5-7個工作天，如遇訂單量較大或節慶期間，製作時間可能延長。',
  '下單前請詳閱商品說明，如有任何疑問歡迎透過LINE或IG私訊詢問。',
  '付款完成後系統將自動發送訂單確認通知，請留意您的訊息。',
  '如需取消訂單，請於付款後24小時內聯繫客服，逾時恕無法取消。',
  '本店有權因食材供應狀況調整商品內容，如有異動將主動通知。',
  '商品售價已包含包裝費用，運費依配送方式另計。',
  '本店保留修改服務條款之權利，修改後將於官方平台公告。',
  '使用本店服務即表示同意遵守本服務條款之所有規範。',
  '如有任何消費糾紛，雙方同意先行協商處理，協商不成依中華民國法律規定辦理。',
]

const returnApplicable = [
  '收到商品時發現商品有破損、變質或與訂購內容不符。',
  '商品於運送過程中造成明顯損壞（需提供照片證明）。',
  '商品數量與訂單不符。',
]

const returnClaim =
  '收到商品後24小時內，請拍攝商品照片（含外包裝及商品本體），透過LINE或IG私訊客服回報問題，我們將盡速為您處理。逾時恕不受理。'

const returnRefund =
  '經確認符合退換貨條件後，將於5-7個工作天內完成退款作業，退款將退回原付款帳戶。如需換貨，將於收到退回商品後重新製作出貨。'

const returnNotApplicable = [
  '因個人口味偏好不符而要求退換貨。',
  '商品已拆封食用後要求退換貨。',
  '超過收貨後24小時才提出退換貨申請。',
  '因顧客提供錯誤取貨資訊導致商品無法送達或逾期未取。',
]

export default function ServiceAndReturnTermsPage() {
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
              <BreadcrumbPage>服務條款及退換貨流程</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Page title */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 text-center">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-sandrift-950">
          服務條款及退換貨流程
        </h1>
        <p className="mt-2 text-[13px] text-sandrift-400">
          保障您的消費權益，請詳閱以下說明
        </p>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Service Terms */}
          <div className="rounded-2xl bg-white/70 p-5 ring-1 ring-sandrift-100/40 backdrop-blur-sm">
            <h2 className="mb-3 text-[15px] font-bold text-sandrift-900">
              服務條款
            </h2>
            <ol className="list-decimal pl-5 space-y-1.5 text-[13px] text-sandrift-600">
              {serviceTerms.map((term, index) => (
                <li key={index} className="leading-relaxed">
                  {term}
                </li>
              ))}
            </ol>
          </div>

          {/* Return/Exchange */}
          <div className="rounded-2xl bg-white/70 p-5 ring-1 ring-sandrift-100/40 backdrop-blur-sm">
            <h2 className="mb-3 text-[15px] font-bold text-sandrift-900">
              退換貨流程
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-[13px] font-semibold text-sandrift-700">
                  適用退換貨條件
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-[13px] text-sandrift-600">
                  {returnApplicable.map((item, index) => (
                    <li key={index} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-[13px] font-semibold text-sandrift-700">
                  申請時限與方式
                </h3>
                <p className="text-[13px] leading-relaxed text-sandrift-600">
                  {returnClaim}
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-[13px] font-semibold text-sandrift-700">
                  退款作業
                </h3>
                <p className="text-[13px] leading-relaxed text-sandrift-600">
                  {returnRefund}
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-[13px] font-semibold text-sandrift-700">
                  不適用退換貨情形
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-[13px] text-sandrift-600">
                  {returnNotApplicable.map((item, index) => (
                    <li key={index} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
