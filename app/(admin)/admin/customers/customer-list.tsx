'use client'

import { useState, useTransition } from 'react'
import { ChevronDown } from 'lucide-react'
import type { CustomerListItem } from '@/types'
import { updateCustomerNote } from './actions'

export default function CustomerList({ customers }: { customers: CustomerListItem[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="rounded-2xl bg-white/60 ring-1 ring-sandrift-100/40 overflow-hidden">
      {/* Desktop */}
      <table className="hidden w-full sm:table">
        <thead>
          <tr className="border-b border-sandrift-100/40 text-left text-xs text-sandrift-400">
            <th className="px-4 py-3 font-medium">姓名</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">電話</th>
            <th className="px-4 py-3 font-medium">訂單</th>
            <th className="px-4 py-3 font-medium">累計消費</th>
            <th className="px-4 py-3 font-medium">註冊時間</th>
            <th className="px-4 py-3 w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sandrift-100/30">
          {customers.map((customer, i) => (
            <CustomerRow
              key={customer.id}
              customer={customer}
              index={i}
              expanded={expandedId === customer.id}
              onToggle={() => setExpandedId(expandedId === customer.id ? null : customer.id)}
            />
          ))}
        </tbody>
      </table>

      {/* Mobile */}
      <div className="divide-y divide-sandrift-100/30 sm:hidden">
        {customers.map((customer, i) => (
          <div key={customer.id}>
            <button
              onClick={() => setExpandedId(expandedId === customer.id ? null : customer.id)}
              className="w-full cursor-pointer px-4 py-3 text-left hover:bg-sandrift-50/30 transition-colors animate-stagger-in"
              style={{ '--stagger-index': i } as React.CSSProperties}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-sandrift-900">{customer.name ?? '未設定'}</span>
                <span className="text-xs text-sandrift-400">{customer.order_count} 筆訂單</span>
              </div>
              <p className="mt-0.5 text-xs text-sandrift-400">{customer.email ?? '—'}</p>
            </button>
            {expandedId === customer.id && (
              <div className="border-t border-sandrift-100/30 px-4 py-3 animate-fade-in">
                <CustomerDetail customerId={customer.id} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function CustomerRow({
  customer, index, expanded, onToggle,
}: {
  customer: CustomerListItem
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
        <td className="px-4 py-3 text-sm font-medium text-sandrift-900">{customer.name ?? '未設定'}</td>
        <td className="px-4 py-3 text-sm text-sandrift-600">{customer.email ?? '—'}</td>
        <td className="px-4 py-3 text-sm text-sandrift-600">{customer.phone ?? '—'}</td>
        <td className="px-4 py-3 text-sm text-sandrift-600">{customer.order_count}</td>
        <td className="px-4 py-3 text-sm tabular-nums text-sandrift-900">
          {customer.total_spent > 0 ? `NT$${customer.total_spent.toLocaleString()}` : '—'}
        </td>
        <td className="px-4 py-3 text-sm text-sandrift-400">{new Date(customer.created_at).toLocaleDateString('zh-TW')}</td>
        <td className="px-4 py-3">
          <ChevronDown className={`h-4 w-4 text-sandrift-300 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={7} className="bg-sandrift-50/20 animate-fade-in">
            <CustomerDetail customerId={customer.id} />
          </td>
        </tr>
      )}
    </>
  )
}

function CustomerDetail({ customerId }: { customerId: string }) {
  const [note, setNote] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  if (!loaded) {
    fetch(`/api/admin/customers/${customerId}`)
      .then(r => r.json())
      .then(data => {
        setDetail(data)
        setNote(data.note ?? '')
        setLoaded(true)
      })
    return (
      <div className="flex items-center justify-center py-6">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-sandrift-300 border-t-sandrift-600" />
      </div>
    )
  }

  const handleSaveNote = () => {
    startTransition(async () => {
      const result = await updateCustomerNote(customerId, note)
      if (result.error) { setMessage(`錯誤：${result.error}`); return }
      setMessage('備註已儲存')
      setTimeout(() => setMessage(null), 2000)
    })
  }

  return (
    <div className="space-y-3 p-4 sm:p-6">
      {message && (
        <div className="rounded-lg bg-sandrift-50 px-3 py-2 text-xs text-sandrift-600 animate-fade-in">{message}</div>
      )}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div><span className="text-sandrift-400">地址：</span><span className="text-sandrift-900">{(detail?.default_address as string) ?? '未設定'}</span></div>
        <div><span className="text-sandrift-400">偏好物流：</span><span className="text-sandrift-900">{(detail?.default_shipping_method as string) ?? '—'}</span></div>
      </div>
      <div>
        <label className="mb-1 block text-xs text-sandrift-400">管理員備註</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="內部備註"
            className="flex-1 rounded-xl bg-white/60 h-10 px-3 text-sm text-sandrift-900 ring-1 ring-sandrift-200/30 placeholder:text-sandrift-300 focus:bg-white focus:ring-sandrift-300/50 focus:outline-none transition-all duration-200"
          />
          <button
            onClick={handleSaveNote}
            disabled={isPending}
            className="cursor-pointer rounded-xl bg-white/60 px-5 py-2.5 text-sm font-medium text-sandrift-700 ring-1 ring-sandrift-200/30 transition-all duration-200 hover:bg-sandrift-50 disabled:opacity-50"
          >
            儲存
          </button>
        </div>
      </div>
    </div>
  )
}
