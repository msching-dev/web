# CLAUDE.md - MS. CHING 專案指南

## 專案概述

MS. CHING (蜜絲晴烘焙手作坊) — 個人手作烘焙品牌官網，已上線並被 Google 索引。
網域：<https://msching.com>

## 技術棧

- **框架：** Nuxt 3 (Vue 3.5) + TypeScript
- **UI：** shadcn-vue + Nuxt UI + Tailwind CSS（Sandrift 色系）
- **圖示：** lucide-vue-next
- **狀態管理：** Pinia（已安裝）+ Vue useState composables
- **圖片：** @nuxt/image（avif, webp, png）
- **部署：** Cloudflare Pages via NuxtHub（project-key: msching-web-zlg4）
- **套件管理：** pnpm 9.0.4
- **CI/CD：** GitHub Actions -> NuxtHub 自動部署

## 指令

```bash
pnpm dev        # 開發伺服器 http://localhost:3000
pnpm build      # 正式環境建置（Cloudflare Pages preset）
pnpm preview    # 預覽正式建置
pnpm generate   # 靜態生成
```

## 專案結構

```text
app.vue                  # 根元件：行動選單、頁首/頁尾、頁面轉場
layouts/default.vue      # 預設佈局（含 TopMask 裝飾）
pages/
  index.vue              # 首頁 - 產品列表、分類頁籤、搜尋
  products/[slug].vue    # 產品詳情（輪播、規格、營養標示）
  coming-soon.vue        # 即將推出頁面
  about.vue              # 關於我們（佔位）
  cart.vue               # 購物車（佔位）
  faq.vue                # 常見問題（佔位）
  news.vue               # 最新消息（佔位）
  terms.vue              # 購買須知（佔位）
  account/index.vue      # 登入/註冊（LINE、Google、信箱）
components/
  general/               # 頁首、頁尾、Logo、選單、橫幅、麵包屑
  products/              # 產品列表骨架屏、產品詳情骨架屏、訂購提示
  forms/                 # 登入註冊表單、密碼輸入
  buttons/               # LINE 登入按鈕、Google 登入按鈕
  ui/                    # shadcn-vue 元件：breadcrumb、tabs、collapsible、skeleton
  BannerCarousel.vue     # 首頁輪播
  ProductCard.vue        # 產品卡片（含光澤效果）
  ProductSearch.vue      # 搜尋列
composables/
  useProducts.ts         # 產品取得、篩選、分類管理
  useSearch.ts           # 搜尋查詢狀態
  useHelpers.ts          # 選單切換、捲動、body class 工具
  useOrderTemplate.ts    # LINE 訂購表單模板 + 剪貼簿
  useTailwindBreakpoints.ts  # 響應式斷點
  useAuth.ts             # 驗證（佔位）
server/api/
  health.ts              # GET /api/health
  products.ts            # GET /api/products（從 JSON 檔讀取）
  products/[key].ts      # GET /api/products/:key
config/enum.ts           # 分類列舉（熱門、餅乾、瑪德蓮、節慶）
utils/
  const.ts               # 社群媒體連結（Instagram、LINE）
  menus.ts               # 導覽列選單結構
types/index.d.ts         # ProductInfo、ProductDetail、Descriptions 等型別
public/json/             # 產品資料（productsList.json、productDetails/*.json）
public/images/           # 所有靜態圖片（產品、橫幅、圖示）
```

## 架構決策

- 產品資料以靜態 JSON 存放於 `public/json/`，透過 Nitro API 路由提供
- 產品路由使用 SWR（stale-while-revalidate）快取 3600 秒
- 首頁預渲染（`routeRules: { '/': { prerender: true } }`）
- 自訂路由對應：`/products/:productSlug` -> `pages/products/[slug].vue`
- 色彩模式鎖定為淺色
- 行動優先響應式設計

## SEO

- 首頁和即將推出頁面使用 `useSeoMeta()` 設定 meta 標籤
- 已設定 OG 標籤（標題、描述、圖片、網址）
- 尚未建立 sitemap.xml 和 robots.txt
- 已上線，Google 已索引

## 目前狀態

- **已完成：** 產品列表、分類篩選、搜尋、產品詳情、響應式佈局、輪播
- **佔位/隱藏：** 購物車、帳號、最新消息、常見問題、購買須知、關於我們
- **隱藏產品：** matchaMadeleine、cranBerryMadeleine、thaiAndChocolateMadeleine、earlGreyTeaAndHoneyLemonMadeleine、quartetMadeleine

## 慣例

- 使用者介面內容使用繁體中文
- 產品 key 和檔名使用 camelCase
- 元件自動匯入，無路徑前綴
- `config/` 目錄下的設定檔透過 Nuxt imports 自動匯入
