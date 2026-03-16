# MS. CHING 蜜絲晴烘焙手作坊

> 入口即是愛的滋味 — 個人手作烘焙品牌官網

**線上網站：** [https://msching.com](https://msching.com)

## 技術棧

| 層級 | 技術 |
| ---- | ---- |
| 框架 | Next.js 16 App Router + TypeScript |
| UI | shadcn/ui (Radix) + Tailwind CSS 4 |
| 圖示 | lucide-react |
| 字型 | Noto Sans TC |
| 套件管理 | pnpm |
| Node.js | 22 (.nvmrc) |

## 快速開始

```bash
nvm use             # 切換到 Node 22
pnpm install        # 安裝依賴
pnpm dev            # 開發伺服器（Turbopack）
pnpm build          # 正式環境建置
pnpm start          # 啟動正式伺服器
```

## 專案結構

```text
src/
├── app/                        # Next.js App Router 頁面
│   ├── page.tsx                # 首頁 - 產品列表、分類、搜尋
│   ├── products/[slug]/        # 產品詳情頁
│   ├── about/                  # 關於我們
│   ├── faq/                    # 訂購 Q&A
│   ├── terms/                  # 購買須知
│   ├── service-and-return-terms/ # 服務條款及退換貨
│   ├── news/activities/        # 活動列表
│   ├── order/[slug]/           # 訂單確認
│   ├── account/                # 登入/註冊
│   └── api/                    # API Routes（產品資料）
├── components/
│   ├── layout/                 # Header、Footer、MobileMenu、Banner
│   ├── products/               # 骨架屏、訂購提示
│   ├── ui/                     # shadcn/ui 元件
│   └── ...                     # 輪播、產品卡片、搜尋列
├── hooks/                      # React Hooks
├── lib/                        # 工具函式、常數、選單
├── types/                      # TypeScript 型別
└── config/                     # 列舉設定
public/
├── json/                       # 產品資料（靜態 JSON）
└── images/                     # 所有靜態素材
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

產品資料以靜態 JSON 檔存放於 `public/json/`，透過 Next.js API Routes 提供服務。首頁靜態生成以利 SEO。

## SEO

- Open Graph / Twitter Card meta 標籤
- 靜態頁面預渲染
- 已上線，Google 已索引
