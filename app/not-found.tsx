import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-sandrift-200">404</h1>
      <p className="mt-4 text-lg font-medium text-sandrift-700">找不到此頁面</p>
      <p className="mt-2 text-sm text-sandrift-400">您要找的頁面不存在或已被移除</p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-sandrift-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sandrift-600"
      >
        返回首頁
      </Link>
    </div>
  )
}
