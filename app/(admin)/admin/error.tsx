'use client'

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-gray-800">後台發生錯誤</h1>
      <p className="mt-2 text-sm text-gray-400">請稍後再試，或聯繫系統管理員</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 cursor-pointer rounded-xl bg-gray-800 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
      >
        重新載入
      </button>
    </div>
  )
}
