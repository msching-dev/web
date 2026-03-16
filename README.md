# MS. CHING 蜜絲晴烘焙手作坊

> 入口即是愛的滋味 — 個人手作烘焙品牌官網

**線上網站：** [https://msching.com](https://msching.com)

## 技術棧

| 層級 | 技術 |
| ---- | ---- |
| 框架 | Nuxt 3 (Vue 3.5) + TypeScript |
| UI | shadcn-vue + Nuxt UI + Tailwind CSS |
| 圖示 | lucide-vue-next |
| 狀態管理 | Pinia + Vue useState |
| 圖片 | @nuxt/image (avif, webp, png) |
| 部署 | Cloudflare Pages via NuxtHub |
| CI/CD | GitHub Actions |
| 套件管理 | pnpm 9.0.4 |

## 快速開始

```bash
pnpm install    # 安裝依賴
pnpm dev        # 開發伺服器 http://localhost:3000
pnpm build      # 正式環境建置
pnpm preview    # 預覽正式建置
```

## 專案結構

```text
├── app.vue                     # 根元件（行動選單、頁首/頁尾、轉場動畫）
├── pages/
│   ├── index.vue               # 首頁 - 產品列表、分類頁籤、搜尋
│   ├── products/[slug].vue     # 產品詳情頁
│   ├── coming-soon.vue         # 即將推出
│   ├── account/index.vue       # 登入 / 註冊
│   └── ...                     # about、cart、faq、news、terms（佔位）
├── components/
│   ├── general/                # 頁首、頁尾、Logo、選單、橫幅
│   ├── products/               # 骨架屏、訂購提示
│   ├── forms/                  # 登入註冊表單、密碼輸入
│   ├── buttons/                # LINE / Google 登入按鈕
│   ├── ui/                     # shadcn-vue 元件
│   ├── BannerCarousel.vue      # 首頁輪播
│   ├── ProductCard.vue         # 產品卡片
│   └── ProductSearch.vue       # 搜尋列
├── composables/                # useProducts、useSearch、useHelpers、useOrderTemplate
├── server/api/                 # Nitro API：/health、/products、/products/[key]
├── config/                     # 分類列舉
├── utils/                      # 社群連結、選單結構
├── types/                      # TypeScript 型別定義
└── public/
    ├── json/                   # 產品資料（靜態 JSON）
    └── images/                 # 所有靜態素材
```

## 功能

- 產品列表與分類篩選（熱門 / 餅乾 / 瑪德蓮 / 節慶）
- 產品搜尋（前端篩選）
- 產品詳情：圖片輪播、規格、營養標示
- LINE 訂購表單模板（支援剪貼簿複製）
- 行動優先響應式設計
- 社群媒體整合（Instagram、LINE 官方帳號）
- 登入介面（LINE、Google、信箱）
- 頁面轉場動畫

## 資料架構

產品資料以靜態 JSON 檔存放於 `public/json/`，透過 Nitro API 路由提供服務，產品頁面使用 SWR 快取（1 小時）。首頁已預渲染以利 SEO。

## 部署

推送至任何分支時，GitHub Actions 自動部署：

- `main` 分支 → 正式環境
- 其他分支 → 預覽環境

透過 NuxtHub 部署至 Cloudflare Pages。

## SEO

- 已設定 Open Graph meta 標籤
- 首頁預渲染
- 已上線，Google 已索引
