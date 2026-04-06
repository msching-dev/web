'use client'

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-xl font-bold text-sandrift-950">後台發生錯誤</h1>
      <p className="mt-2 text-sm text-sandrift-400">請稍後再試，或聯繫系統管理員</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 cursor-pointer rounded-xl bg-sandrift-500 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-sandrift-600"
      >
        重新載入
      </button>
    </div>
  )
}
