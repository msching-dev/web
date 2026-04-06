import { type ReactNode } from 'react'

interface AdminPageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export default function AdminPageHeader({ title, subtitle, action }: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-sandrift-950">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-sandrift-400">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
