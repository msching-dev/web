'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import PageHero from '@/components/layout/page-hero'

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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? '信箱或密碼錯誤'
        : '登入失敗，請稍後再試')
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('密碼不一致')
      return
    }
    if (password.length < 6) {
      setError('密碼至少需要 6 個字元')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError('註冊失敗，請稍後再試')
      setLoading(false)
      return
    }

    setMessage('註冊成功！您可以直接登入')
    setActiveTab('login')
    setPassword('')
    setConfirmPassword('')
    setLoading(false)
  }

  const handleOAuth = async (provider: 'google' | 'line') => {
    setError(null)

    if (provider === 'line') {
      window.location.href = '/api/auth/line'
      return
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError('登入失敗，請稍後再試')
    }
  }

  if (authLoading || user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sandrift-300 border-t-sandrift-600" />
      </div>
    )
  }

  const inputClass =
    'w-full rounded-xl bg-white/60 backdrop-blur-sm h-11 px-4 text-sm text-sandrift-900 ring-1 ring-sandrift-200/40 placeholder:text-sandrift-300 focus:bg-white focus:ring-2 focus:ring-sandrift-400/30 focus:shadow-[0_0_0_4px_rgba(176,141,98,0.08)] focus:outline-none transition-all duration-200'

  return (
    <div className="animate-page-enter">
      <PageHero
        breadcrumbs={[
          { label: '首頁', href: '/' },
          { label: '會員帳戶' },
        ]}
        title="歡迎回來"
        subtitle="登入或註冊以開始購物"
        watermark={4}
      />

      <div className="mx-auto max-w-sm px-4 sm:px-6 pb-12">
        {/* Glass Card */}
        <div className="relative overflow-hidden glass rounded-3xl p-7 md:p-8 ring-1 ring-sandrift-100/20">
          {/* 裝飾光暈 */}
          <div className="pointer-events-none absolute -left-16 -top-16 h-32 w-32 rounded-full bg-sandrift-300/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-12 -bottom-12 h-28 w-28 rounded-full bg-sandrift-200/15 blur-2xl" />

          {/* Error / Message */}
          {error && (
            <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-600 ring-1 ring-red-100/50">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-[13px] text-green-600 ring-1 ring-green-100/50">
              {message}
            </div>
          )}

          {/* Liquid Glass Tab */}
          <div className="glass-subtle mb-6 flex items-center rounded-2xl p-1 ring-1 ring-white/30">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setError(null); setMessage(null) }}
              className={`flex-1 cursor-pointer rounded-xl py-2.5 text-[13px] font-medium transition-all duration-300 ${
                activeTab === 'login'
                  ? 'bg-white/80 text-sandrift-900 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
                  : 'text-sandrift-400 hover:text-sandrift-700'
              }`}
            >
              登入
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setError(null); setMessage(null) }}
              className={`flex-1 cursor-pointer rounded-xl py-2.5 text-[13px] font-medium transition-all duration-300 ${
                activeTab === 'register'
                  ? 'bg-white/80 text-sandrift-900 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
                  : 'text-sandrift-400 hover:text-sandrift-700'
              }`}
            >
              註冊
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-[13px] font-medium text-sandrift-600">
                  電子信箱
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="請輸入電子信箱"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="login-password" className="mb-1.5 block text-[13px] font-medium text-sandrift-600">
                  密碼
                </label>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="請輸入密碼"
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer rounded-xl bg-sandrift-500 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-sandrift-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '登入中...' : '登入'}
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="register-email" className="mb-1.5 block text-[13px] font-medium text-sandrift-600">
                  電子信箱
                </label>
                <input
                  id="register-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="請輸入電子信箱"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="register-password" className="mb-1.5 block text-[13px] font-medium text-sandrift-600">
                  密碼
                </label>
                <input
                  id="register-password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="請輸入密碼（至少 6 個字元）"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="register-confirm-password" className="mb-1.5 block text-[13px] font-medium text-sandrift-600">
                  確認密碼
                </label>
                <input
                  id="register-confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="請再次輸入密碼"
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer rounded-xl bg-sandrift-500 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-sandrift-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '註冊中...' : '註冊'}
              </button>
            </form>
          )}

          {/* Social Login */}
          <div className="mt-7">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-sandrift-100/50" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white/70 px-3 text-[11px] text-sandrift-300">
                  或使用以下方式登入
                </span>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => handleOAuth('line')}
                className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-[#06C755] py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#05b64e] active:scale-[0.98]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white">
                  <path d="M24 10.304C24 4.916 18.615.535 12 .535S0 4.916 0 10.304c0 4.83 4.27 8.879 10.035 9.642.391.084.923.26 1.058.594.12.302.079.77.038 1.084l-.164 1.026c-.045.303-.24 1.192 1.049.649 1.291-.542 6.916-4.098 9.436-7.013C23.176 14.382 24 12.442 24 10.304M8.776 13.194H6.42a.532.532 0 01-.532-.532V8.106a.532.532 0 01.532-.532.532.532 0 01.532.532v4.024h1.824a.532.532 0 01.532.532.532.532 0 01-.532.532m1.63-.532a.532.532 0 01-.532.532.532.532 0 01-.532-.532V8.106a.532.532 0 01.532-.532.532.532 0 01.532.532v4.556zm4.674 0c0 .228-.148.43-.365.502a.523.523 0 01-.167.03.527.527 0 01-.43-.216l-2.064-2.81v2.494a.532.532 0 01-.532.532.532.532 0 01-.532-.532V8.106c0-.228.148-.43.365-.502a.521.521 0 01.167-.03c.17 0 .33.09.43.216l2.064 2.81V8.106a.532.532 0 01.532-.532.532.532 0 01.532.532v4.556zm3.695-3.092a.532.532 0 01.532.532.532.532 0 01-.532.532h-1.48v.952h1.48a.532.532 0 01.532.532.532.532 0 01-.532.532h-2.012a.532.532 0 01-.532-.532V8.106a.532.532 0 01.532-.532h2.012a.532.532 0 01.532.532.532.532 0 01-.532.532h-1.48v.932h1.48z" />
                </svg>
                使用 LINE 登入
              </button>
              <button
                type="button"
                onClick={() => handleOAuth('google')}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white/60 py-3 text-sm font-medium text-sandrift-700 ring-1 ring-sandrift-100/50 backdrop-blur-sm transition-all hover:bg-white/90 hover:ring-sandrift-200/50 active:scale-[0.98]"
              >
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                使用 Google 登入
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
