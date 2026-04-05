# Auth + Admin CRUD + Supabase Storage 設計規格

> Phase 1 of MS. CHING 電商化：用戶認證、後台商品管理、圖片 Storage 遷移

## 總覽

三個子系統按依賴順序推進：

1. **認證系統** — Email/Password + Google + LINE 三種登入，軟驗證策略
2. **Admin 商品 CRUD** — 完整表單（含通用元件），Server Actions 寫入
3. **Supabase Storage** — 商品圖片遷移至 Storage，後台支援上傳管理

---

## 1. 認證系統

### 1.1 登入方式

| 方式 | Provider | 說明 |
|------|----------|------|
| Email/Password | Supabase Auth 內建 | `signUp()` / `signInWithPassword()` |
| Google | Supabase OAuth | Google Cloud Console 設定 OAuth credentials，Supabase Dashboard 啟用 |
| LINE | Supabase Custom OIDC | LINE Developers Console 建立 Login Channel，Supabase 設為 custom OIDC provider |

三種方式都走 PKCE flow，callback 統一由 Supabase 處理。

### 1.2 Auth Flow

```
用戶點登入 → /account 頁面
  ├─ Email/Password → signInWithPassword() / signUp()
  ├─ Google → signInWithOAuth({ provider: 'google' })
  └─ LINE → signInWithOAuth({ provider: 'line' })
       ↓
  Supabase callback → /auth/callback (Route Handler)
  交換 auth code → session → 寫入 cookie
       ↓
  Middleware 偵測 session
       ↓
  重導回原頁面（或首頁）
```

### 1.3 新增/修改檔案

| 檔案 | 說明 |
|------|------|
| `app/auth/callback/route.ts` | **新增** — OAuth callback handler，交換 code → session |
| `app/(store)/account/page.tsx` | **改造** — 接上 Supabase auth 呼叫，加 loading/error 狀態 |
| `hooks/use-auth.ts` | **新增** — 訂閱 `onAuthStateChange`，提供 user/session 給 client 元件 |
| `components/layout/header.tsx` | **改造** — 根據 session 顯示：未登入→登入按鈕 / 一般用戶→頭像+登出 / admin→頭像+後台管理按鈕 |
| `middleware.ts` | **微調** — 確保 session 刷新邏輯正確，admin 路由保護不變 |

### 1.4 用戶資料同步

OAuth/Email 註冊成功後：
- `auth.users` 由 Supabase 自動建立
- **DB trigger**（`on_auth_user_created`）：`auth.users INSERT` → 自動在 `customers` 表建立記錄，`auth_id` 綁定
- 前台透過 `customers` 表取得 profile 資料

需建立的 Supabase migration：
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.customers (auth_id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 1.5 軟驗證策略

- `email_confirmed_at IS NULL` = 未驗證
- 未驗證用戶**可以**：瀏覽、加購物車、管理帳戶
- 未驗證用戶**不能**：結帳（Phase 2 金流時才擋，本階段不實作）
- 社群登入（Google/LINE）的 email 自動視為已驗證

### 1.6 Admin 權限

- 不做 admin 自助註冊
- 手動在 Supabase Dashboard 設定 `app_metadata.role = 'admin'`
- Middleware 現有 `app_metadata.role === 'admin'` 檢查保持不變
- Header 用同樣的判斷顯示「後台管理」入口

---

## 2. Admin 商品 CRUD

### 2.1 路由結構

```
app/(admin)/admin/products/
  page.tsx              # 商品列表（改造：加操作按鈕）
  new/page.tsx          # 新增商品
  [id]/edit/page.tsx    # 編輯商品
  actions.ts            # Server Actions
```

### 2.2 商品列表改造

在現有列表加操作欄：
- **上架/下架 toggle** — 直接在列表切換 `is_active`，即時反映
- **編輯按鈕** → `/admin/products/[id]/edit`
- **刪除（Danger Zone）** — 確認 dialog，真刪除（含 Storage 圖片）

列表頂部加「新增商品」按鈕 → `/admin/products/new`

### 2.3 商品表單結構

新增和編輯共用同一組元件，差別在初始值和 submit action。

```
ProductForm（主表單容器）
│
├── 基本資訊區
│   ├── name (input)
│   ├── slug (input, 從 name auto-generate, 可手動修改)
│   ├── alias (input)
│   ├── price (number)
│   ├── compare_price (number, 選填)
│   ├── category_id (select, 從 categories 表讀取)
│   ├── tags (multi-select: hot/new/top_1/top_2/top_3/christmas)
│   ├── is_active (toggle)
│   └── is_featured (toggle)
│
├── 庫存與規格區
│   ├── stock_quantity (number)
│   ├── max_order_qty (number)
│   ├── min_order_qty (number)
│   ├── portion_size (number)
│   ├── include_size (input, e.g. "7片")
│   ├── unit (input, e.g. "包")
│   ├── shelf_life (input)
│   ├── storage_instructions (textarea)
│   └── allergens (input)
│
├── 商品描述區 — DynamicFieldEditor
│   └── 由 config array 驅動，目前 6 個欄位：
│       desc, nonAdditive, howToEat, preservationMethod, precautions, tastePeriod
│       （加欄位只需改 config，不改元件）
│
├── 規格區 — KeyValueListEditor
│   └── specifications: [{ key, value }] 動態新增/刪除
│
├── 營養標示區 — NutrientEditor
│   ├── 模式切換：一般商品 / 禮盒
│   ├── 一般：perServing[] + perHundred[]（各一個 KeyValueListEditor）
│   └── 禮盒：giftBox[{ taste, content[] }]（口味分組，每組內一個 KeyValueListEditor）
│
├── 圖片區 — ImageUploader
│   └── 拖曳上傳、排序、預覽、刪除（詳見 Section 3）
│
└── 操作區
    ├── 儲存
    └── 取消（返回列表）
```

### 2.4 通用元件

| 元件 | 職責 | 複用場景 |
|------|------|----------|
| `KeyValueListEditor` | 動態 key-value pairs 新增/刪除/排序 | specifications、nutrition perServing/perHundred、giftBox content |
| `NutrientEditor` | 包裝 KeyValueListEditor，處理三種營養模式 | 商品表單營養區 |
| `DynamicFieldEditor` | 根據 config array 渲染 input/textarea | 商品描述區，未來任何 JSONB 結構化欄位 |
| `ConfirmDialog` | Danger Zone 確認彈窗 | 刪除商品，未來刪除訂單等 |
| `ImageUploader` | 圖片上傳/排序/刪除（見 Section 3） | 商品表單圖片區 |

元件放置位置：`components/admin/` 目錄下。

### 2.5 Server Actions

```ts
// app/(admin)/admin/products/actions.ts
'use server'

export async function createProduct(formData: FormData)
export async function updateProduct(id: string, formData: FormData)
export async function toggleProductActive(id: string)
export async function deleteProduct(id: string) // 真刪除，含清除 Storage 圖片
```

每個 action 內部流程：
1. `getUser()` 驗證 admin 身份（不用 getSession）
2. Zod schema 驗證輸入
3. Admin client（bypass RLS）執行 DB 操作
4. `revalidatePath('/admin/products')` + `revalidatePath('/')` 刷新快取

### 2.6 驗證

定義 `productSchema`（Zod），server-side 與 client-side 共用：
- 必填：name, slug, price
- slug 格式：lowercase, hyphen-separated
- price > 0
- images array 最多 8 張
- JSONB 欄位做結構驗證

---

## 3. Supabase Storage + 圖片遷移

### 3.1 Bucket 設計

```
Supabase Storage
└── product-images/          # public bucket
    └── {slug}/              # 按商品 slug 分資料夾
        ├── 1.jpg
        ├── 2.jpg
        └── ...
```

- **Public bucket** — 商品圖需公開存取，不需 auth token
- 按 slug 分資料夾 — 刪除商品時整個資料夾清掉

### 3.2 Storage RLS

```sql
-- 任何人可讀（public bucket）
-- 只有 admin 可上傳/刪除
CREATE POLICY "Admin can manage product images"
ON storage.objects FOR ALL
USING (bucket_id = 'product-images' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
WITH CHECK (bucket_id = 'product-images' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
```

### 3.3 ImageUploader 元件

```
ImageUploader
├── 拖曳區域（drop zone）+ 點擊選檔
├── 上傳進度條（per file）
├── 圖片預覽 grid
│   ├── 拖曳排序（drag & drop reorder）
│   ├── 第一張自動標記為主圖
│   └── 每張可刪除（從 Storage 移除 + 更新表單 state）
└── 限制：最多 8 張、單張 2MB、僅 jpg/png/webp
```

上傳流程：
```
選擇檔案 → client 端驗證格式/大小
  → supabase.storage.from('product-images').upload(`${slug}/${filename}`, file)
  → 取得 public URL
  → 更新表單 state 中的 images array（含 url, alt, sort_order）
  → 儲存商品時 images array 一起寫入 DB
```

### 3.4 現有圖片遷移

撰寫一次性遷移 script：`scripts/migrate-images.ts`

流程：
1. 讀取所有商品的 `images` JSONB
2. 對每個 URL 為 `/images/products/...` 的圖片：
   - 從 `public/images/products/` 讀取檔案
   - 上傳到 Storage `product-images/{slug}/`
   - 記錄新的 public URL
3. 批次更新 DB 中的 `images` JSONB（URL 替換為 Storage URL）
4. 驗證所有圖片可存取後，移除 `public/images/products/` 目錄

### 3.5 Next.js 設定變更

`next.config.ts` 新增 `remotePatterns`：

```ts
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '*.supabase.co',
      pathname: '/storage/v1/object/public/**',
    },
  ],
}
```

### 3.6 前台影響

- `queries.ts` 的 `toProductInfo` / `toProductDetail` 已從 DB `images` JSONB 取 URL
- 遷移後 DB 存的就是 Storage URL，前台元件無需修改
- 唯一變更：`next.config.ts` 加 remote pattern

---

## 不在本次範圍

- 購物車功能（Phase 1 後段或 Phase 2）
- 結帳/金流串接（Phase 2）
- Email 驗證提醒 UI（結帳時才需要）
- 分類 CRUD（目前分類固定，直接在 DB 管理即可）
- 訂單管理（Phase 2 金流後才有訂單）

## 技術依賴

- `zod` — 表單驗證（需安裝）
- `@supabase/ssr` + `@supabase/supabase-js` — 已安裝
- `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities` — 圖片拖曳排序
