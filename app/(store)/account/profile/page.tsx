'use client'

import { Suspense, useState, useEffect, useCallback, useTransition, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth, refreshAuthUser } from '@/hooks/use-auth'
import { getCustomerProfile, updateProfile, setPassword, updateAvatar, unlinkLine } from './actions'
import PageHero from '@/components/layout/page-hero'

/** 純數字 → 0912-345-678 顯示格式 */
function formatPhone(digits: string): string {
  const d = digits.replace(/\D/g, '').slice(0, 10)
  if (d.length <= 4) return d
  if (d.length <= 7) return `${d.slice(0, 4)}-${d.slice(4)}`
  return `${d.slice(0, 4)}-${d.slice(4, 7)}-${d.slice(7)}`
}

/** 移除格式化符號，取得純數字 */
function stripPhone(formatted: string): string {
  return formatted.replace(/\D/g, '')
}

/** 驗證台灣手機號（09 開頭 10 碼） */
function isValidPhone(digits: string): boolean {
  return /^09\d{8}$/.test(digits)
}

const avatarOptions = [
  { value: '/images/avatar/cake.png', label: '蛋糕' },
  { value: '/images/avatar/cupcake.png', label: '杯子蛋糕' },
  { value: '/images/avatar/donut.png', label: '甜甜圈' },
  { value: '/images/avatar/toast.png', label: '吐司' },
  { value: 'letter', label: '字母' },
]

/** 根據 email 穩定選一個預設 avatar */
function getDefaultAvatar(email: string) {
  let hash = 0
  for (let i = 0; i < email.length; i++) {
    hash = ((hash << 5) - hash + email.charCodeAt(i)) | 0
  }
  const images = avatarOptions.filter((o) => o.value !== 'letter')
  return images[Math.abs(hash) % images.length].value
}

const inputClass =
  'w-full rounded-xl bg-white/60 backdrop-blur-sm h-10 px-4 text-[13px] text-sandrift-900 ring-1 ring-sandrift-200/30 placeholder:text-sandrift-300 focus:bg-white focus:ring-sandrift-300/50 focus:outline-none transition-all duration-200'

const labelClass = 'mb-1 block text-[13px] font-medium text-sandrift-600'

const btnClass =
  'cursor-pointer rounded-xl px-4 py-2 text-[13px] font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

function BtnSpinner() {
  return <span className="mr-1.5 inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white align-middle" />
}

interface ProfileData {
  user: {
    id: string
    email: string | undefined
    identities: Array<{ provider: string; id: string }>
    user_metadata: Record<string, string>
  }
  customer: {
    name: string
    phone: string
    default_address: string | null
  } | null
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sandrift-300 border-t-sandrift-600" />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  )
}

function ProfileContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [, startTransition] = useTransition()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 表單
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  // 電話
  const [phoneError, setPhoneError] = useState<string | null>(null)

  // 密碼
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)

  // Avatar
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const [avatarSaving, setAvatarSaving] = useState(false)
  const avatarSectionRef = useRef<HTMLDivElement>(null)

  // 點擊外部關閉 avatar picker
  useEffect(() => {
    if (!showAvatarPicker) return
    const handleClick = (e: MouseEvent) => {
      if (avatarSectionRef.current && !avatarSectionRef.current.contains(e.target as Node)) {
        setShowAvatarPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showAvatarPicker])

  // 未登入 → 導回登入頁
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/account')
    }
  }, [user, authLoading, router])

  const loadProfile = useCallback(async () => {
    const result = await getCustomerProfile()
    if ('error' in result) return

    const data = result as ProfileData
    setProfile(data)
    setName(data.customer?.name || '')
    setPhone(formatPhone(data.customer?.phone || ''))
    setAddress(data.customer?.default_address || '')
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!user) return
    startTransition(() => { loadProfile() })
  }, [user, loadProfile])

  // LINE 綁定成功提示
  const lineLinked = searchParams.get('line_linked') === 'true'
  useEffect(() => {
    if (lineLinked) {
      window.history.replaceState({}, '', '/account/profile')
    }
  }, [lineLinked])

  // 成功訊息自動消失
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => setMessage(null), 3000)
    return () => clearTimeout(timer)
  }, [message])

  const handlePhoneChange = (value: string) => {
    const digits = stripPhone(value)
    setPhone(formatPhone(digits))
    setPhoneError(null)
  }

  const handlePhoneBlur = () => {
    const digits = stripPhone(phone)
    if (digits && !isValidPhone(digits)) {
      setPhoneError('請輸入有效的手機號碼（09 開頭，共 10 碼）')
    }
  }

  const handleSaveProfile = async () => {
    setError(null)
    setMessage(null)
    setPhoneError(null)

    const digits = stripPhone(phone)
    if (digits && !isValidPhone(digits)) {
      setPhoneError('請輸入有效的手機號碼（09 開頭，共 10 碼）')
      return
    }

    setSaving(true)
    const result = await updateProfile({ name, phone: digits, default_address: address })
    if (result.error) {
      setError(result.error)
    } else {
      // Optimistic update — 頁面上的姓名即時反映
      setProfile((prev) => prev ? {
        ...prev,
        customer: prev.customer
          ? { ...prev.customer, name, phone: digits, default_address: address }
          : { name, phone: digits, default_address: address },
      } : prev)
      // 同步 Zustand auth store → Header 姓名即時更新
      await refreshAuthUser()
      setMessage('個人資料已更新')
    }
    setSaving(false)
  }

  const handleSetPassword = async () => {
    setError(null)
    setMessage(null)

    if (newPassword.length < 6) {
      setError('密碼至少需要 6 個字元')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('密碼不一致')
      return
    }

    setPasswordSaving(true)
    const result = await setPassword(newPassword)
    if (result.error) {
      setError(result.error)
    } else {
      setMessage('密碼已設定')
      setNewPassword('')
      setConfirmPassword('')
      await loadProfile()
    }
    setPasswordSaving(false)
  }

  const handleAvatarChange = async (avatar: string) => {
    // Optimistic update — 立即反映在 profile 頁面
    setProfile((prev) => prev ? {
      ...prev,
      user: { ...prev.user, user_metadata: { ...prev.user.user_metadata, preferred_avatar: avatar } },
    } : prev)
    setAvatarSaving(true)

    const result = await updateAvatar(avatar)
    if (!result.error) {
      // 同步 Zustand auth store → Header avatar 即時更新
      await refreshAuthUser()
      setShowAvatarPicker(false)
    } else {
      // 回退
      await loadProfile()
    }
    setAvatarSaving(false)
  }

  const handleLinkGoogle = async () => {
    setError(null)
    const { error } = await supabase.auth.linkIdentity({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/account/profile` },
    })
    if (error) setError('Google 綁定失敗，請稍後再試')
  }

  const handleLinkLine = () => {
    window.location.href = '/api/auth/line?link=true'
  }

  const handleUnlinkLine = async () => {
    setError(null)
    setMessage(null)
    const result = await unlinkLine()
    if (result.error) {
      setError(result.error)
    } else {
      setMessage('LINE 帳號已解除綁定')
      await loadProfile()
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  // 載入中 or 登出後等待跳轉
  if (authLoading || !user || loading || !profile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sandrift-300 border-t-sandrift-600" />
      </div>
    )
  }

  const hasPassword = profile.user.identities.some((i) => i.provider === 'email')
  const hasGoogle = profile.user.identities.some((i) => i.provider === 'google')
  const hasLine = !!profile.user.user_metadata?.line_user_id

  const currentAvatar = profile.user.user_metadata?.preferred_avatar || getDefaultAvatar(profile.user.email || '')
  const isLetter = currentAvatar === 'letter'
  const initial = (profile.user.email || '?')[0].toUpperCase()

  return (
    <div className="animate-page-enter">
      <PageHero
        breadcrumbs={[
          { label: '首頁', href: '/' },
          { label: '個人資訊' },
        ]}
        title="個人資訊"
        watermark={4}
      />

      <div className="mx-auto max-w-xl px-4 sm:px-6 py-8 md:py-12 space-y-5">
        {/* 訊息 */}
        {error && (
          <div className="animate-fade-in rounded-xl bg-red-50 px-4 py-2.5 text-[13px] text-red-600">
            {error}
          </div>
        )}
        {(message || lineLinked) && (
          <div className="animate-fade-in rounded-xl bg-green-50 px-4 py-2.5 text-[13px] text-green-600">
            {message || 'LINE 帳號綁定成功！'}
          </div>
        )}

        {/* Avatar + 用戶概覽 */}
        <section ref={avatarSectionRef} className="glass rounded-3xl p-6 md:p-8 ring-1 ring-white/20">
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <button
              type="button"
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="group relative cursor-pointer"
              aria-label="變更頭像"
            >
              <div className="h-20 w-20 rounded-full bg-linear-to-br from-sandrift-200/80 via-sandrift-300/40 to-sandrift-200/60 p-0.5 shadow-[0_0_16px_rgba(176,141,98,0.15)] transition-all group-hover:shadow-[0_0_24px_rgba(176,141,98,0.22)] group-hover:from-sandrift-300/90">
                <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
                  {isLetter ? (
                    <span className="flex h-full w-full items-center justify-center bg-sandrift-50 text-2xl font-bold text-sandrift-500 transition-all duration-300">
                      {initial}
                    </span>
                  ) : (
                    <Image
                      key={currentAvatar}
                      src={currentAvatar}
                      alt="Avatar"
                      width={80}
                      height={80}
                      className="h-full w-full object-cover animate-fade-in"
                    />
                  )}
                  {/* Apple-style gloss */}
                  <span className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-b from-white/30 via-transparent to-black/8" />
                  {/* Saving spinner overlay */}
                  {avatarSaving && (
                    <span className="absolute inset-0 flex items-center justify-center rounded-full bg-white/60 backdrop-blur-[1px] animate-fade-in">
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-sandrift-300 border-t-sandrift-600" />
                    </span>
                  )}
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-sandrift-400 ring-1 ring-sandrift-200/40 transition-colors group-hover:text-sandrift-600">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                </svg>
              </span>
            </button>

            <h2 className="mt-3 text-base font-bold text-sandrift-950">
              {profile.customer?.name || '尚未設定姓名'}
            </h2>
            <p className="text-xs text-sandrift-400">{profile.user.email}</p>
          </div>

          {/* Avatar 選擇器 */}
          <div
            className={`mt-5 rounded-2xl bg-sandrift-50/50 overflow-hidden transition-all duration-300 ease-out ${
              showAvatarPicker ? 'max-h-40 p-4 opacity-100' : 'max-h-0 p-0 opacity-0'
            }`}
          >
              <p className="mb-3 text-center text-xs font-medium text-sandrift-500">選擇你的頭像</p>
              <div className="flex items-center justify-center gap-3">
                {avatarOptions.map((opt) => {
                  const isActive = currentAvatar === opt.value ||
                    (!profile.user.user_metadata?.preferred_avatar && opt.value === getDefaultAvatar(profile.user.email || ''))
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleAvatarChange(opt.value)}
                      disabled={avatarSaving}
                      className={`h-12 w-12 cursor-pointer rounded-full p-[1.5px] transition-all disabled:opacity-40 ${
                        isActive
                          ? 'bg-linear-to-br from-sandrift-400/80 via-sandrift-300/60 to-sandrift-400/70 shadow-[0_0_10px_rgba(176,141,98,0.2)]'
                          : 'bg-linear-to-br from-sandrift-200/50 via-sandrift-100/30 to-sandrift-200/40 opacity-60 hover:opacity-100 hover:from-sandrift-300/60'
                      }`}
                      aria-label={opt.label}
                    >
                      <span className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
                        {opt.value === 'letter' ? (
                          <span className="flex h-full w-full items-center justify-center bg-sandrift-50 text-sm font-semibold text-sandrift-500">
                            {initial}
                          </span>
                        ) : (
                          <Image
                            src={opt.value}
                            alt={opt.label}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        )}
                        {/* Apple-style gloss */}
                        <span className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-b from-white/25 via-transparent to-black/6" />
                        {isActive && (
                          <span className="absolute inset-0 flex items-center justify-center bg-sandrift-900/15">
                            <Check className="h-4 w-4 text-white drop-shadow" />
                          </span>
                        )}
                      </span>
                    </button>
                  )
                })}
              </div>
          </div>
        </section>

        {/* 基本資料 */}
        <section className="glass rounded-3xl p-6 md:p-8 ring-1 ring-white/20">
          <h2 className="mb-5 text-[15px] font-bold text-sandrift-950">基本資料</h2>

          <div className="space-y-3">
            <div>
              <label htmlFor="profile-email" className={labelClass}>電子信箱</label>
              <input
                id="profile-email"
                type="email"
                value={profile.user.email || ''}
                disabled
                className={`${inputClass} opacity-60 cursor-not-allowed`}
              />
              <p className="mt-1 text-[11px] text-sandrift-300">信箱無法修改</p>
            </div>
            <div>
              <label htmlFor="profile-name" className={labelClass}>姓名</label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="請輸入姓名"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="profile-phone" className={labelClass}>手機號碼</label>
              <input
                id="profile-phone"
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                onBlur={handlePhoneBlur}
                placeholder="0912-345-678"
                maxLength={12}
                className={`${inputClass} tabular-nums tracking-wide ${
                  phoneError ? 'ring-red-300/50 focus:ring-red-400/50' : ''
                }`}
              />
              {phoneError ? (
                <p className="mt-1 text-[11px] text-red-500">{phoneError}</p>
              ) : (
                <p className="mt-1 text-[11px] text-sandrift-300">收件聯絡用，格式：0912-345-678</p>
              )}
            </div>
            <div>
              <label htmlFor="profile-address" className={labelClass}>預設地址</label>
              <input
                id="profile-address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="請輸入預設收件地址"
                className={inputClass}
              />
            </div>
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={saving}
              className={`${btnClass} w-full bg-sandrift-500 text-white hover:bg-sandrift-600`}
            >
              {saving ? <><BtnSpinner />儲存中...</> : '儲存資料'}
            </button>
          </div>
        </section>

        {/* 密碼設定 */}
        <section className="glass rounded-3xl p-6 md:p-8 ring-1 ring-white/20">
          <h2 className="mb-1 text-[15px] font-bold text-sandrift-950">
            {hasPassword ? '變更密碼' : '設定密碼'}
          </h2>
          <p className="mb-5 text-[13px] text-sandrift-400">
            {hasPassword
              ? '設定新密碼以取代舊密碼'
              : '設定密碼後即可使用 Email + 密碼登入'}
          </p>

          <div className="space-y-3">
            <div>
              <label htmlFor="new-password" className={labelClass}>
                {hasPassword ? '新密碼' : '密碼'}
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="至少 6 個字元"
                minLength={6}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="confirm-new-password" className={labelClass}>確認密碼</label>
              <input
                id="confirm-new-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="請再次輸入密碼"
                className={inputClass}
              />
            </div>
            <button
              type="button"
              onClick={handleSetPassword}
              disabled={passwordSaving || !newPassword}
              className={`${btnClass} w-full bg-sandrift-500 text-white hover:bg-sandrift-600`}
            >
              {passwordSaving ? <><BtnSpinner />設定中...</> : hasPassword ? '變更密碼' : '設定密碼'}
            </button>
          </div>
        </section>

        {/* 綁定帳號 */}
        <section className="glass rounded-3xl p-6 md:p-8 ring-1 ring-white/20">
          <h2 className="mb-1 text-[15px] font-bold text-sandrift-950">綁定帳號</h2>
          <p className="mb-5 text-[13px] text-sandrift-400">
            綁定後可用多種方式登入同一帳號
          </p>

          <div className="space-y-3">
            {/* Email */}
            <div className="flex items-center justify-between rounded-xl bg-white/50 px-4 py-3 ring-1 ring-sandrift-100/40">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sandrift-100">
                  <svg className="h-4 w-4 text-sandrift-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.5-9.75-6.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-sandrift-900">Email 密碼</p>
                  <p className="text-[11px] text-sandrift-400">
                    {hasPassword ? '已設定' : '未設定 — 請在上方設定密碼'}
                  </p>
                </div>
              </div>
              {hasPassword && (
                <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-[11px] font-medium text-green-600">
                  已綁定
                </span>
              )}
            </div>

            {/* Google */}
            <div className="flex items-center justify-between rounded-xl bg-white/50 px-4 py-3 ring-1 ring-sandrift-100/40">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-sandrift-900">Google</p>
                  <p className="text-[11px] text-sandrift-400">
                    {hasGoogle ? '已連結' : '未連結'}
                  </p>
                </div>
              </div>
              {hasGoogle ? (
                <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-[11px] font-medium text-green-600">
                  已綁定
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleLinkGoogle}
                  className={`${btnClass} bg-white text-sandrift-700 ring-1 ring-sandrift-200/50 hover:bg-sandrift-50`}
                >
                  綁定
                </button>
              )}
            </div>

            {/* LINE */}
            <div className="flex items-center justify-between rounded-xl bg-white/50 px-4 py-3 ring-1 ring-sandrift-100/40">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#06C755]">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="white">
                    <path d="M24 10.304C24 4.916 18.615.535 12 .535S0 4.916 0 10.304c0 4.83 4.27 8.879 10.035 9.642.391.084.923.26 1.058.594.12.302.079.77.038 1.084l-.164 1.026c-.045.303-.24 1.192 1.049.649 1.291-.542 6.916-4.098 9.436-7.013C23.176 14.382 24 12.442 24 10.304M8.776 13.194H6.42a.532.532 0 01-.532-.532V8.106a.532.532 0 01.532-.532.532.532 0 01.532.532v4.024h1.824a.532.532 0 01.532.532.532.532 0 01-.532.532m1.63-.532a.532.532 0 01-.532.532.532.532 0 01-.532-.532V8.106a.532.532 0 01.532-.532.532.532 0 01.532.532v4.556zm4.674 0c0 .228-.148.43-.365.502a.523.523 0 01-.167.03.527.527 0 01-.43-.216l-2.064-2.81v2.494a.532.532 0 01-.532.532.532.532 0 01-.532-.532V8.106c0-.228.148-.43.365-.502a.521.521 0 01.167-.03c.17 0 .33.09.43.216l2.064 2.81V8.106a.532.532 0 01.532-.532.532.532 0 01.532.532v4.556zm3.695-3.092a.532.532 0 01.532.532.532.532 0 01-.532.532h-1.48v.952h1.48a.532.532 0 01.532.532.532.532 0 01-.532.532h-2.012a.532.532 0 01-.532-.532V8.106a.532.532 0 01.532-.532h2.012a.532.532 0 01.532.532.532.532 0 01-.532.532h-1.48v.932h1.48z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-sandrift-900">LINE</p>
                  <p className="text-[11px] text-sandrift-400">
                    {hasLine
                      ? `已連結 (${profile.user.user_metadata.line_display_name || 'LINE 用戶'})`
                      : '未連結'}
                  </p>
                </div>
              </div>
              {hasLine ? (
                <button
                  type="button"
                  onClick={handleUnlinkLine}
                  className={`${btnClass} text-red-500 hover:bg-red-50`}
                >
                  解除綁定
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleLinkLine}
                  className={`${btnClass} bg-[#06C755] text-white hover:bg-[#05b64e]`}
                >
                  綁定
                </button>
              )}
            </div>
          </div>
        </section>

        {/* 登出 */}
        <button
          type="button"
          onClick={handleLogout}
          className={`${btnClass} w-full text-red-500 hover:bg-red-50 ring-1 ring-red-100/50`}
        >
          登出
        </button>
      </div>
    </div>
  )
}
