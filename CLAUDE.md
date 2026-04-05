# CLAUDE.md - MS. CHING 專案指南

## 專案概述

MS. CHING (蜜絲晴烘焙手作坊) — 個人手作烘焙品牌官網，已上線並被 Google 索引。
網域：<https://msching.com>

## 技術棧

- **框架：** Next.js 16.2 App Router + TypeScript
- **UI：** shadcn/ui (Base UI / Base Nova) + Tailwind CSS 4（@theme inline、Sandrift 色系）
- **圖示：** lucide-react
- **字型：** Noto Sans TC (Google Fonts)
- **套件管理：** pnpm 10
- **Node.js：** 22（透過 .nvmrc 指定）
- **ESLint：** 9（flat config）

## 指令

```bash
pnpm dev          # 開發伺服器（Turbopack）
pnpm build        # 正式環境建置
pnpm start        # 啟動正式伺服器
pnpm lint         # ESLint 檢查
pnpm db:types     # 從 Supabase 產生 TypeScript 型別
pnpm db:studio    # 開啟 Supabase Dashboard
```

### Supabase Migration

```bash
supabase migration new <name>   # 建立新 migration（自動時間戳檔名）
supabase db push                # 推送未執行的 migration 到遠端
supabase migration list         # 查看 local/remote 同步狀態
```

Migration 由 Supabase CLI 管理，追蹤表在 `supabase_migrations.schema_migrations`。
**不要手動在 SQL Editor 執行 migration 檔案**，用 `supabase db push` 確保追蹤記錄正確。

## 專案結構

```text
app/
  layout.tsx                   # 根佈局（metadata、字型，不含 Header/Footer）
  globals.css                  # Tailwind 4 + Sandrift 主題 + 動畫
  (store)/                     # 前台 route group（URL 不受影響）
    layout.tsx                 # 前台佈局（ClientLayout + StoreCta）
    page.tsx                   # 首頁 — SSR 產品列表 + Hero 標語
    products/[slug]/page.tsx   # 產品詳情（SSR + generateMetadata SEO）
    about/page.tsx             # 關於我們
    faq/page.tsx               # 訂購 Q&A（手風琴問答）
    terms/page.tsx             # 購買須知
    service-and-return-terms/page.tsx  # 服務條款及退換貨
    news/activities/page.tsx   # 活動列表
    order/[slug]/page.tsx      # 訂單確認
    account/page.tsx           # 登入/註冊（Email + Google OAuth + LINE Login）
    coming-soon/page.tsx       # 即將推出
    cart/page.tsx              # 購物車（佔位）
  (admin)/                     # 後台 route group
    admin/
      layout.tsx               # 後台佈局（Sidebar + Topbar，noindex）
      page.tsx                 # Dashboard（統計卡片空殼）
      products/page.tsx        # 商品列表（讀取 JSON，待接 Supabase）
      orders/page.tsx          # 訂單管理（空殼，待接金流）
  auth/
    callback/route.ts          # OAuth 回調（Google PKCE + LINE magic link token）
  api/
    health/route.ts            # GET /api/health
    products/route.ts          # GET /api/products
    products/[key]/route.ts    # GET /api/products/:key（含 key 白名單驗證）
    auth/line/route.ts         # GET /api/auth/line — 發起 LINE Login 授權
    auth/line/callback/route.ts # GET /api/auth/line/callback — LINE 回調處理
components/
  layout/                      # Header、Footer、MobileMenu、ClientLayout、BackToTop
  admin/                       # AdminSidebar、AdminHeader
  products/                    # 骨架屏、訂購提示、ProductDetailContent（Client）
  ui/                          # shadcn/ui 元件
  banner-carousel.tsx          # 首頁輪播
  home-content.tsx             # 首頁互動部分（分類 tabs、搜尋、產品 grid）
  product-card.tsx             # 產品卡片（tag、原價、alias）
  product-search.tsx           # 搜尋列
  store-cta.tsx                # 手機版 Sticky CTA 按鈕
  highlighted-text.tsx         # 文字標記解析
  no-products-found.tsx        # 空狀態提示
hooks/
  use-products.ts              # useProducts()（前台已改 SSR，此 hook 保留供其他用途）
  use-helpers.ts               # formatTimestampToDateRange()
  use-order-template.ts        # 訂購模板產生 + 複製剪貼簿
  use-swipe.ts                 # 觸控滑動手勢
lib/
  constants.ts                 # 網站常數、社群連結
  menus.ts                     # 導覽列選單結構（4 項扁平連結）
  utils.ts                     # cn() 工具函式
  supabase/
    client.ts                  # createBrowserClient（Client Component 用）
    server.ts                  # createServerClient（Server Component / Action 用）
    middleware.ts              # updateSession + /admin 路由保護
    admin.ts                   # service_role client（繞過 RLS，server-only）
    queries.ts                 # 資料存取層（getProducts, getProductBySlug, getAllProducts）
    types.ts                   # supabase gen types 自動產生的型別
  env.ts                       # 環境變數驗證（啟動時檢查必要 env var）
types/index.ts                 # TypeScript 型別（ProductInfo、ProductDetail、Category 等）
supabase/
  config.toml                  # Supabase CLI 設定
  migrations/                  # DB migration 檔案（由 CLI 管理，勿手動執行）
public/
  json/                        # 產品資料（productsList.json、productDetails/*.json）
  images/                      # 所有靜態圖片
  favicon.ico                  # 品牌 favicon
docs/
  audit-checklist.md           # 業界標準審查清單（安全/SEO/WCAG/UX/效能）
  testing-checklist.md         # Phase 1 測試驗證計劃
```

## API 端點

- `GET /api/health` — 健康檢查（回傳 status + timestamp）
- `GET /api/products` — 全部商品列表（從 Supabase DB 讀取）
- `GET /api/products/[key]` — 單一商品詳情（從 Supabase DB 讀取）
- `GET /api/cron/keep-alive` — Supabase 防休眠（需 CRON_SECRET）
- `GET /api/auth/line` — 發起 LINE Login 授權重導向
- `GET /api/auth/line/callback` — LINE OAuth 回調（token 交換 + 建立用戶）

## 架構決策

- 前後台以 Route Group `(store)` / `(admin)` 分離，各自擁有獨立 layout
- 首頁和產品頁為 Server Component（SSR），互動部分抽成 Client 子元件
- 產品資料存放於 Supabase PostgreSQL，透過 `lib/supabase/queries.ts` 統一存取
- 商品可見性由 DB 的 `is_active` 欄位控制（後台上下架）
- Middleware 處理 auth session 刷新 + /admin 路由保護（需 admin role）
- 色彩模式鎖定為淺色（Sandrift 品牌色系）
- 行動優先響應式設計，手機版有 sticky CTA 按鈕
- Admin 後台使用中性色調，`robots: noindex` 防止被搜尋引擎索引

## 認證架構

三種登入方式，用戶統一管理在 Supabase Auth：

| 方式   | 流程                     | 說明                                                                       |
| ------ | ------------------------ | -------------------------------------------------------------------------- |
| Email  | Supabase Auth 原生       | `signInWithPassword` / `signUp`                                            |
| Google | Supabase OAuth Provider  | `signInWithOAuth({ provider: 'google' })`                                  |
| LINE   | **自訂 API route**       | 繞過 Supabase Custom OIDC（LINE 用 HS256 簽 ID token，Supabase 不支援）    |

### LINE Login 流程（自訂）

```text
用戶點按鈕 → /api/auth/line（組 LINE 授權 URL + CSRF state）
  → LINE 授權頁 → 用戶同意
  → /api/auth/line/callback（交換 token → 取 profile → Admin API 建立用戶 → 產生 magic link）
  → /auth/callback?token_hash=...（verifyOtp 建立 session）
  → 首頁（已登入）
```

**環境變數：** `LINE_CHANNEL_ID`、`LINE_CHANNEL_SECRET`（從 LINE Developers Console 取得）
**LINE Callback URL 設定：** `{SITE_URL}/api/auth/line/callback`（設在 LINE Developers Console）

## SEO

- `metadata` export 在每個頁面設定 title/description
- 根 layout 設定 OG tags、Twitter Card、favicon、apple-touch-icon
- `metadataBase` 指向 <https://msching.com>
- 待建立：sitemap.xml、robots.txt

## 待實作功能

- 購物車功能（目前佔位頁面）
- 個人資訊頁（登入後可查看/編輯 profile、補填 email）
- sitemap.xml / robots.txt
- CI/CD 部署流程（已移除舊 NuxtHub workflow）

## 慣例

- 使用者介面內容使用繁體中文
- 產品 key 和檔名使用 camelCase
- 元件使用 default export
- hooks 命名為 `use-xxx.ts`（kebab-case）
- `@/` 路徑別名指向專案根目錄（無 src/）
- 所有 `<img>` 應使用 `next/image` 的 `<Image>` 元件
