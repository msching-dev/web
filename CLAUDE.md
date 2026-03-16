# CLAUDE.md - MS. CHING 專案指南

## 專案概述

MS. CHING (蜜絲晴烘焙手作坊) — 個人手作烘焙品牌官網，已上線並被 Google 索引。
網域：<https://msching.com>

## 技術棧

- **框架：** Next.js 16 App Router + TypeScript
- **UI：** shadcn/ui (Base UI / Base Nova) + Tailwind CSS 4（@theme inline、Sandrift 色系）
- **圖示：** lucide-react
- **字型：** Noto Sans TC (Google Fonts)
- **套件管理：** pnpm 10
- **Node.js：** 22（透過 .nvmrc 指定）
- **ESLint：** 9（flat config）

## 指令

```bash
pnpm dev        # 開發伺服器（Turbopack）
pnpm build      # 正式環境建置
pnpm start      # 啟動正式伺服器
pnpm lint       # ESLint 檢查
```

## 專案結構

```text
src/
  app/
    layout.tsx                 # 根佈局（metadata、字型、ClientLayout）
    page.tsx                   # 首頁 — 產品列表、分類頁籤、搜尋
    globals.css                # Tailwind 4 + Sandrift 主題 + 動畫
    products/[slug]/page.tsx   # 產品詳情頁
    about/page.tsx             # 關於我們
    faq/page.tsx               # 訂購 Q&A（手風琴問答）
    terms/page.tsx             # 購買須知
    service-and-return-terms/page.tsx  # 服務條款及退換貨
    news/activities/page.tsx   # 活動列表
    order/[slug]/page.tsx      # 訂單確認
    account/page.tsx           # 登入/註冊（UI 佔位，無後端）
    coming-soon/page.tsx       # 即將推出
    cart/page.tsx              # 購物車（佔位）
    api/
      health/route.ts          # GET /api/health
      products/route.ts        # GET /api/products
      products/[key]/route.ts  # GET /api/products/:key（含 key 白名單驗證）
  components/
    layout/                    # Header、Footer、MobileMenu、ClientLayout、BackToTop
    products/                  # 骨架屏（list/detail）、訂購提示
    ui/                        # shadcn/ui 元件（button、accordion、tabs、breadcrumb、collapsible、skeleton）
    banner-carousel.tsx        # 首頁輪播
    product-card.tsx           # 產品卡片（tag、原價、alias）
    product-search.tsx         # 搜尋列
    highlighted-text.tsx       # 文字標記解析
    no-products-found.tsx      # 空狀態提示
  hooks/
    use-products.ts            # useProducts()、useProductDetail()
    use-helpers.ts             # formatTimestampToDateRange()
    use-order-template.ts      # 訂購模板產生 + 複製剪貼簿
  lib/
    constants.ts               # 網站常數、社群連結
    menus.ts                   # 導覽列選單結構
    utils.ts                   # cn() 工具函式
  types/index.ts               # TypeScript 型別（ProductInfo、ProductDetail、Category 等）
public/
  json/                        # 產品資料（productsList.json、productDetails/*.json）
  images/                      # 所有靜態圖片
  favicon.ico                  # 品牌 favicon
```

## API 端點

- `GET /api/health` — 健康檢查（回傳 status + timestamp）
- `GET /api/products` — 全部商品列表（讀取 productsList.json）
- `GET /api/products/[key]` — 單一商品詳情（白名單驗證 key，防路徑遍歷）

## 架構決策

- 產品資料以靜態 JSON 存放於 `public/json/`，透過 API Routes 提供
- 首頁使用 `useSearchParams` + `Suspense` 處理分類篩選
- 色彩模式鎖定為淺色（Sandrift 品牌色系）
- 行動優先響應式設計
- Server Components 用於靜態頁面，Client Components 用於互動功能
- `use-products.ts` 中的 `hideProductKeys` 控制商品可見性

## SEO

- `metadata` export 在每個頁面設定 title/description
- 根 layout 設定 OG tags、Twitter Card、favicon、apple-touch-icon
- `metadataBase` 指向 <https://msching.com>
- 待建立：sitemap.xml、robots.txt

## 待實作功能

- 購物車功能（目前佔位頁面）
- 登入/註冊後端（UI 已完成，LINE Login / Google Login 按鈕已 UI 佔位）
- sitemap.xml / robots.txt
- CI/CD 部署流程（已移除舊 NuxtHub workflow）

## 慣例

- 使用者介面內容使用繁體中文
- 產品 key 和檔名使用 camelCase
- 元件使用 default export
- hooks 命名為 `use-xxx.ts`（kebab-case）
- `@/` 路徑別名指向 `src/`
- 所有 `<img>` 應使用 `next/image` 的 `<Image>` 元件
