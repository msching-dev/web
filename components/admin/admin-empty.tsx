import { type LucideIcon } from 'lucide-react'

interface AdminEmptyProps {
  icon: LucideIcon
  title: string
  description?: string
}

export default function AdminEmpty({ icon: Icon, title, description }: AdminEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sandrift-50/60">
        <Icon className="h-8 w-8 text-sandrift-300 animate-gentle-float" />
      </div>
      <h3 className="text-base font-semibold text-sandrift-500">{title}</h3>
      {description && <p className="mt-1 text-sm text-sandrift-300">{description}</p>}
    </div>
  )
}
