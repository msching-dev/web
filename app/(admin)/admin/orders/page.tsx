import { ClipboardList } from 'lucide-react'

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">訂單管理</h1>
      <p className="mt-1 text-sm text-gray-500">
        接上 Supabase + 金流後啟用
      </p>

      <div className="mt-12 flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-20">
        <ClipboardList className="h-16 w-16 text-gray-300" />
        <p className="mt-4 text-lg font-medium text-gray-500">
          尚未有訂單資料
        </p>
        <p className="mt-1 text-sm text-gray-400">
          串接 Supabase 資料庫與金流服務後，訂單將顯示於此頁面
        </p>
      </div>
    </div>
  )
}
