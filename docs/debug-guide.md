# SSR + Supabase Debug 指南

> 給習慣 SPA/CSR 的開發者——你熟的部分跳過，專注 SSR 不同的地方。

---

## 心智模型：CSR vs SSR 的差異

CSR 的世界你很熟：所有程式碼都跑在瀏覽器，DevTools Network tab 看得到每一個 API call，Console 看得到每一個 log。

SSR 的世界分兩半：

```
瀏覽器（Client）                    Node.js Server
┌──────────────────┐              ┌──────────────────┐
│ Client Components │              │ Server Components │
│ 'use client'      │              │ 沒有 'use client' │
│                   │              │                   │
│ ✅ DevTools 看得到 │              │ ❌ DevTools 看不到 │
│ ✅ console.log    │              │ ✅ 終端機 console  │
│    出現在瀏覽器    │              │    出現在 pnpm dev │
│ ✅ Network tab    │              │ ❌ 沒有 Network    │
│    看 fetch       │              │    fetch 在 server │
│                   │              │                   │
│ 像你熟的 SPA      │              │ 這是新的部分 ⬅️    │
└──────────────────┘              └──────────────────┘
```

**一句話：Server Component 的 console.log 在終端機、不在瀏覽器。**

---

## 基本功

### 1. console.log 位置對照

| 你寫 log 的地方 | 出現在哪裡 |
|----------------|-----------|
| Server Component（`page.tsx` 無 `'use client'`）| `pnpm dev` 的終端機 |
| Client Component（`'use client'`）| 瀏覽器 DevTools Console |
| API Route（`app/api/*/route.ts`）| `pnpm dev` 的終端機 |
| Middleware（`middleware.ts`）| `pnpm dev` 的終端機 |
| `lib/supabase/queries.ts` | `pnpm dev` 的終端機（被 Server Component 呼叫）|

```tsx
// app/(store)/page.tsx — Server Component
export default async function HomePage() {
  const products = await getProducts()
  console.log('📦 products:', products.length)  // ← 終端機
  console.log('📦 first:', products[0]?.name)   // ← 終端機
  return <div>...</div>
}
```

```tsx
// components/home-content.tsx — Client Component
'use client'
export default function HomeContent({ products }) {
  console.log('🎨 render products:', products.length)  // ← 瀏覽器 Console
  return <div>...</div>
}
```

### 2. Server Component 的錯誤在哪

CSR 錯誤你習慣看瀏覽器紅字。SSR 不一樣：

- **編譯錯誤**：終端機紅字，跟 webpack/vite 一樣
- **Runtime 錯誤**：終端機 + 瀏覽器都會顯示（Next.js 的 error overlay）
- **靜默失敗**：Supabase query 回傳 `{ data: null, error: {...} }` 但你沒檢查 error → 頁面空白但沒有錯誤。**這是最常踩的坑**

```tsx
// ❌ 危險：error 被忽略
const { data } = await supabase.from('products').select('*')

// ✅ 安全：明確處理 error
const { data, error } = await supabase.from('products').select('*')
if (error) {
  console.error('DB error:', error.message, error.details)
}
```

### 3. 快速驗證 Supabase 連線

```bash
# 終端機直接測 REST API（不經過 Next.js）
curl -s \
  -H "apikey: YOUR_PUBLISHABLE_KEY" \
  "https://xxx.supabase.co/rest/v1/products?select=name,price&limit=3" \
  | python3 -m json.tool
```

如果這個 curl 有資料但 Next.js 頁面空白 → 問題在你的程式碼
如果 curl 也沒資料 → 問題在 Supabase（RLS 或資料）

---

## Supabase 專屬 Debug

### 4. 看 DB 資料的三種方式

**方式 A：Dashboard Table Editor（最直覺）**
```bash
pnpm db:studio  # 打開 Supabase Dashboard
```
左側選表 → 直接看資料、篩選、修改。像 phpMyAdmin。

**方式 B：SQL Editor（靈活查詢）**
Dashboard → SQL Editor，跑任意 SQL：
```sql
-- 查所有上架商品
SELECT name, price, is_active, tags FROM products WHERE is_active = true;

-- 查某張訂單的明細
SELECT o.order_number, oi.product_name, oi.quantity, oi.product_price
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
WHERE o.order_number = 'MS-20260401-001';

-- 看 RLS policy 列表
SELECT * FROM pg_policies WHERE tablename = 'products';
```

**方式 C：暫時 Debug API（開發中用完記得刪）**
```tsx
// app/api/debug/route.ts
import { getProducts } from '@/lib/supabase/queries'
export async function GET() {
  const products = await getProducts()
  return Response.json({ count: products.length, products })
}
```
瀏覽器打 `localhost:3000/api/debug` → 看完整 JSON

### 5. RLS 問題排查

**症狀：** DB 裡有資料，但前端讀出空陣列

**排查流程：**

```
Step 1: 用 admin client 讀（繞過 RLS）
┌─────────────────────────────────────────────┐
│ import { supabaseAdmin } from '@/lib/supabase/admin'
│ const { data } = await supabaseAdmin
│   .from('products').select('*')
│ console.log('admin sees:', data?.length)
└─────────────────────────────────────────────┘
  ↓ admin 讀得到 → RLS 在擋
  ↓ admin 也讀不到 → 表名打錯或資料不存在

Step 2: 確認 RLS policy
┌─────────────────────────────────────────────┐
│ SQL Editor:
│ SELECT policyname, cmd, qual
│ FROM pg_policies WHERE tablename = 'products';
└─────────────────────────────────────────────┘
  看 FOR SELECT 的 policy 條件是不是太嚴

Step 3: 確認 auth 狀態
┌─────────────────────────────────────────────┐
│ const supabase = await createClient()
│ const { data: { user } } = await supabase.auth.getUser()
│ console.log('user:', user?.email, user?.app_metadata)
│ // user = null → 未登入，走 anon policy
│ // user 有值 → 走 authenticated policy
└─────────────────────────────────────────────┘
```

**常見 RLS 坑：**

| 問題 | 原因 | 解法 |
|------|------|------|
| 匿名讀不到 products | policy 條件沒加 `is_active = true` 的 public read | 檢查 `products_public_read` policy |
| 登入後讀不到自己的訂單 | `customers.auth_id` 沒綁定 | 確認 trigger 有跑或手動設 auth_id |
| admin 看不到下架商品 | admin policy 的 `auth.jwt() ->> 'role'` 沒 match | 確認 user 的 app_metadata.role = 'admin' |

### 6. Auth Session Debug

```tsx
// 在任何 Server Component 或 API Route 裡
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
const { data: { user }, error } = await supabase.auth.getUser()

console.log('Auth state:', {
  isLoggedIn: !!user,
  email: user?.email,
  role: user?.app_metadata?.role,  // 'admin' or undefined
  id: user?.id,
  error: error?.message,
})
```

**注意：永遠用 `getUser()` 不用 `getSession()`**
`getSession()` 不驗證 cookie 真實性，可被偽造。`getUser()` 每次都打 Supabase Auth server 驗證。

---

## 進階技巧

### 7. Supabase query 的 select 語法

你最常用的查詢模式：

```tsx
// 基本 select
const { data } = await supabase
  .from('products')
  .select('name, price, is_active')

// 關聯查詢（JOIN）— 用 table_name(columns) 語法
const { data } = await supabase
  .from('products')
  .select('name, price, categories(name, slug)')
  // 自動 JOIN categories 表，回傳 { name, price, categories: { name, slug } }

// 篩選
.eq('is_active', true)          // WHERE is_active = true
.neq('status', 'cancelled')     // WHERE status != 'cancelled'
.gt('price', 100)               // WHERE price > 100
.in('status', ['paid', 'preparing'])  // WHERE status IN (...)
.contains('tags', ['hot'])      // WHERE tags @> ARRAY['hot']（陣列包含）
.ilike('name', '%瑪德蓮%')      // WHERE name ILIKE '%瑪德蓮%'（模糊搜尋）

// 排序 + 分頁
.order('created_at', { ascending: false })
.range(0, 9)                    // OFFSET 0 LIMIT 10

// 單筆
.single()                       // 預期只有一筆，回傳物件不是陣列
```

### 8. 看 Supabase 實際發了什麼 SQL

Dashboard → **Logs → Postgres** → 可以看到每一個 query 的實際 SQL、執行時間、是否成功。

篩選 `severity = ERROR` 可以快速找到失敗的查詢。

### 9. Next.js SSR 的快取行為

**CSR 裡不存在的問題：SSR 有 cache**

Next.js 14+ 的 `fetch` 預設會快取結果。但 Supabase JS Client 不走 `fetch`（走 PostgREST），所以不受 Next.js 的 fetch cache 影響。

但 **整個 page 可能被 SSG**（Static Site Generation）快取：
- 如果你的 Server Component 沒有使用 `cookies()`、`headers()` 等動態函數，Next.js 會在 build 時把它變成靜態頁面
- `createClient()` 內部有用 `cookies()` → 自動變成動態渲染 → 不會被快取

如果你發現資料更新了但頁面沒變：
```tsx
// 強制動態渲染（不太需要，因為 Supabase client 已經用了 cookies）
export const dynamic = 'force-dynamic'
```

### 10. 開發時的 hot reload 行為

Turbopack（`pnpm dev`）的 hot reload：

- **Client Component 改了** → 瀏覽器自動更新（跟 SPA 一樣的 HMR）
- **Server Component 改了** → 自動重新 server render，瀏覽器 full reload
- **`lib/supabase/*.ts` 改了** → 需要等一下，server 會重新載入模組
- **`.env.local` 改了** → 必須重啟 `pnpm dev`（環境變數不會 hot reload）

---

## 問題排查清單

### 頁面空白

```
1. 終端機有 error 嗎？ → 讀錯誤訊息
2. console.log 資料有嗎？ → 加 log 確認
3. Supabase 有資料嗎？ → pnpm db:studio 去看
4. RLS 擋了嗎？ → 用 supabaseAdmin 測試
5. 型別轉換對嗎？ → console.log 原始 DB response
```

### Supabase 連不上

```
1. .env.local 的 URL 和 KEY 正確嗎？
2. Supabase project 是不是被 pause 了？（免費方案一週沒 request 會暫停）
   → Dashboard 看 project 狀態
3. 網路問題？ → curl 直接打 Supabase URL 測試
```

### 部署到 Vercel 後壞了

```
1. Vercel 環境變數設了嗎？（Settings → Environment Variables）
2. 環境變數名稱一致嗎？（NEXT_PUBLIC_ 開頭的才會到 client）
3. Build log 有 error 嗎？
4. Vercel Logs（Runtime）看 server-side error
```

---

## 常用指令速查

```bash
pnpm dev              # 開發伺服器（看 server-side log 就是這裡）
pnpm build            # 正式建置（會跑完整型別檢查）
pnpm db:types         # 從 DB 重新產生 TypeScript 型別
pnpm db:studio        # 打開 Supabase Dashboard
```
