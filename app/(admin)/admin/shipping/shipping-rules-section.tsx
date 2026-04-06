'use client'

import { useState, useTransition } from 'react'
import { Plus, Trash2, Truck } from 'lucide-react'
import type { ShippingRule } from '@/types'
import StatusBadge from '@/components/admin/status-badge'
import AdminEmpty from '@/components/admin/admin-empty'
import { createShippingRule, updateShippingRule, deleteShippingRule } from './actions'

const ruleTypeLabels: Record<string, string> = {
  free: '免運',
  discount: '運費折扣',
  fixed: '固定運費',
}

const emptyRule = {
  name: '',
  rule_type: 'free' as 'free' | 'discount' | 'fixed',
  min_amount: null as number | null,
  discount_value: 0,
  shipping_methods: [] as string[],
  is_active: true,
  priority: 0,
  started_at: null as string | null,
  ended_at: null as string | null,
}

export default function ShippingRulesSection({ rules: initialRules }: { rules: ShippingRule[] }) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyRule)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = () => {
    if (!form.name.trim()) { setMessage('請輸入規則名稱'); return }
    startTransition(async () => {
      const result = editingId
        ? await updateShippingRule(editingId, form)
        : await createShippingRule(form)
      if (result.error) { setMessage(`錯誤：${result.error}`); return }
      setMessage(editingId ? '規則已更新' : '規則已新增')
      setShowForm(false)
      setEditingId(null)
      setForm(emptyRule)
      setTimeout(() => setMessage(null), 2000)
    })
  }

  const handleEdit = (rule: ShippingRule) => {
    setForm({
      name: rule.name,
      rule_type: rule.rule_type,
      min_amount: rule.min_amount,
      discount_value: rule.discount_value,
      shipping_methods: rule.shipping_methods,
      is_active: rule.is_active,
      priority: rule.priority,
      started_at: rule.started_at,
      ended_at: rule.ended_at,
    })
    setEditingId(rule.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (!confirm('確定要刪除此規則嗎？')) return
    startTransition(async () => {
      const result = await deleteShippingRule(id)
      if (result.error) { setMessage(`錯誤：${result.error}`); return }
      setMessage('規則已刪除')
      setTimeout(() => setMessage(null), 2000)
    })
  }

  const handleToggleActive = (rule: ShippingRule) => {
    startTransition(async () => {
      await updateShippingRule(rule.id, { is_active: !rule.is_active })
    })
  }

  const inputClass = 'w-full rounded-xl bg-white/60 h-10 px-3 text-sm text-sandrift-900 ring-1 ring-sandrift-200/30 placeholder:text-sandrift-300 focus:bg-white focus:ring-sandrift-300/50 focus:outline-none transition-all duration-200'

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-sandrift-950">運費減免規則</h2>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyRule) }}
          className="cursor-pointer flex items-center gap-1 rounded-xl bg-sandrift-500 px-3 py-1.5 text-sm font-medium text-white transition-all duration-200 hover:bg-sandrift-600"
        >
          <Plus className="h-4 w-4" />
          新增規則
        </button>
      </div>

      {message && (
        <div className="mb-3 rounded-lg bg-sandrift-50 px-3 py-2 text-xs text-sandrift-600 animate-fade-in">{message}</div>
      )}

      {/* 表單 */}
      {showForm && (
        <div className="mb-4 rounded-2xl bg-white/60 p-4 ring-1 ring-sandrift-100/40 animate-fade-in">
          <h3 className="mb-3 text-sm font-semibold text-sandrift-900">{editingId ? '編輯規則' : '新增規則'}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-sandrift-400">規則名稱</label>
              <input type="text" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="如：滿 500 免運" className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-sandrift-400">類型</label>
              <select value={form.rule_type} onChange={(e) => setForm(f => ({ ...f, rule_type: e.target.value as 'free' | 'discount' | 'fixed' }))} className={inputClass}>
                <option value="free">免運</option>
                <option value="discount">運費折扣</option>
                <option value="fixed">固定運費</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-sandrift-400">滿額門檻（留空=不限）</label>
              <input type="number" value={form.min_amount ?? ''} onChange={(e) => setForm(f => ({ ...f, min_amount: e.target.value ? Number(e.target.value) : null }))} placeholder="500" className={inputClass} />
            </div>
            {form.rule_type !== 'free' && (
              <div>
                <label className="mb-1 block text-xs text-sandrift-400">{form.rule_type === 'discount' ? '折扣金額' : '固定金額'}</label>
                <input type="number" value={form.discount_value} onChange={(e) => setForm(f => ({ ...f, discount_value: Number(e.target.value) }))} className={inputClass} />
              </div>
            )}
            <div>
              <label className="mb-1 block text-xs text-sandrift-400">優先級（數字大優先）</label>
              <input type="number" value={form.priority} onChange={(e) => setForm(f => ({ ...f, priority: Number(e.target.value) }))} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-sandrift-400">活動開始（可選）</label>
              <input type="date" value={form.started_at ?? ''} onChange={(e) => setForm(f => ({ ...f, started_at: e.target.value || null }))} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-sandrift-400">活動結束（可選）</label>
              <input type="date" value={form.ended_at ?? ''} onChange={(e) => setForm(f => ({ ...f, ended_at: e.target.value || null }))} className={inputClass} />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={handleSubmit} disabled={isPending} className="cursor-pointer rounded-xl bg-sandrift-500 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-sandrift-600 disabled:opacity-50">
              {editingId ? '更新' : '新增'}
            </button>
            <button onClick={() => { setShowForm(false); setEditingId(null) }} className="cursor-pointer rounded-xl bg-white/60 px-5 py-2.5 text-sm font-medium text-sandrift-700 ring-1 ring-sandrift-200/30 transition-all duration-200 hover:bg-sandrift-50 disabled:opacity-50">
              取消
            </button>
          </div>
        </div>
      )}

      {/* 規則列表 */}
      {initialRules.length === 0 && !showForm ? (
        <AdminEmpty icon={Truck} title="尚無減免規則" description="新增規則後，符合條件的訂單會自動套用" />
      ) : (
        <div className="space-y-2">
          {initialRules.map((rule, i) => (
            <div
              key={rule.id}
              className={`animate-stagger-in flex items-center justify-between rounded-xl bg-white/60 px-4 py-3 ring-1 ring-sandrift-100/40 transition-all duration-200 hover:ring-sandrift-200/40 ${
                !rule.is_active ? 'opacity-50' : ''
              }`}
              style={{ '--stagger-index': i } as React.CSSProperties}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-sandrift-900">{rule.name}</span>
                  <StatusBadge status={rule.is_active ? 'active' : 'inactive'} />
                </div>
                <p className="mt-0.5 text-xs text-sandrift-400">
                  {ruleTypeLabels[rule.rule_type]}
                  {rule.min_amount ? ` · 滿 NT$${rule.min_amount}` : ''}
                  {rule.started_at || rule.ended_at ? ` · ${rule.started_at ?? ''} – ${rule.ended_at ?? ''}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleToggleActive(rule)}
                  className={`cursor-pointer rounded-lg px-2 py-1 text-xs transition-all ${
                    rule.is_active ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  {rule.is_active ? '停用' : '啟用'}
                </button>
                <button onClick={() => handleEdit(rule)} className="cursor-pointer rounded-lg px-2 py-1 text-xs text-sandrift-500 hover:bg-sandrift-50 transition-all">
                  編輯
                </button>
                <button onClick={() => handleDelete(rule.id)} disabled={isPending} className="cursor-pointer rounded-lg p-1 text-red-400 hover:bg-red-50 transition-all disabled:opacity-50">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
