const statusConfig: Record<string, { label: string; className: string }> = {
  // 訂單狀態
  pending_payment: { label: '待付款', className: 'bg-amber-50 text-amber-600 ring-amber-200/50' },
  paid: { label: '已付款', className: 'bg-blue-50 text-blue-600 ring-blue-200/50' },
  preparing: { label: '製作中', className: 'bg-purple-50 text-purple-600 ring-purple-200/50' },
  shipped: { label: '已寄出', className: 'bg-indigo-50 text-indigo-600 ring-indigo-200/50' },
  completed: { label: '已完成', className: 'bg-green-50 text-green-600 ring-green-200/50' },
  cancelled: { label: '已取消', className: 'bg-red-50 text-red-600 ring-red-200/50' },
  // 商品狀態
  active: { label: '上架', className: 'bg-green-50 text-green-700 ring-green-200/50' },
  inactive: { label: '已下架', className: 'bg-gray-100 text-gray-500 ring-gray-200/50' },
  // 檔期
  upcoming: { label: '即將開始', className: 'bg-amber-50 text-amber-600 ring-amber-200/50' },
  ongoing: { label: '進行中', className: 'bg-green-50 text-green-600 ring-green-200/50' },
  ended: { label: '已結束', className: 'bg-gray-100 text-gray-500 ring-gray-200/50' },
}

export default function StatusBadge({ status, label }: { status: string; label?: string }) {
  const config = statusConfig[status] ?? { label: status, className: 'bg-gray-100 text-gray-500' }
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset transition-colors duration-200 ${config.className}`}>
      {label ?? config.label}
    </span>
  )
}
