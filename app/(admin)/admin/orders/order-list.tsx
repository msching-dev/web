'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { OrderListItem } from '@/types'
import StatusBadge from '@/components/admin/status-badge'
import OrderDetailPanel from './order-detail-panel'

interface OrderListProps {
  orders: OrderListItem[]
}

export default function OrderList({ orders }: OrderListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="rounded-2xl bg-white/60 ring-1 ring-sandrift-100/40 overflow-hidden">
      {/* Desktop 表格 */}
      <table className="hidden w-full sm:table">
        <thead>
          <tr className="border-b border-sandrift-100/40 text-left text-xs text-sandrift-400">
            <th className="px-4 py-3 font-medium">訂單編號</th>
            <th className="px-4 py-3 font-medium">顧客</th>
            <th className="px-4 py-3 font-medium">件數</th>
            <th className="px-4 py-3 font-medium">金額</th>
            <th className="px-4 py-3 font-medium">狀態</th>
            <th className="px-4 py-3 font-medium">時間</th>
            <th className="px-4 py-3 w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sandrift-100/30">
          {orders.map((order, i) => (
            <OrderRow
              key={order.id}
              order={order}
              index={i}
              expanded={expandedId === order.id}
              onToggle={() => setExpandedId(expandedId === order.id ? null : order.id)}
            />
          ))}
        </tbody>
      </table>

      {/* Mobile 卡片 */}
      <div className="divide-y divide-sandrift-100/30 sm:hidden">
        {orders.map((order, i) => (
          <div key={order.id}>
            <button
              onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              className="w-full cursor-pointer px-4 py-3 text-left hover:bg-sandrift-50/30 transition-colors animate-stagger-in"
              style={{ '--stagger-index': i } as React.CSSProperties}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-sandrift-900">{order.order_number}</span>
                <StatusBadge status={order.status} />
              </div>
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="text-sandrift-500">
                  {order.customer_name ?? '—'} · {order.item_count} 件
                </span>
                <span className="tabular-nums text-sandrift-900">NT${order.total_amount.toLocaleString()}</span>
              </div>
              <p className="mt-0.5 text-xs text-sandrift-300">
                {new Date(order.created_at).toLocaleDateString('zh-TW')}
              </p>
            </button>
            {expandedId === order.id && (
              <div className="border-t border-sandrift-100/30 animate-fade-in">
                <OrderDetailPanel orderId={order.id} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function OrderRow({
  order, index, expanded, onToggle,
}: {
  order: OrderListItem
  index: number
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <>
      <tr
        className="animate-stagger-in cursor-pointer hover:bg-sandrift-50/30 transition-colors"
        style={{ '--stagger-index': index } as React.CSSProperties}
        onClick={onToggle}
      >
        <td className="px-4 py-3 text-sm font-medium text-sandrift-900">{order.order_number}</td>
        <td className="px-4 py-3 text-sm text-sandrift-600">{order.customer_name ?? '—'}</td>
        <td className="px-4 py-3 text-sm text-sandrift-600">{order.item_count}</td>
        <td className="px-4 py-3 text-sm tabular-nums text-sandrift-900">NT${order.total_amount.toLocaleString()}</td>
        <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
        <td className="px-4 py-3 text-sm text-sandrift-400">{new Date(order.created_at).toLocaleDateString('zh-TW')}</td>
        <td className="px-4 py-3">
          <ChevronDown className={`h-4 w-4 text-sandrift-300 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={7} className="bg-sandrift-50/20 animate-fade-in">
            <OrderDetailPanel orderId={order.id} />
          </td>
        </tr>
      )}
    </>
  )
}
