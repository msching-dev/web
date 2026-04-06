'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

type Tab = 'login' | 'register'

export default function AccountPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()

  const [activeTab, setActiveTab] = useState<Tab>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message === 'Invalid login credentials' ? '信箱或密碼錯誤' : '登入失敗，請稍後再試')
      setLoading(false)
      return
    }
    router.push('/')
    router.refresh()
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirmPassword) { setError('密碼不一致'); return }
    if (password.length < 6) { setError('密碼至少需要 6 個字元'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      if (error.message?.includes('already') || error.message?.includes('registered')) {
        setError('此信箱已註冊，請嘗試其他方式登入')
      } else {
        setError('註冊失敗，請稍後再試')
      }
      setLoading(false)
      return
    }
    setMessage('註冊成功！請查收驗證信後登入')
    setActiveTab('login')
    setPassword('')
    setConfirmPassword('')
    setLoading(false)
  }

  const handleOAuth = async (provider: 'google' | 'line') => {
    setError(null)
    if (provider === 'line') { window.location.href = '/api/auth/line'; return }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) setError('登入失敗，請稍後再試')
  }

  if (authLoading || user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sandrift-300 border-t-sandrift-600" />
      </div>
    )
  }

  const inputClass =
    'w-full h-12 rounded-none border-0 border-b border-sandrift-200/50 bg-transparent px-0 text-sm text-sandrift-900 placeholder:text-sandrift-300 focus:border-sandrift-500 focus:outline-none focus:shadow-[0_1px_0_0_var(--color-sandrift-500)] transition-all duration-300'

  return (
    <div className="animate-page-enter relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      {/* ── 背景 ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sandrift-200/25 blur-[120px]" />
        <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-sandrift-100/20 blur-[90px]" />
        <div className="absolute -right-24 top-1/4 h-64 w-64 rounded-full bg-sandrift-50/30 blur-[70px]" />
      </div>

      {/* 浮水印 */}
      <div className="pointer-events-none absolute right-[8%] top-[10%] h-52 w-52 opacity-[0.025] md:h-72 md:w-72">
        <Image src="/images/watermark_4.png" alt="" fill sizes="288px" className="object-contain" />
      </div>
      <div className="pointer-events-none absolute bottom-[8%] left-[5%] h-40 w-40 rotate-12 opacity-[0.02] md:h-56 md:w-56">
        <Image src="/images/watermark_2.png" alt="" fill sizes="224px" className="object-contain" />
      </div>

      {/* ── 主卡片 — 漸變邊框 ── */}
      <div className="relative w-full max-w-[420px]">
        {/* 外圍光暈 */}
        <div className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-linear-to-br from-sandrift-300/15 via-transparent to-sandrift-200/10 blur-2xl" />

        {/* 漸變邊框容器 */}
        <div className="relative rounded-[1.75rem] bg-linear-to-br from-sandrift-300/20 via-sandrift-100/15 to-sandrift-200/10 p-px shadow-[0_8px_40px_rgba(176,141,98,0.08),0_1px_3px_rgba(0,0,0,0.03)]">
          {/* 卡片本體 */}
          <div className="relative overflow-hidden rounded-[calc(1.75rem-1px)] bg-white/75 backdrop-blur-2xl backdrop-saturate-150">
            {/* 頂部漸變裝飾帶 — 更細緻，與內容絲滑過渡 */}
            <div className="h-0.5 bg-linear-to-r from-sandrift-200/0 via-sandrift-400/50 to-sandrift-200/0" />

            {/* 卡片內幾何光影 */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-linear-to-br from-sandrift-100/30 to-transparent blur-2xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-linear-to-tr from-sandrift-50/40 to-transparent blur-2xl" />

            <div className="relative p-7 sm:p-9">
              {/* 標題 */}
              <div className="mb-8 text-center">
                <h1 className="text-[26px] font-bold tracking-tight text-sandrift-950 sm:text-[28px]">
                  {activeTab === 'login' ? '歡迎回來' : '加入我們'}
                </h1>
                <p className="mt-1.5 text-sm text-sandrift-400">
                  {activeTab === 'login'
                    ? '用甜點開啟美好的一天'
                    : '探索手作幸福滋味'}
                </p>
              </div>

              {/* Tab */}
              <div className="relative mb-7 flex">
                {/* 滑動指示器 */}
                <div
                  className="absolute bottom-0 h-0.5 w-1/2 bg-linear-to-r from-sandrift-400/0 via-sandrift-500 to-sandrift-400/0 transition-all duration-300 ease-out"
                  style={{ left: activeTab === 'login' ? '0%' : '50%' }}
                />
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setError(null); setMessage(null) }}
                  className={`flex-1 cursor-pointer pb-3 text-sm font-semibold transition-colors duration-200 ${
                    activeTab === 'login' ? 'text-sandrift-900' : 'text-sandrift-300 hover:text-sandrift-500'
                  }`}
                >
                  登入
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); setError(null); setMessage(null) }}
                  className={`flex-1 cursor-pointer pb-3 text-sm font-semibold transition-colors duration-200 ${
                    activeTab === 'register' ? 'text-sandrift-900' : 'text-sandrift-300 hover:text-sandrift-500'
                  }`}
                >
                  註冊
                </button>
                {/* 底線 — 頭尾漸變消失 */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-sandrift-200/50 to-transparent" />
              </div>

              {/* Error / Message */}
              {error && (
                <div className="mb-5 rounded-xl bg-red-50/80 px-4 py-3 text-[13px] text-red-600">
                  {error}
                </div>
              )}
              {message && (
                <div className="mb-5 rounded-xl bg-green-50/80 px-4 py-3 text-[13px] text-green-600">
                  {message}
                </div>
              )}

              {/* Social Login */}
              <div className="mb-7 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => handleOAuth('line')}
                  className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#06C755] py-3 text-[13px] font-semibold text-white shadow-[0_2px_8px_rgba(6,199,85,0.18)] transition-all duration-200 hover:shadow-[0_4px_16px_rgba(6,199,85,0.25)] hover:-translate-y-px active:translate-y-0"
                >
                  <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="white">
                    <path d="M24 10.304C24 4.916 18.615.535 12 .535S0 4.916 0 10.304c0 4.83 4.27 8.879 10.035 9.642.391.084.923.26 1.058.594.12.302.079.77.038 1.084l-.164 1.026c-.045.303-.24 1.192 1.049.649 1.291-.542 6.916-4.098 9.436-7.013C23.176 14.382 24 12.442 24 10.304M8.776 13.194H6.42a.532.532 0 01-.532-.532V8.106a.532.532 0 01.532-.532.532.532 0 01.532.532v4.024h1.824a.532.532 0 01.532.532.532.532 0 01-.532.532m1.63-.532a.532.532 0 01-.532.532.532.532 0 01-.532-.532V8.106a.532.532 0 01.532-.532.532.532 0 01.532.532v4.556zm4.674 0c0 .228-.148.43-.365.502a.523.523 0 01-.167.03.527.527 0 01-.43-.216l-2.064-2.81v2.494a.532.532 0 01-.532.532.532.532 0 01-.532-.532V8.106c0-.228.148-.43.365-.502a.521.521 0 01.167-.03c.17 0 .33.09.43.216l2.064 2.81V8.106a.532.532 0 01.532-.532.532.532 0 01.532.532v4.556zm3.695-3.092a.532.532 0 01.532.532.532.532 0 01-.532.532h-1.48v.952h1.48a.532.532 0 01.532.532.532.532 0 01-.532.532h-2.012a.532.532 0 01-.532-.532V8.106a.532.532 0 01.532-.532h2.012a.532.532 0 01.532.532.532.532 0 01-.532.532h-1.48v.932h1.48z" />
                  </svg>
                  LINE
                </button>
                <button
                  type="button"
                  onClick={() => handleOAuth('google')}
                  className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-white/80 py-3 text-[13px] font-semibold text-sandrift-700 shadow-[0_1px_4px_rgba(0,0,0,0.05)] ring-1 ring-sandrift-100/40 transition-all duration-200 hover:bg-white hover:shadow-[0_2px_10px_rgba(0,0,0,0.07)] hover:-translate-y-px active:translate-y-0"
                >
                  <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </button>
              </div>

              {/* 漸變分隔線 */}
              <div className="relative mb-7">
                <div className="h-px bg-linear-to-r from-transparent via-sandrift-200/50 to-transparent" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-white/75 px-3 text-[11px] tracking-wider text-sandrift-300 uppercase">
                    or
                  </span>
                </div>
              </div>

              {/* Login Form — grid 高度過渡 */}
              <div className="grid transition-[grid-template-rows] duration-400 ease-out" style={{ gridTemplateRows: activeTab === 'login' ? '1fr' : '0fr' }}>
                <div className="overflow-hidden">
                  <form onSubmit={handleLogin} className={`space-y-6 pb-1 transition-opacity duration-300 ${activeTab === 'login' ? 'opacity-100' : 'opacity-0'}`}>
                    <div>
                      <label htmlFor="login-email" className="mb-1 block text-[11px] font-semibold tracking-wider text-sandrift-400 uppercase">
                        電子信箱
                      </label>
                      <input id="login-email" type="email" required value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="login-password" className="mb-1 block text-[11px] font-semibold tracking-wider text-sandrift-400 uppercase">
                        密碼
                      </label>
                      <input id="login-password" type="password" required value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="請輸入密碼" className={inputClass} />
                    </div>
                    <button type="submit" disabled={loading}
                      className="group relative mt-2 w-full cursor-pointer overflow-hidden rounded-xl bg-linear-to-r from-sandrift-500 to-sandrift-600 py-3.5 text-sm font-bold text-white transition-all hover:from-sandrift-600 hover:to-sandrift-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="relative z-10">{loading ? '登入中...' : '登入'}</span>
                      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </button>
                  </form>
                </div>
              </div>

              {/* Register Form — grid 高度過渡 */}
              <div className="grid transition-[grid-template-rows] duration-400 ease-out" style={{ gridTemplateRows: activeTab === 'register' ? '1fr' : '0fr' }}>
                <div className="overflow-hidden">
                  <form onSubmit={handleRegister} className={`space-y-5 pb-1 transition-opacity duration-300 ${activeTab === 'register' ? 'opacity-100' : 'opacity-0'}`}>
                    <div>
                      <label htmlFor="register-email" className="mb-1 block text-[11px] font-semibold tracking-wider text-sandrift-400 uppercase">
                        電子信箱
                      </label>
                      <input id="register-email" type="email" required value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="register-password" className="mb-1 block text-[11px] font-semibold tracking-wider text-sandrift-400 uppercase">
                        密碼
                      </label>
                      <input id="register-password" type="password" required minLength={6} value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="至少 6 個字元" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="register-confirm-password" className="mb-1 block text-[11px] font-semibold tracking-wider text-sandrift-400 uppercase">
                        確認密碼
                      </label>
                      <input id="register-confirm-password" type="password" required value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="請再次輸入密碼" className={inputClass} />
                    </div>
                    <button type="submit" disabled={loading}
                      className="group relative mt-1 w-full cursor-pointer overflow-hidden rounded-xl bg-linear-to-r from-sandrift-500 to-sandrift-600 py-3.5 text-sm font-bold text-white transition-all hover:from-sandrift-600 hover:to-sandrift-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="relative z-10">{loading ? '註冊中...' : '建立帳號'}</span>
                      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
