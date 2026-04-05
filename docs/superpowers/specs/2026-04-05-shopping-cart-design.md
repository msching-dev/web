# 購物車功能設計 — Phase 1

> MS. CHING 電商化 Phase 1 最後一塊：client-side 購物車 + DB 持久化

## 1. 目標與範圍

### 包含

- `cart_items` DB table + RLS + migration
- Zustand store + 雙層持久化（訪客 localStorage / 登入 DB）
- 產品頁「加入購物車」真實功能
- 購物車頁完整 UI（增刪改查）
- Header 購物車 badge
- 登入時合併 guest cart → DB
- 庫存軟驗證

### 不包含（Phase 2）

- 結帳流程（收件人表單、付款方式）
- ECPay 金流串接
- 訂單建立 / 運費計算 / 庫存扣減
- 訂單確認通知

## 2. 技術選型

| 項目 | 選擇 | 理由 |
|------|------|------|
| State Management | Zustand (~1KB) | 輕量、persist middleware 內建、首次引入全域 store |
| DB 持久化 | Supabase `cart_items` table | 登入用戶跨裝置同步 |
| 訪客快取 | localStorage via Zustand persist | 不需 server，離線可用 |
| Server 操作 | Next.js Server Actions | 自動帶 auth context，符合 App Router 慣例 |

## 3. DB Schema

### 3.1 `cart_items` Table

```sql
CREATE TABLE cart_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(customer_id, product_id)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own cart"
  ON cart_items FOR ALL
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE auth_id = auth.uid()
    )
  );

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

- `UNIQUE(customer_id, product_id)`：同商品只有一筆記錄，quantity 累加
- ON DELETE CASCADE：用戶刪除 → 購物車清空；商品刪除 → 自動移除
- 沿用既有 `update_updated_at()` trigger function

## 4. Zustand Store 設計

### 4.1 Store Interface

```typescript
// stores/cart-store.ts

interface CartItem {
  productId: string       // UUID
  slug: string            // 用於連結
  name: string            // 商品名（快照）
  price: number           // 單價（快照）
  image: string           // 首圖 URL（快照）
  quantity: number
  maxCount: number        // max_order_qty，用於前端驗證
  unit: string            // "包" | "盒" | "顆"
}

interface CartStore {
  items: CartItem[]
  isHydrated: boolean

  // Actions
  addItem: (product: CartItemInput, quantity: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void

  // Computed helpers
  getItemCount: () => number      // 總件數
  getSubtotal: () => number       // 小計金額

  // Internal (不對外暴露)
  _setItems: (items: CartItem[]) => void
  _setHydrated: (hydrated: boolean) => void
}
```

### 4.2 持久化策略

```
┌─────────────────┐     ┌──────────────────────────────────┐
│  未登入（訪客）  │     │           已登入用戶              │
│                 │     │                                  │
│  Zustand Store  │     │  Zustand Store (source of truth) │
│  persist        │     │       │                          │
│  middleware     │     │       ▼ debounce 300ms           │
│     │           │     │  Server Action → cart_items DB   │
│     ▼           │     │                                  │
│  localStorage   │     │  ✖ 不寫 localStorage              │
│  key:           │     │  頁面載入時從 DB hydrate           │
│  msching-cart   │     │                                  │
└─────────────────┘     └──────────────────────────────────┘
```

**核心規則：登入狀態下不寫 localStorage，登出時清空 localStorage + store。**

- **未登入**：Zustand `persist` middleware → localStorage key `msching-cart`
- **已登入**：
  - 頁面載入時 → Server Action 讀取 DB → hydrate store
  - 每次 mutation → debounce 300ms → Server Action 寫入 DB
  - **不寫 localStorage**（persist middleware 在登入狀態下 skip storage）

實作方式：自訂 Zustand persist 的 `storage` adapter，根據 auth 狀態決定是否寫入 localStorage。

### 4.3 Auth 狀態變更處理

```
onAuthStateChange 監聽：

SIGNED_IN:
  1. 讀取 localStorage guest cart
  2. 呼叫 mergeGuestCart(guestItems) Server Action
  3. 清空 localStorage
  4. Store 更新為合併後結果
  5. 切換 persist → DB 模式

SIGNED_OUT:
  1. 清空 Store（items = []）
  2. 清空 localStorage（移除 msching-cart key）
  3. 切換 persist → localStorage 模式
```

### 4.4 完整情境驗證

| # | 情境 | localStorage | DB | Store | 結果 |
|---|------|-------------|-----|-------|------|
| 1 | 訪客加 [A×2, B×1] | [A×2, B×1] | — | [A×2, B×1] | 關瀏覽器重開恢復 ✓ |
| 2 | 訪客 → 登入甲 | **清空** | merge 寫入甲 | 合併結果 | 乾淨切換 ✓ |
| 3 | 甲登入中加 [C×1] | **不寫** | 甲: [A×2,B×1,C×1] | 同步 DB | 只走 DB ✓ |
| 4 | 甲登出 | **清空** | 甲資料保留 | **清空** | 無殘留 ✓ |
| 5 | 訪客加 [Z×1] → 登入乙 | **清空** | merge [Z×1]+乙's DB | 合併 | Z 是訪客加的，合理 ✓ |
| 6 | 乙登出 → 直接登入丙 | **清空**（登出時） | 丙's DB | 丙's DB | 無殘留 ✓ |
| 7 | 甲在 A 裝置，到 B 裝置登入 | B 裝置空 | 甲's DB | 從 DB 載入 | 跨裝置同步 ✓ |
| 8 | 甲登入，斷網加商品 | **不寫** | sync 失敗 | 有資料 | 重連後 retry ✓ |
| 9 | 兩分頁，A 登出 B 還開 | 清空 | — | `onAuthStateChange` 清空 B | 同步 ✓ |

### 4.5 addItem 邏輯

```
addItem(product, qty):
  existing = items.find(productId)
  if existing:
    newQty = min(existing.quantity + qty, maxCount)
    update quantity
  else:
    push new item with qty = min(qty, maxCount)

  if 已登入: debounced _syncToDB()
  // 未登入: persist middleware 自動寫 localStorage
```

## 5. 登入合併流程

由 `onAuthStateChange(SIGNED_IN)` 觸發（涵蓋 OAuth callback、email 登入等所有路徑）。

```
步驟：
1. 從 localStorage 讀取 guest cart items（可能為空）
2. 清空 localStorage（立即清，不等 merge 完成，避免殘留）
3. 呼叫 mergeGuestCart(guestItems) Server Action：
   - Server 端讀取用戶 DB cart
   - 合併規則：
     - 同商品 → 取 max(guest.quantity, db.quantity)
     - guest 獨有 → 新增
     - DB 獨有 → 保留
   - batch upsert 到 DB
   - 回傳合併後完整 cart
4. Store 更新為回傳結果
5. 切換至 DB 模式（不再寫 localStorage）
```

合併用 Server Action `mergeGuestCart(guestItems[])`，一次 upsert 完成。
guestItems 為空陣列時，等同於單純從 DB 載入。

## 6. Server Actions

```typescript
// lib/actions/cart.ts
'use server'

// 讀取用戶購物車（含商品資訊 join）
async function getCartItems(): Promise<CartItem[]>

// 新增或更新（upsert by customer_id + product_id）
async function upsertCartItem(productId: string, quantity: number): Promise<void>

// 刪除單一商品
async function removeCartItem(productId: string): Promise<void>

// 清空購物車
async function clearCart(): Promise<void>

// 登入合併（guest localStorage → DB）
async function mergeGuestCart(
  guestItems: { productId: string; quantity: number }[]
): Promise<CartItem[]>
```

- 所有 action 內部透過 `createServerClient` 取得 auth context
- `getCartItems` join products 表拿最新的 name、price、image（不依賴快照）
- `upsertCartItem` 使用 PostgreSQL `ON CONFLICT ... DO UPDATE`

## 7. UI 元件

### 7.1 Header 購物車 Badge

- 現有 `ShoppingBag` icon 右上角加紅色圓形 badge
- 顯示 `getItemCount()`，0 件時不顯示
- Client Component（需讀 store）

### 7.2 產品詳情頁改造

現有行為：按鈕顯示 toast「購物車功能即將推出」
改為：
- 呼叫 `addItem()` 真實加入購物車
- Toast 改為：「已加入購物車」+ 商品名
- Toast 附帶「查看購物車」連結
- 數量已達 maxCount 時按鈕 disabled + 提示「已達訂購上限」
- 已在購物車中的商品，顯示目前購物車數量提示

### 7.3 購物車頁 `/cart`

**有商品時：**

```
┌─────────────────────────────────────────┐
│  購物車 (3)                    繼續選購 → │
├─────────────────────────────────────────┤
│ ┌──────┐                                │
│ │ img  │ 蜜絲晴手工餅乾           ✕     │
│ │      │ NT$350                          │
│ │      │ [−] 2 [+]        小計 NT$700   │
│ └──────┘                                │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│ ┌──────┐                                │
│ │ img  │ 瑪德蓮禮盒               ✕     │
│ │      │ NT$480                          │
│ │      │ [−] 1 [+]        小計 NT$480   │
│ └──────┘                                │
├─────────────────────────────────────────┤
│                       商品小計  NT$1,180 │
│                       運費        待結算 │
│                       ────────────────  │
│                       合計      NT$1,180 │
│                                         │
│              [ 前往結帳 ]                │
│                                         │
│  💬 有問題？透過 LINE 聯繫我們           │
└─────────────────────────────────────────┘
```

**空購物車：**
- 品牌風格空狀態插圖
- 「購物車是空的」文字
- 「去逛逛」按鈕 → 首頁

**手機版：**
- 商品圖片縮小（64×64）
- 「前往結帳」固定在底部 sticky bar（取代 StoreCta）
- 可選：左滑刪除（利用現有 `use-swipe` hook）

**商品異常處理：**
- 商品下架（`is_active = false`）→ 灰色標記「商品已下架」+ 無法修改數量
- 結帳時自動排除已下架商品

### 7.4 「前往結帳」按鈕行為（Phase 1）

Phase 1 尚無結帳流程，按鈕行為：
- 已登入 → 顯示 toast「結帳功能即將推出，請先透過 LINE 下單」+ 提供複製訂單模板功能
- 未登入 → 導向登入頁 `/account`

### 7.5 StoreCta 調整

- 購物車頁已在排除清單中（不顯示 StoreCta）
- 產品頁的「加入購物車」CTA 改為真實功能（與詳情頁按鈕共用 store action）

## 8. 庫存驗證

| 時機 | 驗證方式 | 說明 |
|------|----------|------|
| 加入購物車 | 前端 `quantity ≤ maxCount` | 軟驗證，UX 即時回饋 |
| 購物車頁載入 | join products 取最新資料 | 商品下架/價格變動時反映 |
| 結帳前（Phase 2） | Server Action 檢查 `stock_quantity` | 硬驗證，防超賣 |

## 9. 新增檔案清單

```
stores/
  cart-store.ts              # Zustand store + persist middleware
  cart-provider.tsx          # Provider component（hydration 處理）

lib/actions/
  cart.ts                    # Server Actions (CRUD + merge)

components/
  cart/
    cart-page-content.tsx    # 購物車頁主體（Client Component）
    cart-item-row.tsx        # 單一商品列
    cart-summary.tsx         # 小計 + 合計
    cart-empty.tsx           # 空購物車狀態
    cart-badge.tsx           # Header 購物車 badge

supabase/migrations/
  YYYYMMDDHHMMSS_create_cart_items.sql

app/(store)/cart/page.tsx    # 改寫（移除佔位內容）
```

## 10. 依賴安裝

```bash
pnpm add zustand
```

唯一新增依賴。無其他外部套件。

## 11. 效能考量

- **Hydration**：使用 `isHydrated` flag 防止 SSR/CSR mismatch，badge 和數量在 hydrate 前不顯示
- **DB Sync**：debounce 300ms，避免快速連續點擊產生大量 DB 請求
- **購物車頁**：Server Component 外殼 + Client Component 內容，metadata 可靜態設定
- **商品資料**：購物車頁載入時 join 最新商品資料（不依賴 store 中的快照），確保價格/狀態即時

## 12. 測試要點

- 加入商品 → store 更新 → badge 數字正確
- 同商品重複加入 → quantity 累加不超過 maxCount
- 數量修改邊界：min=1, max=maxCount
- 訪客：重整頁面 → localStorage 恢復購物車
- 登入合併：guest [A×2] + DB [A×1] → 結果 [A×2]（取 max）
- 商品下架 → 購物車頁顯示灰色標記
- **登入中不寫 localStorage**：登入後加商品 → localStorage 無變化
- **登出清空**：登出 → store 清空 + localStorage 清空 → 訪客乾淨狀態
- **帳號隔離**：A 登入有購物車 → 登出 → 登入 B → B 只看到自己的 DB 資料，無 A 殘留
- **多分頁同步**：分頁 A 登出 → 分頁 B 的 onAuthStateChange 同步清空
