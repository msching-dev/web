# Auth + Admin CRUD + Supabase Storage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement user authentication (Email/Google/LINE), admin product CRUD with reusable form components, and migrate product images to Supabase Storage.

**Architecture:** Supabase Auth handles all three login methods via PKCE flow with a unified `/auth/callback` route. Admin CRUD uses Next.js Server Actions with Zod validation, writing to Supabase via the admin client (bypass RLS). Product images move from `public/images/products/` to Supabase Storage public bucket, with an ImageUploader component using @dnd-kit for drag-and-drop reorder.

**Tech Stack:** Next.js 16 App Router, Supabase Auth + Storage, Zod, @dnd-kit/core + @dnd-kit/sortable, Server Actions

**Spec:** `docs/superpowers/specs/2026-04-04-auth-admin-crud-storage-design.md`

---

## File Structure

### New Files

```
app/auth/callback/route.ts                    — OAuth callback handler
hooks/use-auth.ts                             — Client-side auth state hook
lib/validations/product.ts                    — Zod product schema
app/(admin)/admin/products/actions.ts         — Product Server Actions
app/(admin)/admin/products/new/page.tsx       — New product page
app/(admin)/admin/products/[id]/edit/page.tsx — Edit product page
components/admin/product-form.tsx             — Main product form container
components/admin/dynamic-field-editor.tsx     — Config-driven textarea/input fields
components/admin/key-value-list-editor.tsx    — Dynamic key-value pairs editor
components/admin/nutrient-editor.tsx          — Nutrition editor (3 modes)
components/admin/image-uploader.tsx           — Image upload/sort/delete with dnd-kit
components/admin/confirm-dialog.tsx           — Danger zone confirmation dialog
scripts/migrate-images.ts                     — One-time image migration script
supabase/migrations/006_auth_user_trigger.sql — Auto-create customer on signup
```

### Modified Files

```
middleware.ts                                 — Minor: already good, optimize double getUser call
lib/supabase/middleware.ts                    — Fix duplicate getUser() call
app/(store)/account/page.tsx                  — Wire up Supabase auth calls
components/layout/header.tsx                  — Session-aware: login/avatar/admin button
components/layout/client-layout.tsx           — Pass user to Header
app/(admin)/admin/products/page.tsx           — Add action buttons column
lib/supabase/queries.ts                       — Add admin query helpers
next.config.ts                                — Add Supabase Storage remotePatterns
package.json                                  — Add zod, @dnd-kit/* dependencies
```

---

## Phase 1: Authentication

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install zod and @dnd-kit packages**

```bash
pnpm add zod @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

- [ ] **Step 2: Verify installation**

```bash
pnpm build
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add zod and @dnd-kit dependencies"
```

---

### Task 2: DB Migration — Auto-create Customer on Auth Signup

**Files:**
- Create: `supabase/migrations/006_auth_user_trigger.sql`

The existing `003_triggers.sql` has `link_auth_to_customer` which only links existing guest customers. We need an additional trigger that creates a new customer record when no matching email exists.

- [ ] **Step 1: Create migration file**

```sql
-- ============================================================
-- 006: Auto-create customer on auth signup
-- ============================================================

-- When a new user signs up via Supabase Auth and no matching
-- guest customer record exists, create one automatically.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create if no existing customer with this email
  IF NOT EXISTS (SELECT 1 FROM public.customers WHERE email = NEW.email) THEN
    INSERT INTO public.customers (auth_id, email, name, phone)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
      ''
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- This trigger fires AFTER the existing link_auth_to_customer trigger.
-- If link_auth_to_customer already matched a guest record, this won't create a duplicate
-- because the email will already exist in customers.
CREATE TRIGGER trg_create_customer_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

- [ ] **Step 2: Apply migration to Supabase**

Run this SQL in Supabase Dashboard → SQL Editor (since we don't use Supabase CLI for migrations in this project).

Verify: In Supabase Dashboard → Database → Functions, confirm `handle_new_user` exists. In Triggers on `auth.users`, confirm both `trg_link_auth_customer` and `trg_create_customer_on_signup` exist.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/006_auth_user_trigger.sql
git commit -m "feat: add DB trigger to auto-create customer on auth signup"
```

---

### Task 3: Fix Middleware — Remove Duplicate getUser Call

**Files:**
- Modify: `lib/supabase/middleware.ts:28-48`

The current middleware calls `getUser()` twice for admin routes. Fix to use a single call.

- [ ] **Step 1: Update middleware to use single getUser call**

Replace the entire content of `lib/supabase/middleware.ts`:

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 刷新 auth token（single call）
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // /admin/* 路由保護：未登入或非 admin → 導回首頁
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user || user.app_metadata?.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
```

- [ ] **Step 2: Verify build**

```bash
pnpm build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add lib/supabase/middleware.ts
git commit -m "fix: remove duplicate getUser() call in middleware"
```

---

### Task 4: OAuth Callback Route

**Files:**
- Create: `app/auth/callback/route.ts`

- [ ] **Step 1: Create the callback route handler**

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // 認證失敗 → 導回登入頁
  return NextResponse.redirect(`${origin}/account?error=auth_failed`)
}
```

- [ ] **Step 2: Verify build**

```bash
pnpm build
```

Expected: Build succeeds. The `/auth/callback` route is available.

- [ ] **Step 3: Commit**

```bash
git add app/auth/callback/route.ts
git commit -m "feat: add OAuth callback route handler"
```

---

### Task 5: Auth State Hook

**Files:**
- Create: `hooks/use-auth.ts`

- [ ] **Step 1: Create the auth hook**

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const isAdmin = user?.app_metadata?.role === 'admin'

  return { user, loading, isAdmin }
}
```

- [ ] **Step 2: Verify build**

```bash
pnpm build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add hooks/use-auth.ts
git commit -m "feat: add useAuth hook for client-side auth state"
```

---

### Task 6: Wire Up Account Page — Email Auth

**Files:**
- Modify: `app/(store)/account/page.tsx`

- [ ] **Step 1: Rewrite account page with Supabase auth**

Replace the entire content of `app/(store)/account/page.tsx`:

```typescript
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
```

- [ ] **Step 2: Verify build**

```bash
pnpm build
```

Expected: Build succeeds.

- [ ] **Step 3: Manual test — Email login flow**

1. Run `pnpm dev`
2. Go to `/account`
3. Register a new account with email/password
4. Should see success message, tab switches to login
5. Login with the same credentials
6. Should redirect to `/`
7. Going back to `/account` should redirect to `/` (already logged in)

- [ ] **Step 4: Commit**

```bash
git add app/(store)/account/page.tsx
git commit -m "feat: wire up account page with Supabase auth (email + OAuth)"
```

---

### Task 7: Session-Aware Header

**Files:**
- Modify: `components/layout/header.tsx`
- Modify: `components/layout/client-layout.tsx`

- [ ] **Step 1: Update Header to show auth state**

Replace the entire content of `components/layout/header.tsx`:

```typescript
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, ShoppingBag, User, LogOut, Settings } from 'lucide-react'
import { menuItems } from '@/lib/menus'
import { useAuth } from '@/hooks/use-auth'
import { createClient } from '@/lib/supabase/client'

interface HeaderProps {
  onMobileMenuToggle: () => void
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu when clicking outside
  useEffect(() => {
    if (!showUserMenu) return
    const handleClick = () => setShowUserMenu(false)
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [showUserMenu])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setShowUserMenu(false)
    router.push('/')
    router.refresh()
  }

  const UserButton = () => {
    if (loading) {
      return (
        <div className="flex h-9 w-9 items-center justify-center">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-sandrift-200 border-t-sandrift-500" />
        </div>
      )
    }

    if (!user) {
      return (
        <Link href="/account" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sandrift-500 transition-colors hover:text-sandrift-800" aria-label="帳號">
          <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </Link>
      )
    }

    return (
      <div className="relative">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setShowUserMenu(!showUserMenu) }}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-sandrift-100 text-sandrift-700 transition-colors hover:bg-sandrift-200"
          aria-label="使用者選單"
        >
          <span className="text-xs font-semibold">
            {user.email?.charAt(0).toUpperCase() || 'U'}
          </span>
        </button>

        {showUserMenu && (
          <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-sandrift-100 bg-white py-1.5 shadow-lg z-50">
            <div className="border-b border-sandrift-50 px-3 py-2">
              <p className="truncate text-xs text-sandrift-500">{user.email}</p>
            </div>
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 px-3 py-2 text-[13px] text-sandrift-700 hover:bg-sandrift-50 transition-colors"
                onClick={() => setShowUserMenu(false)}
              >
                <Settings className="h-3.5 w-3.5" strokeWidth={1.5} />
                後台管理
              </Link>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
              登出
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 border-b ${
        scrolled
          ? 'border-sandrift-200/20 bg-white/80 backdrop-blur-2xl backdrop-saturate-[1.4] shadow-[0_1px_12px_rgba(176,141,98,0.06)]'
          : 'border-sandrift-200/10 bg-white/60 backdrop-blur-xl'
      }`}
    >
      {/* Mobile */}
      <div className="flex h-14 items-center justify-between px-4 lg:hidden">
        <button
          type="button"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sandrift-600 transition-colors hover:text-sandrift-900"
          onClick={onMobileMenuToggle}
          aria-label="開啟選單"
        >
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </button>

        <Link href="/" className="absolute left-1/2 -translate-x-1/2 cursor-pointer">
          <Image src="/images/logo.svg" alt="MS. CHING" width={48} height={48} className="h-12 w-auto" priority />
        </Link>

        <div className="flex items-center">
          <Link href="/cart" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sandrift-500 transition-colors hover:text-sandrift-800" aria-label="購物車">
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </Link>
          <UserButton />
        </div>
      </div>

      {/* Desktop */}
      <div className="mx-auto hidden h-14 max-w-7xl items-center justify-between px-6 lg:flex xl:px-8">
        <Link href="/" className="flex-shrink-0 cursor-pointer">
          <Image src="/images/logo.svg" alt="MS. CHING" width={40} height={40} className="h-10 w-auto" priority />
        </Link>

        <nav className="flex items-center gap-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path || '/'}
              className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-sandrift-700 transition-colors duration-200 hover:bg-sandrift-100/40 hover:text-sandrift-950"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link href="/cart" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sandrift-500 transition-colors hover:text-sandrift-800" aria-label="購物車">
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </Link>
          <UserButton />
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
pnpm build
```

Expected: Build succeeds.

- [ ] **Step 3: Manual test — Header auth states**

1. Not logged in: User icon links to `/account`
2. Logged in (regular): Avatar initial shows, dropdown has email + 登出
3. Logged in (admin): Dropdown also shows 「後台管理」 link
4. Logout works and redirects to `/`

- [ ] **Step 4: Commit**

```bash
git add components/layout/header.tsx
git commit -m "feat: session-aware header with user menu and admin entry"
```

---

### Task 8: Configure Supabase OAuth Providers

This is a manual configuration task — no code changes.

- [ ] **Step 1: Configure Google OAuth**

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add Authorized redirect URI: `https://zxtpxuowktwaqmwuxvly.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret
5. In Supabase Dashboard → Authentication → Providers → Google:
   - Enable Google provider
   - Paste Client ID and Client Secret
   - Save

- [ ] **Step 2: Configure LINE Login**

1. Go to [LINE Developers Console](https://developers.line.biz/)
2. Create a Provider → Create a LINE Login Channel
3. Set Callback URL: `https://zxtpxuowktwaqmwuxvly.supabase.co/auth/v1/callback`
4. Enable email permission in channel settings
5. Copy Channel ID and Channel Secret
6. In Supabase Dashboard → Authentication → Providers:
   - If LINE is available as built-in: enable and paste credentials
   - If not: Add custom OIDC provider with:
     - Issuer URL: `https://access.line.me`
     - Client ID: (Channel ID)
     - Client Secret: (Channel Secret)

- [ ] **Step 3: Configure Supabase Auth settings**

In Supabase Dashboard → Authentication → URL Configuration:
- Site URL: `https://msching.com` (or `http://localhost:3000` for dev)
- Redirect URLs: add `http://localhost:3000/auth/callback` and `https://msching.com/auth/callback`

In Authentication → Settings:
- Disable "Confirm email" (軟驗證策略 — 註冊即可用)

- [ ] **Step 4: Test OAuth flows**

1. `pnpm dev` → Go to `/account`
2. Click 「使用 Google 登入」→ Should redirect to Google consent → back to `/auth/callback` → home
3. Click 「使用 LINE 登入」→ Should redirect to LINE auth → back to `/auth/callback` → home
4. Check Supabase Dashboard → Authentication → Users to confirm user records created
5. Check customers table has matching records (trigger should have fired)

- [ ] **Step 5: Commit (no code changes, but document the config)**

No git commit needed — this is Supabase Dashboard configuration only.

---

## Phase 2: Admin Product CRUD

### Task 9: Zod Product Validation Schema

**Files:**
- Create: `lib/validations/product.ts`

- [ ] **Step 1: Create the validation schema**

```typescript
import { z } from 'zod'

export const keyValueSchema = z.object({
  key: z.string().min(1, '名稱不可為空'),
  value: z.number(),
})

export const giftBoxNutrientSchema = z.object({
  taste: z.string().min(1, '口味不可為空'),
  content: z.array(keyValueSchema),
})

export const productImageSchema = z.object({
  url: z.string().url(),
  alt: z.string(),
  sort_order: z.number(),
})

export const productSchema = z.object({
  name: z.string().min(1, '商品名稱不可為空'),
  slug: z.string().min(1, 'Slug 不可為空').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug 格式錯誤（小寫英數 + 連字號）'),
  alias: z.string().optional().default(''),
  price: z.number().positive('售價必須大於 0'),
  compare_price: z.number().positive().nullable().optional(),
  category_id: z.string().uuid().nullable().optional(),
  tags: z.array(z.string()).default([]),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  description: z.string().optional().default(''),

  // 庫存與規格
  stock_quantity: z.number().int().min(0).nullable().optional(),
  max_order_qty: z.number().int().positive().nullable().optional(),
  min_order_qty: z.number().int().positive().nullable().optional(),
  portion_size: z.number().min(0).nullable().optional(),
  include_size: z.string().optional().default(''),
  unit: z.string().optional().default(''),
  shelf_life: z.string().optional().default(''),
  storage_instructions: z.string().optional().default(''),
  allergens: z.string().optional().default(''),

  // JSONB fields
  detail: z.object({
    desc: z.string().default(''),
    nonAdditive: z.string().default(''),
    howToEat: z.string().default(''),
    preservationMethod: z.string().default(''),
    precautions: z.string().default(''),
    tastePeriod: z.string().default(''),
  }).default({}),

  specifications: z.array(keyValueSchema).default([]),

  nutrition: z.object({
    perServing: z.array(keyValueSchema).default([]),
    perHundred: z.array(keyValueSchema).default([]),
    giftBox: z.array(giftBoxNutrientSchema).default([]),
  }).default({}),

  images: z.array(productImageSchema).max(8, '最多 8 張圖片').default([]),

  sort_order: z.number().int().nullable().optional(),
})

export type ProductFormData = z.infer<typeof productSchema>

/** Default values for a new product form */
export const defaultProductFormData: ProductFormData = {
  name: '',
  slug: '',
  alias: '',
  price: 0,
  compare_price: null,
  category_id: null,
  tags: [],
  is_active: true,
  is_featured: false,
  description: '',
  stock_quantity: null,
  max_order_qty: null,
  min_order_qty: null,
  portion_size: null,
  include_size: '',
  unit: '',
  shelf_life: '',
  storage_instructions: '',
  allergens: '',
  detail: {
    desc: '',
    nonAdditive: '',
    howToEat: '',
    preservationMethod: '',
    precautions: '',
    tastePeriod: '',
  },
  specifications: [],
  nutrition: {
    perServing: [],
    perHundred: [],
    giftBox: [],
  },
  images: [],
  sort_order: null,
}
```

- [ ] **Step 2: Verify build**

```bash
pnpm build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add lib/validations/product.ts
git commit -m "feat: add Zod product validation schema"
```

---

### Task 10: Reusable Admin Form Components

**Files:**
- Create: `components/admin/key-value-list-editor.tsx`
- Create: `components/admin/dynamic-field-editor.tsx`
- Create: `components/admin/nutrient-editor.tsx`
- Create: `components/admin/confirm-dialog.tsx`

- [ ] **Step 1: Create KeyValueListEditor**

```typescript
'use client'

import { Plus, Trash2, GripVertical } from 'lucide-react'

export interface KeyValueItem {
  key: string
  value: number
}

interface KeyValueListEditorProps {
  items: KeyValueItem[]
  onChange: (items: KeyValueItem[]) => void
  keyLabel?: string
  valueLabel?: string
  keyPlaceholder?: string
  valuePlaceholder?: string
}

export default function KeyValueListEditor({
  items,
  onChange,
  keyLabel = '名稱',
  valueLabel = '數值',
  keyPlaceholder = '例：熱量',
  valuePlaceholder = '0',
}: KeyValueListEditorProps) {
  const addItem = () => {
    onChange([...items, { key: '', value: 0 }])
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: 'key' | 'value', val: string) => {
    const updated = items.map((item, i) =>
      i === index
        ? { ...item, [field]: field === 'value' ? parseFloat(val) || 0 : val }
        : item
    )
    onChange(updated)
  }

  return (
    <div className="space-y-2">
      {items.length > 0 && (
        <div className="grid grid-cols-[1fr_120px_32px] gap-2 text-xs font-medium text-gray-500">
          <span>{keyLabel}</span>
          <span>{valueLabel}</span>
          <span />
        </div>
      )}
      {items.map((item, index) => (
        <div key={index} className="grid grid-cols-[1fr_120px_32px] gap-2 items-center">
          <input
            type="text"
            value={item.key}
            onChange={(e) => updateItem(index, 'key', e.target.value)}
            placeholder={keyPlaceholder}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sandrift-300 focus:outline-none"
          />
          <input
            type="number"
            step="any"
            value={item.value}
            onChange={(e) => updateItem(index, 'value', e.target.value)}
            placeholder={valuePlaceholder}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sandrift-300 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-500 hover:border-sandrift-300 hover:text-sandrift-600 transition-colors"
      >
        <Plus className="h-4 w-4" />
        新增項目
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Create DynamicFieldEditor**

```typescript
'use client'

export interface FieldConfig {
  key: string
  label: string
  multiline?: boolean
  placeholder?: string
}

interface DynamicFieldEditorProps {
  fields: FieldConfig[]
  values: Record<string, string>
  onChange: (values: Record<string, string>) => void
}

export default function DynamicFieldEditor({
  fields,
  values,
  onChange,
}: DynamicFieldEditorProps) {
  const handleChange = (key: string, val: string) => {
    onChange({ ...values, [key]: val })
  }

  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.key}>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          {field.multiline ? (
            <textarea
              value={values[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sandrift-300 focus:outline-none resize-y"
            />
          ) : (
            <input
              type="text"
              value={values[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sandrift-300 focus:outline-none"
            />
          )}
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Create NutrientEditor**

```typescript
'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import KeyValueListEditor, { type KeyValueItem } from './key-value-list-editor'

interface GiftBoxGroup {
  taste: string
  content: KeyValueItem[]
}

interface NutrientData {
  perServing: KeyValueItem[]
  perHundred: KeyValueItem[]
  giftBox: GiftBoxGroup[]
}

interface NutrientEditorProps {
  value: NutrientData
  onChange: (value: NutrientData) => void
}

export default function NutrientEditor({ value, onChange }: NutrientEditorProps) {
  const hasGiftBox = value.giftBox.length > 0
  const [mode, setMode] = useState<'standard' | 'giftbox'>(
    hasGiftBox ? 'giftbox' : 'standard'
  )

  const handleModeChange = (newMode: 'standard' | 'giftbox') => {
    setMode(newMode)
    if (newMode === 'standard') {
      onChange({ ...value, giftBox: [] })
    } else {
      onChange({ ...value, perServing: [], perHundred: [] })
    }
  }

  const addGiftBoxGroup = () => {
    onChange({
      ...value,
      giftBox: [...value.giftBox, { taste: '', content: [] }],
    })
  }

  const removeGiftBoxGroup = (index: number) => {
    onChange({
      ...value,
      giftBox: value.giftBox.filter((_, i) => i !== index),
    })
  }

  const updateGiftBoxTaste = (index: number, taste: string) => {
    const updated = value.giftBox.map((g, i) =>
      i === index ? { ...g, taste } : g
    )
    onChange({ ...value, giftBox: updated })
  }

  const updateGiftBoxContent = (index: number, content: KeyValueItem[]) => {
    const updated = value.giftBox.map((g, i) =>
      i === index ? { ...g, content } : g
    )
    onChange({ ...value, giftBox: updated })
  }

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-1">
        <button
          type="button"
          onClick={() => handleModeChange('standard')}
          className={`flex-1 cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === 'standard'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          一般商品
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('giftbox')}
          className={`flex-1 cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === 'giftbox'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          禮盒（按口味分）
        </button>
      </div>

      {mode === 'standard' && (
        <>
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700">每份營養成分</h4>
            <KeyValueListEditor
              items={value.perServing}
              onChange={(items) => onChange({ ...value, perServing: items })}
              keyPlaceholder="例：熱量"
              valuePlaceholder="0"
            />
          </div>
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700">每百克營養成分</h4>
            <KeyValueListEditor
              items={value.perHundred}
              onChange={(items) => onChange({ ...value, perHundred: items })}
              keyPlaceholder="例：熱量"
              valuePlaceholder="0"
            />
          </div>
        </>
      )}

      {mode === 'giftbox' && (
        <div className="space-y-4">
          {value.giftBox.map((group, index) => (
            <div key={index} className="rounded-lg border border-gray-200 p-4">
              <div className="mb-3 flex items-center gap-2">
                <input
                  type="text"
                  value={group.taste}
                  onChange={(e) => updateGiftBoxTaste(index, e.target.value)}
                  placeholder="口味名稱（例：巧克力）"
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium focus:border-sandrift-300 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeGiftBoxGroup(index)}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <KeyValueListEditor
                items={group.content}
                onChange={(items) => updateGiftBoxContent(index, items)}
                keyPlaceholder="例：熱量"
                valuePlaceholder="0"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addGiftBoxGroup}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-500 hover:border-sandrift-300 hover:text-sandrift-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            新增口味
          </button>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Create ConfirmDialog**

```typescript
'use client'

import { useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  loading?: boolean
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = '確認刪除',
  loading = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="rounded-2xl border-0 bg-white p-0 shadow-xl backdrop:bg-black/40 max-w-sm w-full"
    >
      <div className="p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="flex-1 cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          取消
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          {loading ? '處理中...' : confirmLabel}
        </button>
      </div>
    </dialog>
  )
}
```

- [ ] **Step 5: Verify build**

```bash
pnpm build
```

Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add components/admin/key-value-list-editor.tsx components/admin/dynamic-field-editor.tsx components/admin/nutrient-editor.tsx components/admin/confirm-dialog.tsx
git commit -m "feat: add reusable admin form components (KeyValueListEditor, DynamicFieldEditor, NutrientEditor, ConfirmDialog)"
```

---

### Task 11: Product Server Actions

**Files:**
- Create: `app/(admin)/admin/products/actions.ts`
- Modify: `lib/supabase/queries.ts` (add `getProductById`)

- [ ] **Step 1: Add getProductById to queries**

Add at the end of `lib/supabase/queries.ts`:

```typescript
/**
 * 取得單一商品 by ID（後台編輯用，含下架商品）
 */
export async function getProductById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data
}
```

- [ ] **Step 2: Create Server Actions**

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { productSchema, type ProductFormData } from '@/lib/validations/product'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata?.role !== 'admin') {
    throw new Error('Unauthorized')
  }
  return user
}

function revalidateProducts() {
  revalidatePath('/admin/products')
  revalidatePath('/')
  revalidatePath('/products', 'layout')
}

export async function createProduct(data: ProductFormData) {
  await requireAdmin()

  const parsed = productSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const { images, ...rest } = parsed.data

  const { error } = await supabaseAdmin
    .from('products')
    .insert({
      ...rest,
      images: images as any,
      detail: rest.detail as any,
      nutrition: rest.nutrition as any,
      specifications: rest.specifications as any,
    })

  if (error) {
    if (error.code === '23505') {
      return { error: { slug: ['此 Slug 已被使用'] } }
    }
    return { error: { _form: ['建立失敗：' + error.message] } }
  }

  revalidateProducts()
  return { success: true }
}

export async function updateProduct(id: string, data: ProductFormData) {
  await requireAdmin()

  const parsed = productSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const { images, ...rest } = parsed.data

  const { error } = await supabaseAdmin
    .from('products')
    .update({
      ...rest,
      images: images as any,
      detail: rest.detail as any,
      nutrition: rest.nutrition as any,
      specifications: rest.specifications as any,
    })
    .eq('id', id)

  if (error) {
    if (error.code === '23505') {
      return { error: { slug: ['此 Slug 已被使用'] } }
    }
    return { error: { _form: ['更新失敗：' + error.message] } }
  }

  revalidateProducts()
  return { success: true }
}

export async function toggleProductActive(id: string) {
  await requireAdmin()

  // Get current state
  const { data: product } = await supabaseAdmin
    .from('products')
    .select('is_active')
    .eq('id', id)
    .single()

  if (!product) {
    return { error: '商品不存在' }
  }

  const { error } = await supabaseAdmin
    .from('products')
    .update({ is_active: !product.is_active })
    .eq('id', id)

  if (error) {
    return { error: '操作失敗：' + error.message }
  }

  revalidateProducts()
  return { success: true, is_active: !product.is_active }
}

export async function deleteProduct(id: string) {
  await requireAdmin()

  // Get product to find images for cleanup
  const { data: product } = await supabaseAdmin
    .from('products')
    .select('slug, images')
    .eq('id', id)
    .single()

  if (!product) {
    return { error: '商品不存在' }
  }

  // Delete product from DB
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: '刪除失敗：' + error.message }
  }

  // Clean up Storage images (best effort)
  if (product.slug) {
    const { data: files } = await supabaseAdmin.storage
      .from('product-images')
      .list(product.slug)

    if (files && files.length > 0) {
      const paths = files.map((f) => `${product.slug}/${f.name}`)
      await supabaseAdmin.storage.from('product-images').remove(paths)
    }
  }

  revalidateProducts()
  return { success: true }
}
```

- [ ] **Step 3: Verify build**

```bash
pnpm build
```

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add lib/supabase/queries.ts app/(admin)/admin/products/actions.ts
git commit -m "feat: add product Server Actions (CRUD + toggle active + delete with Storage cleanup)"
```

---

### Task 12: Product Form Component

**Files:**
- Create: `components/admin/product-form.tsx`

This is the main form that composes all reusable editors. It's used by both new and edit pages.

- [ ] **Step 1: Create ProductForm component**

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DynamicFieldEditor, { type FieldConfig } from './dynamic-field-editor'
import KeyValueListEditor from './key-value-list-editor'
import NutrientEditor from './nutrient-editor'
import ImageUploader from './image-uploader'
import { type ProductFormData, defaultProductFormData } from '@/lib/validations/product'

const detailFields: FieldConfig[] = [
  { key: 'desc', label: '商品介紹', multiline: true, placeholder: '支援 ## ## 標記和 :: :: 標記' },
  { key: 'nonAdditive', label: '無添加聲明', multiline: true },
  { key: 'howToEat', label: '食用方式', multiline: true },
  { key: 'preservationMethod', label: '保存方式', multiline: true },
  { key: 'precautions', label: '注意事項', multiline: true },
  { key: 'tastePeriod', label: '賞味期限', multiline: true },
]

const availableTags = [
  { value: 'hot', label: '熱銷' },
  { value: 'new', label: '新品' },
  { value: 'top_1', label: 'TOP 1' },
  { value: 'top_2', label: 'TOP 2' },
  { value: 'top_3', label: 'TOP 3' },
  { value: 'christmas', label: '聖誕' },
]

interface ProductFormProps {
  initialData?: ProductFormData
  categories: Array<{ id: string; name: string; slug: string }>
  onSubmit: (data: ProductFormData) => Promise<{ success?: boolean; error?: any }>
  submitLabel: string
}

export default function ProductForm({
  initialData,
  categories,
  onSubmit,
  submitLabel,
}: ProductFormProps) {
  const router = useRouter()
  const [data, setData] = useState<ProductFormData>(initialData ?? defaultProductFormData)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(false)

  const update = <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }))
    // Clear field error on change
    if (errors[key]) {
      setErrors((prev) => { const next = { ...prev }; delete next[key]; return next })
    }
  }

  const handleSlugGenerate = () => {
    if (data.name && !data.slug) {
      const slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
        .replace(/^-|-$/g, '')
      update('slug', slug)
    }
  }

  const handleTagToggle = (tag: string) => {
    const tags = data.tags.includes(tag)
      ? data.tags.filter((t) => t !== tag)
      : [...data.tags, tag]
    update('tags', tags)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const result = await onSubmit(data)

    if (result.error) {
      if (typeof result.error === 'string') {
        setErrors({ _form: [result.error] })
      } else {
        setErrors(result.error)
      }
      setLoading(false)
      return
    }

    router.push('/admin/products')
  }

  const fieldError = (key: string) =>
    errors[key]?.[0] ? (
      <p className="mt-1 text-xs text-red-500">{errors[key][0]}</p>
    ) : null

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {errors._form && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {errors._form[0]}
        </div>
      )}

      {/* === 基本資訊 === */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900">基本資訊</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">商品名稱 *</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => update('name', e.target.value)}
              onBlur={handleSlugGenerate}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sandrift-300 focus:outline-none"
            />
            {fieldError('name')}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Slug *</label>
            <input
              type="text"
              value={data.slug}
              onChange={(e) => update('slug', e.target.value)}
              placeholder="auto-generated-from-name"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-sandrift-300 focus:outline-none"
            />
            {fieldError('slug')}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">別名</label>
            <input
              type="text"
              value={data.alias}
              onChange={(e) => update('alias', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sandrift-300 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">分類</label>
            <select
              value={data.category_id || ''}
              onChange={(e) => update('category_id', e.target.value || null)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sandrift-300 focus:outline-none"
            >
              <option value="">無分類</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">售價 *</label>
            <input
              type="number"
              min={0}
              value={data.price || ''}
              onChange={(e) => update('price', parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sandrift-300 focus:outline-none"
            />
            {fieldError('price')}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">原價（劃線價）</label>
            <input
              type="number"
              min={0}
              value={data.compare_price ?? ''}
              onChange={(e) => update('compare_price', e.target.value ? parseFloat(e.target.value) : null)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sandrift-300 focus:outline-none"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">標籤</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag.value}
                type="button"
                onClick={() => handleTagToggle(tag.value)}
                className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  data.tags.includes(tag.value)
                    ? 'bg-sandrift-100 text-sandrift-800 ring-1 ring-sandrift-300'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="mt-4 flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={data.is_active}
              onChange={(e) => update('is_active', e.target.checked)}
              className="rounded"
            />
            <span className="text-gray-700">上架</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={data.is_featured}
              onChange={(e) => update('is_featured', e.target.checked)}
              className="rounded"
            />
            <span className="text-gray-700">精選</span>
          </label>
        </div>
      </section>

      {/* === 庫存與規格 === */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900">庫存與規格</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">庫存數量</label>
            <input type="number" min={0} value={data.stock_quantity ?? ''} onChange={(e) => update('stock_quantity', e.target.value ? parseInt(e.target.value) : null)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sandrift-300 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">最大訂購量</label>
            <input type="number" min={1} value={data.max_order_qty ?? ''} onChange={(e) => update('max_order_qty', e.target.value ? parseInt(e.target.value) : null)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sandrift-300 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">最小訂購量</label>
            <input type="number" min={1} value={data.min_order_qty ?? ''} onChange={(e) => update('min_order_qty', e.target.value ? parseInt(e.target.value) : null)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sandrift-300 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">每份重量 (g)</label>
            <input type="number" min={0} value={data.portion_size ?? ''} onChange={(e) => update('portion_size', e.target.value ? parseFloat(e.target.value) : null)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sandrift-300 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">內含量</label>
            <input type="text" value={data.include_size} onChange={(e) => update('include_size', e.target.value)} placeholder="例：7片" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sandrift-300 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">單位</label>
            <input type="text" value={data.unit} onChange={(e) => update('unit', e.target.value)} placeholder="例：包" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sandrift-300 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">保存期限</label>
            <input type="text" value={data.shelf_life} onChange={(e) => update('shelf_life', e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sandrift-300 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">過敏原</label>
            <input type="text" value={data.allergens} onChange={(e) => update('allergens', e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sandrift-300 focus:outline-none" />
          </div>
          <div className="md:col-span-3">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">保存方式</label>
            <textarea value={data.storage_instructions} onChange={(e) => update('storage_instructions', e.target.value)} rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sandrift-300 focus:outline-none resize-y" />
          </div>
        </div>
      </section>

      {/* === 商品描述 === */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900">商品描述</h2>
        <DynamicFieldEditor
          fields={detailFields}
          values={data.detail}
          onChange={(detail) => update('detail', detail as any)}
        />
      </section>

      {/* === 規格 === */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900">規格</h2>
        <KeyValueListEditor
          items={data.specifications}
          onChange={(specs) => update('specifications', specs)}
          keyLabel="規格名"
          valueLabel="數量"
          keyPlaceholder="例：原味"
        />
      </section>

      {/* === 營養標示 === */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900">營養標示</h2>
        <NutrientEditor
          value={data.nutrition}
          onChange={(nutrition) => update('nutrition', nutrition)}
        />
      </section>

      {/* === 圖片 === */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900">商品圖片</h2>
        <ImageUploader
          slug={data.slug}
          images={data.images}
          onChange={(images) => update('images', images)}
        />
      </section>

      {/* === 排序 === */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900">排序</h2>
        <div className="max-w-xs">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">排序值（數字越小越前面）</label>
          <input type="number" value={data.sort_order ?? ''} onChange={(e) => update('sort_order', e.target.value ? parseInt(e.target.value) : null)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sandrift-300 focus:outline-none" />
        </div>
      </section>

      {/* === 操作 === */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer rounded-lg bg-sandrift-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-sandrift-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '儲存中...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="cursor-pointer rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          取消
        </button>
      </div>
    </form>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
pnpm build
```

Expected: May warn about missing `ImageUploader` — that's ok, it's created in Task 14. For now, create a placeholder:

```typescript
// components/admin/image-uploader.tsx (temporary placeholder)
'use client'

interface ImageUploaderProps {
  slug: string
  images: Array<{ url: string; alt: string; sort_order: number }>
  onChange: (images: Array<{ url: string; alt: string; sort_order: number }>) => void
}

export default function ImageUploader({ slug, images, onChange }: ImageUploaderProps) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">
      圖片上傳元件（Task 14 實作）
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/admin/product-form.tsx components/admin/image-uploader.tsx
git commit -m "feat: add ProductForm component composing all admin form editors"
```

---

### Task 13: New + Edit Product Pages & Product List Actions

**Files:**
- Create: `app/(admin)/admin/products/new/page.tsx`
- Create: `app/(admin)/admin/products/[id]/edit/page.tsx`
- Modify: `app/(admin)/admin/products/page.tsx`

- [ ] **Step 1: Create new product page**

```typescript
import { getCategories } from '@/lib/supabase/queries'
import ProductForm from '@/components/admin/product-form'
import { createProduct } from '../actions'

export default async function NewProductPage() {
  const categories = await getCategories()

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900">新增商品</h1>
      <p className="mt-1 text-sm text-gray-500">填寫商品資訊後儲存</p>
      <div className="mt-6">
        <ProductForm
          categories={categories}
          onSubmit={createProduct}
          submitLabel="建立商品"
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create edit product page**

```typescript
import { notFound } from 'next/navigation'
import { getProductById, getCategories } from '@/lib/supabase/queries'
import ProductForm from '@/components/admin/product-form'
import { updateProduct } from '../../actions'
import type { ProductFormData } from '@/lib/validations/product'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ])

  if (!product) notFound()

  // Map DB row to ProductFormData
  const images = (product.images as Array<{ url: string; alt: string; sort_order: number }>) || []
  const detail = (product.detail as Record<string, string>) || {}
  const nutrition = (product.nutrition as Record<string, any>) || {}
  const specifications = (product.specifications as Array<{ key: string; value: number }>) || []

  const initialData: ProductFormData = {
    name: product.name,
    slug: product.slug,
    alias: product.alias || '',
    price: product.price,
    compare_price: product.compare_price,
    category_id: product.category_id,
    tags: (product.tags as string[]) || [],
    is_active: product.is_active ?? true,
    is_featured: product.is_featured ?? false,
    description: product.description || '',
    stock_quantity: product.stock_quantity,
    max_order_qty: product.max_order_qty,
    min_order_qty: product.min_order_qty,
    portion_size: product.portion_size,
    include_size: product.include_size || '',
    unit: product.unit || '',
    shelf_life: product.shelf_life || '',
    storage_instructions: product.storage_instructions || '',
    allergens: product.allergens || '',
    detail: {
      desc: detail.desc || '',
      nonAdditive: detail.nonAdditive || '',
      howToEat: detail.howToEat || '',
      preservationMethod: detail.preservationMethod || '',
      precautions: detail.precautions || '',
      tastePeriod: detail.tastePeriod || '',
    },
    specifications,
    nutrition: {
      perServing: nutrition.perServing || [],
      perHundred: nutrition.perHundred || [],
      giftBox: nutrition.giftBox || [],
    },
    images,
    sort_order: product.sort_order,
  }

  const handleUpdate = async (data: ProductFormData) => {
    'use server'
    return updateProduct(id, data)
  }

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900">編輯商品</h1>
      <p className="mt-1 text-sm text-gray-500">{product.name}</p>
      <div className="mt-6">
        <ProductForm
          initialData={initialData}
          categories={categories}
          onSubmit={handleUpdate}
          submitLabel="更新商品"
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Rewrite product list page with action buttons**

Replace the entire content of `app/(admin)/admin/products/page.tsx`:

```typescript
import Image from 'next/image'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAllProducts } from '@/lib/supabase/queries'
import ProductListActions from './product-list-actions'

export default async function AdminProductsPage() {
  const products = await getAllProducts()

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">商品管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            共 {products.length} 項商品
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 rounded-lg bg-sandrift-500 px-4 py-2 text-sm font-medium text-white hover:bg-sandrift-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          新增商品
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">商品</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3 text-right">售價</th>
                <th className="px-4 py-3">分類</th>
                <th className="px-4 py-3">標籤</th>
                <th className="px-4 py-3">狀態</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => {
                const images = (product.images as Array<{ url: string; alt: string }>) || []
                const firstImage = images[0]?.url
                const category = product.categories as { name: string; slug: string } | null
                const tags = (product.tags as string[]) || []

                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-3">
                        {firstImage && (
                          <Image
                            src={firstImage}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        )}
                        <span className="font-medium text-gray-900">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                        {product.slug}
                      </code>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-gray-900">
                      ${product.price}
                    </td>
                    <td className="px-4 py-3">
                      {category && (
                        <span className="rounded-full bg-sandrift-50 px-2 py-0.5 text-xs text-sandrift-700">
                          {category.name}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        product.is_active
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {product.is_active ? '上架' : '下架'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ProductListActions
                        productId={product.id}
                        productName={product.name}
                        isActive={product.is_active ?? true}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create ProductListActions client component**

Create `app/(admin)/admin/products/product-list-actions.tsx`:

```typescript
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Pencil, Power, Trash2 } from 'lucide-react'
import { toggleProductActive, deleteProduct } from './actions'
import ConfirmDialog from '@/components/admin/confirm-dialog'

interface Props {
  productId: string
  productName: string
  isActive: boolean
}

export default function ProductListActions({ productId, productName, isActive }: Props) {
  const [showDelete, setShowDelete] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    await toggleProductActive(productId)
    setLoading(false)
  }

  const handleDelete = async () => {
    setLoading(true)
    await deleteProduct(productId)
    setShowDelete(false)
    setLoading(false)
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={handleToggle}
          disabled={loading}
          title={isActive ? '下架' : '上架'}
          className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors disabled:opacity-50 ${
            isActive
              ? 'text-green-600 hover:bg-green-50'
              : 'text-gray-400 hover:bg-gray-100'
          }`}
        >
          <Power className="h-4 w-4" />
        </button>
        <Link
          href={`/admin/products/${productId}/edit`}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Pencil className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={() => setShowDelete(true)}
          disabled={loading}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="刪除商品"
        description={`確定要永久刪除「${productName}」嗎？此操作無法復原，商品圖片也會一併刪除。`}
        loading={loading}
      />
    </>
  )
}
```

- [ ] **Step 5: Verify build**

```bash
pnpm build
```

Expected: Build succeeds.

- [ ] **Step 6: Manual test**

1. `pnpm dev` → Login as admin → Go to `/admin/products`
2. See "新增商品" button at top right
3. See action buttons (toggle/edit/delete) on each row
4. Click edit → navigate to edit form with pre-filled data
5. Click new → navigate to empty form
6. Toggle active status → status badge updates
7. Delete → confirm dialog → product removed

- [ ] **Step 7: Commit**

```bash
git add app/(admin)/admin/products/
git commit -m "feat: add product CRUD pages (new, edit, list with actions)"
```

---

## Phase 3: Supabase Storage + Image Upload

### Task 14: Configure Supabase Storage + next.config.ts

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Create Storage bucket in Supabase Dashboard**

1. Go to Supabase Dashboard → Storage
2. Create new bucket: `product-images`
3. Set as **Public** bucket
4. Add RLS policy via SQL Editor:

```sql
-- Allow public read access
CREATE POLICY "Public read product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow admin to manage images
CREATE POLICY "Admin manage product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
```

- [ ] **Step 2: Update next.config.ts**

Replace the entire content of `next.config.ts`:

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 3: Verify build**

```bash
pnpm build
```

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add next.config.ts
git commit -m "feat: add Supabase Storage remote pattern to next.config"
```

---

### Task 15: ImageUploader Component

**Files:**
- Modify: `components/admin/image-uploader.tsx` (replace placeholder)

- [ ] **Step 1: Replace placeholder with full implementation**

```typescript
'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { Upload, X, GripVertical } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { createClient } from '@/lib/supabase/client'

interface ProductImage {
  url: string
  alt: string
  sort_order: number
}

interface ImageUploaderProps {
  slug: string
  images: ProductImage[]
  onChange: (images: ProductImage[]) => void
}

const MAX_FILES = 8
const MAX_SIZE = 2 * 1024 * 1024 // 2MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function SortableImage({
  image,
  index,
  onRemove,
}: {
  image: ProductImage
  index: number
  onRemove: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.url })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative aspect-square rounded-lg border border-gray-200 overflow-hidden"
    >
      <Image
        src={image.url}
        alt={image.alt || `Product image ${index + 1}`}
        fill
        className="object-cover"
        sizes="120px"
      />
      {index === 0 && (
        <span className="absolute left-1 top-1 rounded bg-sandrift-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
          主圖
        </span>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute left-1 bottom-1 hidden h-6 w-6 cursor-grab items-center justify-center rounded bg-white/80 text-gray-600 group-hover:flex active:cursor-grabbing"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-1 top-1 hidden h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white group-hover:flex"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export default function ImageUploader({ slug, images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = images.findIndex((img) => img.url === active.id)
    const newIndex = images.findIndex((img) => img.url === over.id)
    const reordered = arrayMove(images, oldIndex, newIndex).map((img, i) => ({
      ...img,
      sort_order: i,
    }))
    onChange(reordered)
  }

  const handleFiles = useCallback(async (files: FileList) => {
    setError(null)

    if (!slug) {
      setError('請先填寫 Slug 再上傳圖片')
      return
    }

    const remaining = MAX_FILES - images.length
    if (remaining <= 0) {
      setError(`最多 ${MAX_FILES} 張圖片`)
      return
    }

    const validFiles = Array.from(files).slice(0, remaining).filter((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('僅支援 JPG、PNG、WebP 格式')
        return false
      }
      if (file.size > MAX_SIZE) {
        setError('單張圖片不可超過 2MB')
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    setUploading(true)
    const newImages: ProductImage[] = []

    for (const file of validFiles) {
      const ext = file.name.split('.').pop()
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const path = `${slug}/${filename}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(path, file)

      if (uploadError) {
        setError('上傳失敗：' + uploadError.message)
        continue
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(path)

      newImages.push({
        url: publicUrl,
        alt: file.name.replace(/\.[^.]+$/, ''),
        sort_order: images.length + newImages.length,
      })
    }

    if (newImages.length > 0) {
      onChange([...images, ...newImages])
    }

    setUploading(false)
  }, [slug, images, onChange, supabase.storage])

  const handleRemove = async (index: number) => {
    const image = images[index]
    // Extract storage path from URL
    const match = image.url.match(/\/product-images\/(.+)$/)
    if (match) {
      await supabase.storage.from('product-images').remove([match[1]])
    }
    const updated = images.filter((_, i) => i !== index).map((img, i) => ({
      ...img,
      sort_order: i,
    }))
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={images.map((img) => img.url)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-4 gap-3">
            {images.map((image, index) => (
              <SortableImage
                key={image.url}
                image={image}
                index={index}
                onRemove={() => handleRemove(index)}
              />
            ))}

            {/* Upload zone */}
            {images.length < MAX_FILES && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-sandrift-300 hover:bg-sandrift-50/30 transition-colors">
                <input
                  type="file"
                  multiple
                  accept={ACCEPTED_TYPES.join(',')}
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  className="hidden"
                  disabled={uploading}
                />
                {uploading ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-sandrift-200 border-t-sandrift-500" />
                ) : (
                  <>
                    <Upload className="h-5 w-5 text-gray-400" />
                    <span className="mt-1 text-[11px] text-gray-400">上傳圖片</span>
                  </>
                )}
              </label>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <p className="text-[11px] text-gray-400">
        拖曳可排序，第一張為主圖。最多 {MAX_FILES} 張，單張 2MB，支援 JPG/PNG/WebP。
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
pnpm build
```

Expected: Build succeeds.

- [ ] **Step 3: Manual test**

1. `pnpm dev` → Login as admin → `/admin/products/new`
2. Fill in slug field first
3. Upload images → should appear in grid
4. Drag to reorder → sort_order updates, first image shows "主圖" badge
5. Click X to delete → image removed from both grid and Storage
6. Try uploading > 8 images → error message
7. Try uploading > 2MB file → error message

- [ ] **Step 4: Commit**

```bash
git add components/admin/image-uploader.tsx
git commit -m "feat: add ImageUploader with drag-and-drop reorder via @dnd-kit"
```

---

### Task 16: Image Migration Script

**Files:**
- Create: `scripts/migrate-images.ts`

- [ ] **Step 1: Create migration script**

```typescript
/**
 * One-time migration: Move product images from public/images/products/
 * to Supabase Storage bucket "product-images".
 *
 * Usage: npx tsx scripts/migrate-images.ts
 *
 * Prerequisites:
 * - .env.local must have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY
 * - Supabase Storage bucket "product-images" must exist (public)
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SECRET_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)
const BUCKET = 'product-images'
const PUBLIC_DIR = join(process.cwd(), 'public')

async function main() {
  console.log('Fetching all products...')
  const { data: products, error } = await supabase
    .from('products')
    .select('id, slug, images')

  if (error || !products) {
    console.error('Failed to fetch products:', error)
    process.exit(1)
  }

  console.log(`Found ${products.length} products`)

  for (const product of products) {
    const images = (product.images as Array<{ url: string; alt: string; sort_order: number }>) || []

    if (images.length === 0) {
      console.log(`  [${product.slug}] No images, skipping`)
      continue
    }

    const updatedImages: typeof images = []
    let changed = false

    for (const img of images) {
      // Only migrate local images
      if (!img.url.startsWith('/images/')) {
        updatedImages.push(img)
        continue
      }

      const localPath = join(PUBLIC_DIR, img.url)
      if (!existsSync(localPath)) {
        console.warn(`  [${product.slug}] File not found: ${img.url}`)
        updatedImages.push(img)
        continue
      }

      const fileBuffer = readFileSync(localPath)
      const ext = img.url.split('.').pop() || 'jpg'
      const filename = `${img.sort_order + 1}.${ext}`
      const storagePath = `${product.slug}/${filename}`

      console.log(`  [${product.slug}] Uploading ${img.url} → ${storagePath}`)

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, fileBuffer, {
          contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
          upsert: true,
        })

      if (uploadError) {
        console.error(`  [${product.slug}] Upload failed: ${uploadError.message}`)
        updatedImages.push(img)
        continue
      }

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(storagePath)

      updatedImages.push({
        ...img,
        url: publicUrl,
      })
      changed = true
    }

    if (changed) {
      console.log(`  [${product.slug}] Updating DB with new URLs...`)
      const { error: updateError } = await supabase
        .from('products')
        .update({ images: updatedImages as any })
        .eq('id', product.id)

      if (updateError) {
        console.error(`  [${product.slug}] DB update failed: ${updateError.message}`)
      } else {
        console.log(`  [${product.slug}] Done ✓`)
      }
    } else {
      console.log(`  [${product.slug}] No local images to migrate`)
    }
  }

  console.log('\nMigration complete!')
  console.log('After verifying all images load correctly, you can remove public/images/products/')
}

main()
```

- [ ] **Step 2: Run the migration**

```bash
npx tsx scripts/migrate-images.ts
```

Expected: Each product's local images uploaded to Storage, DB URLs updated.

- [ ] **Step 3: Verify images load**

1. `pnpm dev` → Visit homepage → All product images should load from Supabase Storage URLs
2. Visit a product detail page → All images load correctly
3. Check `/admin/products` → Thumbnails load

- [ ] **Step 4: Commit**

```bash
git add scripts/migrate-images.ts
git commit -m "feat: add one-time image migration script (public/ → Supabase Storage)"
```

---

### Task 17: Final Verification & Cleanup

- [ ] **Step 1: Full build check**

```bash
pnpm build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Lint check**

```bash
pnpm lint
```

Fix any lint errors.

- [ ] **Step 3: End-to-end manual test**

1. **Auth flow:** Register → Login → Logout → Google OAuth → LINE OAuth
2. **Header states:** Logged out → icon. Logged in → avatar menu. Admin → 後台管理 link.
3. **Admin product list:** View all products, toggle active, click edit, click delete with confirmation
4. **Create product:** Fill full form with images → save → appears in list and homepage
5. **Edit product:** Modify fields → save → changes reflected
6. **Image upload:** Upload, reorder via drag, delete → all work
7. **Product images:** All images load from Supabase Storage URLs (no broken images)

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: final cleanup and lint fixes for auth + admin CRUD + storage"
```
