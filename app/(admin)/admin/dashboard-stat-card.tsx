'use client'

import { Package, ClipboardList, DollarSign, Users } from 'lucide-react'
import { useCountUp } from '@/hooks/use-count-up'

const iconMap = {
  Package,
  ClipboardList,
  DollarSign,
  Users,
} as const

interface DashboardStatCardProps {
  label: string
  value: number
  iconKey: keyof typeof iconMap
  color: string
  prefix?: string
  index: number
}

export default function DashboardStatCard({ label, value, iconKey, color, prefix, index }: DashboardStatCardProps) {
  const animatedValue = useCountUp(value)
  const Icon = iconMap[iconKey]

  return (
    <div
      className="animate-stagger-in group rounded-2xl bg-white/60 p-4 ring-1 ring-sandrift-100/40 transition-all duration-200 hover:scale-[1.02] hover:shadow-sm hover:ring-sandrift-200/40"
      style={{ '--stagger-index': index } as React.CSSProperties}
    >
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${color} transition-transform duration-200 group-hover:scale-105`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xs text-sandrift-400">{label}</p>
      <p className="mt-0.5 text-xl font-bold tabular-nums text-sandrift-950">
        {prefix}{animatedValue.toLocaleString()}
      </p>
    </div>
  )
}
