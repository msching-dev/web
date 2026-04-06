'use client'

import { useEffect, useState, useTransition } from 'react'
import type { OrderDetail } from '@/types'
import { updateOrderStatus, updateOrderAdmin } from './actions'

const statusFlow: Record<string, { next: string; label: string } | null> = {
  pending_payment: { next: 'paid', label: '標記已付款' },
  paid: { next: 'preparing', label: '開始製作' },
  preparing: { next: 'shipped', label: '標記已寄出' },
  shipped: { next: 'completed', label: '標記完成' },
  completed: null,
  cancelled: null,
}

export default function OrderDetailPanel({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [adminNote, setAdminNote] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/admin/orders/${orderId}`)
      .then(r => r.json())
      .then(data => {
        setOrder(data)
        setAdminNote(data.admin_note ?? '')
        setTrackingNumber(data.tracking_number ?? '')
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [orderId])

  const handleStatusChange = (status: string) => {
    if (!confirm(`確定要將訂單狀態改為「${statusFlow[order?.status ?? '']?.label}」嗎？`)) return
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, status)
      if (result.error) { setMessage(`錯誤：${result.error}`); return }
      setMessage('狀態已更新')
      const r = await fetch(`/api/admin/orders/${orderId}`)
      setOrder(await r.json())
    })
  }

  const handleCancel = () => {
    if (!confirm('確定要取消此訂單嗎？此操作無法復原。')) return
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, 'cancelled')
      if (result.error) { setMessage(`錯誤：${result.error}`); return }
      setMessage('訂單已取消')
      const r = await fetch(`/api/admin/orders/${orderId}`)
      setOrder(await r.json())
    })
  }

  const handleSaveAdmin = () => {
    startTransition(async () => {
      const result = await updateOrderAdmin(orderId, {
        admin_note: adminNote,
        tracking_number: trackingNumber,
      })
      if (result.error) { setMessage(`錯誤：${result.error}`); return }
      setMessage('已儲存')
      setTimeout(() => setMessage(null), 2000)
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-sandrift-300 border-t-sandrift-600" />
      </div>
    )
  }

  if (!order) {
    return <div className="py-8 text-center text-sm text-sandrift-400">無法載入訂單詳情</div>
  }

  const nextAction = statusFlow[order.status]

  return (
    <div className="space-y-4 p-4 sm:p-6">
      {message && (
        <div className="rounded-lg bg-sandrift-50 px-3 py-2 text-xs text-sandrift-600 animate-fade-in">
          {message}
        </div>
      )}

      {/* 顧客資訊 */}
      <div>
        <h4 className="mb-2 text-xs font-semibold text-sandrift-400 uppercase tracking-wider">顧客資訊</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-sandrift-400">姓名：</span><span className="text-sandrift-900">{order.customer_name ?? '—'}</span></div>
          <div><span className="text-sandrift-400">電話：</span><span className="text-sandrift-900">{order.customer_phone ?? '—'}</span></div>
          <div><span className="text-sandrift-400">取貨方式：</span><span className="text-sandrift-900">{order.shipping_method ?? '—'}</span></div>
          <div className="col-span-2"><span className="text-sandrift-400">地址：</span><span className="text-sandrift-900">{order.shipping_address ?? '—'}</span></div>
        </div>
      </div>

      {/* 商品明細 */}
      <div>
        <h4 className="mb-2 text-xs font-semibold text-sandrift-400 uppercase tracking-wider">商品明細</h4>
        <div className="rounded-xl bg-white/60 ring-1 ring-sandrift-100/30 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sandrift-100/30 text-xs text-sandrift-400">
                <th className="px-3 py-2 text-left font-medium">商品</th>
                <th className="px-3 py-2 text-right font-medium">單價</th>
                <th className="px-3 py-2 text-right font-medium">數量</th>
                <th className="px-3 py-2 text-right font-medium">小計</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sandrift-100/20">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-3 py-2 text-sandrift-900">{item.product_name}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-sandrift-600">NT${item.product_price}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-sandrift-600">{item.quantity}</td>
                  <td className="px-3 py-2 text-right tabular-nums font-medium text-sandrift-900">NT${item.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t border-sandrift-100/30 px-3 py-2 text-sm">
            <div className="flex justify-between text-sandrift-500">
              <span>小計</span><span className="tabular-nums">NT${order.subtotal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sandrift-500">
              <span>運費</span><span className="tabular-nums">NT${order.shipping_fee}</span>
            </div>
            <div className="flex justify-between font-semibold text-sandrift-950 mt-1 pt-1 border-t border-sandrift-100/20">
              <span>合計</span><span className="tabular-nums">NT${order.total_amount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 管理操作 */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-sandrift-400">追蹤碼</label>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="輸入物流追蹤碼"
            className="w-full rounded-xl bg-white/60 h-10 px-3 text-sm text-sandrift-900 ring-1 ring-sandrift-200/30 placeholder:text-sandrift-300 focus:bg-white focus:ring-sandrift-300/50 focus:outline-none transition-all duration-200"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-sandrift-400">管理員備註</label>
          <input
            type="text"
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder="內部備註"
            className="w-full rounded-xl bg-white/60 h-10 px-3 text-sm text-sandrift-900 ring-1 ring-sandrift-200/30 placeholder:text-sandrift-300 focus:bg-white focus:ring-sandrift-300/50 focus:outline-none transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleSaveAdmin}
          disabled={isPending}
          className="cursor-pointer rounded-xl bg-white/60 px-5 py-2.5 text-sm font-medium text-sandrift-700 ring-1 ring-sandrift-200/30 transition-all duration-200 hover:bg-sandrift-50 disabled:opacity-50"
        >
          儲存備註
        </button>
        {nextAction && (
          <button
            onClick={() => handleStatusChange(nextAction.next)}
            disabled={isPending}
            className="cursor-pointer rounded-xl bg-sandrift-500 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-sandrift-600 disabled:opacity-50"
          >
            {nextAction.label}
          </button>
        )}
        {order.status !== 'cancelled' && order.status !== 'completed' && (
          <button
            onClick={handleCancel}
            disabled={isPending}
            className="cursor-pointer rounded-xl px-5 py-2.5 text-sm font-medium text-red-500 ring-1 ring-red-100/50 transition-all duration-200 hover:bg-red-50 disabled:opacity-50"
          >
            取消訂單
          </button>
        )}
      </div>

      {/* 時間軸 */}
      <div className="border-t border-sandrift-100/30 pt-3">
        <h4 className="mb-2 text-xs font-semibold text-sandrift-400 uppercase tracking-wider">時間記錄</h4>
        <div className="space-y-1 text-xs text-sandrift-500">
          <div>建立時間：{new Date(order.created_at).toLocaleString('zh-TW')}</div>
          {order.paid_at && <div>付款時間：{new Date(order.paid_at).toLocaleString('zh-TW')}</div>}
          {order.shipped_at && <div>出貨時間：{new Date(order.shipped_at).toLocaleString('zh-TW')}</div>}
        </div>
      </div>
    </div>
  )
}
