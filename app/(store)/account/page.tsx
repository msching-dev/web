'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'

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

  // 已登入 → 導回首頁
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
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider === 'line' ? 'line' as any : 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError('登入失敗，請稍後再試')
    }
  }

  // 登入中或已登入，不渲染表單
  if (authLoading || user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sandrift-300 border-t-sandrift-600" />
      </div>
    )
  }

  const inputClass =
    'w-full rounded-xl bg-white/60 backdrop-blur-sm h-10 px-4 text-[13px] text-sandrift-900 ring-1 ring-sandrift-200/30 placeholder:text-sandrift-300 focus:bg-white focus:ring-sandrift-300/50 focus:outline-none transition-all duration-200'

  return (
    <div className="animate-page-enter">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>首頁</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>會員帳戶</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mx-auto max-w-sm px-4 sm:px-6 py-10 md:py-14">
        {/* Glass Card */}
        <div className="glass rounded-3xl p-6 md:p-8 ring-1 ring-white/20">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold tracking-tight text-sandrift-950">
              歡迎回來
            </h1>
            <p className="mt-1 text-[13px] text-sandrift-400">
              登入或註冊以開始購物
            </p>
          </div>

          {/* Error / Message */}
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-[13px] text-red-600">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 rounded-xl bg-green-50 px-4 py-2.5 text-[13px] text-green-600">
              {message}
            </div>
          )}

          {/* Liquid Glass Tab */}
          <div className="glass-subtle mb-6 flex items-center rounded-2xl p-1 ring-1 ring-white/30">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setError(null); setMessage(null) }}
              className={`flex-1 cursor-pointer rounded-xl py-2 text-[13px] font-medium transition-all duration-300 ${
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
              className={`flex-1 cursor-pointer rounded-xl py-2 text-[13px] font-medium transition-all duration-300 ${
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
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label htmlFor="login-email" className="mb-1 block text-[13px] font-medium text-sandrift-600">
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
                <label htmlFor="login-password" className="mb-1 block text-[13px] font-medium text-sandrift-600">
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
                className="w-full cursor-pointer rounded-xl bg-sandrift-500 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-sandrift-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '登入中...' : '登入'}
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label htmlFor="register-email" className="mb-1 block text-[13px] font-medium text-sandrift-600">
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
                <label htmlFor="register-password" className="mb-1 block text-[13px] font-medium text-sandrift-600">
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
                <label htmlFor="register-confirm-password" className="mb-1 block text-[13px] font-medium text-sandrift-600">
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
                className="w-full cursor-pointer rounded-xl bg-sandrift-500 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-sandrift-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '註冊中...' : '註冊'}
              </button>
            </form>
          )}

          {/* Social Login */}
          <div className="mt-6">
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

            <div className="mt-4 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => handleOAuth('line')}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white/50 py-2.5 text-[13px] font-medium text-sandrift-700 ring-1 ring-sandrift-100/40 backdrop-blur-sm transition-all hover:bg-white/80"
              >
                <Image src="/images/line.png" alt="LINE" width={18} height={18} />
                使用 LINE 登入
              </button>
              <button
                type="button"
                onClick={() => handleOAuth('google')}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white/50 py-2.5 text-[13px] font-medium text-sandrift-700 ring-1 ring-sandrift-100/40 backdrop-blur-sm transition-all hover:bg-white/80"
              >
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24">
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
