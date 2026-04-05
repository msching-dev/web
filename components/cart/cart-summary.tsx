'use client'

interface CartSummaryProps {
  subtotal: number
  itemCount: number
}

export default function CartSummary({ subtotal, itemCount }: CartSummaryProps) {
  return (
    <div className="rounded-2xl bg-sandrift-50/30 p-5 ring-1 ring-sandrift-100/30">
      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between text-sandrift-600">
          <span>商品小計（{itemCount} 件）</span>
          <span>NT${subtotal}</span>
        </div>
        <div className="flex justify-between text-sandrift-400">
          <span>運費</span>
          <span>待結算</span>
        </div>
        <div className="border-t border-sandrift-200/40 pt-2.5">
          <div className="flex justify-between font-semibold text-sandrift-900">
            <span>合計</span>
            <span>NT${subtotal}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
