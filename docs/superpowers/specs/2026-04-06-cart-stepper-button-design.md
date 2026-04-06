# 商品卡片快速加購重設計

> 將浮動的加入購物車按鈕整合進卡片資訊區，加入 stepper 數量控制 + 飛入購物車動畫

## 1. 問題

現有的 `QuickAddButton` 用 `absolute` 定位浮在卡片圖片與文字區交界處，存在以下問題：

1. **漂浮感** — 白底圓形 + ring 邊框像是事後貼上的貼紙，跟卡片沒有結構歸屬
2. **位置尷尬** — `bottom-14 right-2` 卡在圖片區和資訊區之間，既不屬於圖片也不屬於文字
3. **色系脫節** — 平時是冷灰白色，跟 Sandrift 品牌色系不一致
4. **回饋弱** — 只有 check icon 閃 1.2 秒，沒有數量感知
5. **重複點擊** — 想買多個需反覆按，有摩擦

## 2. 設計方案

### 2.1 佈局變更

移除浮動按鈕，將加購控制整合進卡片資訊區的價格行右側：

```
┌──────────────────────┐
│                      │
│     產品圖片區        │
│     (不變)           │
│                      │
├──────────────────────┤
│ 手作杏仁瓦片 · 純粹   │  ← 名稱 + alias 合併
│ $115̶  $105     [🛒]  │  ← 價格行右側放加購按鈕
└──────────────────────┘
```

- `alias`（純粹、高貴、浪漫）從價格行右側移到產品名稱後，用 `·` 或小字分隔
- 騰出價格行右側空間給加購按鈕
- 按鈕成為資訊區的有機部分，不再是浮動元素

### 2.2 互動狀態機

```
                    點擊
[idle] ─────────────────→ [added]
  ↑                         │
  │                      300ms
  │                         ↓
  │    3s 無操作        [stepper]
  ├─────────────────────────┘
  │    數量歸零 (removeItem)
  ├─────────────────────────┘
  │
  ↑  購物車已有該商品時
[has-items] ←── 頁面載入 / stepper 收合
```

#### 狀態定義

| 狀態 | 外觀 | 行為 |
|------|------|------|
| **idle** | 圓形，`sandrift-100` 底 + `sandrift-600` ShoppingBag icon（32px） | 點擊 → addItem(1)，進入 added |
| **added** | 按鈕 pulse 縮放 + icon 變 Check，底色升為 `sandrift-500` + 白 icon | 300ms 後過渡到 stepper；同時觸發飛入動畫 |
| **stepper** | 向左展開成膠囊形 `[−] 2 [+]`（~88px），`sandrift-500` 底 + 白字 | +/- 調整數量；3 秒無操作收合 |
| **has-items** | 圓形，`sandrift-500` 底 + 白色數字（顯示當前數量） | 點擊 → 直接展開 stepper |
| **maxed** | stepper 的 `+` 變灰 disabled | 數量 = maxCount 時，阻止繼續增加 |

#### 收合邏輯

- stepper 展開後，3 秒無操作 → 收合回圓形
- 收合後若購物車有該商品 → 進入 `has-items`（顯示數字），非 `idle`
- 數量被 `−` 到 0 → `removeItem` → 回到 `idle`

### 2.3 Stepper 展開細節

```
收合態:          展開態:
    [🛒]    →    [−]  2  [+]
    32px          ~88px
```

- **展開方向**：向左擴展，按鈕右邊緣固定不動
- **動畫**：width `200ms ease-out`，數字 `fade-in 150ms`
- **+/- 觸控區**：各至少 44x44px（WCAG 觸控目標最低標準）
- **數字字體**：`tabular-nums`，避免寬度跳動

### 2.4 視覺規格

#### idle 按鈕
- 尺寸：`h-8 w-8`（32px）
- 背景：`bg-sandrift-100`
- Icon：`ShoppingBag` h-4 w-4，`text-sandrift-600`
- 圓角：`rounded-full`
- 按下：`active:scale-95`

#### has-items 按鈕
- 同尺寸 32px
- 背景：`bg-sandrift-500`
- 文字：白色數字，`text-xs font-semibold`
- 圓角：`rounded-full`

#### stepper 展開態
- 高度：32px（跟按鈕同高）
- 寬度：~88px
- 背景：`bg-sandrift-500`
- 文字/icon：白色
- 圓角：`rounded-full`（膠囊形）
- 陰影：`shadow-md`

### 2.5 飛入購物車動畫

使用 **Web Animations API（WAAPI）**，零依賴。

#### 觸發時機

使用者點擊加購按鈕（idle → added）時觸發。stepper 裡的 +/- 不觸發飛入動畫（只有首次加入時飛）。

#### 動畫流程

1. **取座標**：按鈕位置（`getBoundingClientRect`）→ header CartBadge 位置
2. **建立飛行元素**：clone 商品縮圖的小型版本（或用一個 sandrift 圓形替代），append 到 body 的 fixed 層
3. **拋物線軌跡**：用 3-4 個 keyframe 模擬拋物線（先往上飄再落入購物車），搭配 `scale(1→0.3)` + `opacity(1→0.2)`
4. **持續時間**：`500ms`，`ease-in` 收尾加速
5. **落點回饋**：飛行元素到達 CartBadge 時移除，CartBadge 做 `scale(1→1.2→1)` bounce（`300ms`）
6. **清理**：動畫結束後移除 clone 元素

#### 實作元件

新增 `hooks/use-fly-to-cart.ts`：
- export `useFlyToCart()` hook
- 接受 `sourceRef`（按鈕位置）
- 內部用 `cartBadgeRef` 查找 header 的 CartBadge 位置（用 `data-cart-badge` attribute）
- 回傳 `triggerFly()` function

CartBadge 新增 `data-cart-badge` attribute 供定位。

#### 不使用 GSAP 的理由

- GSAP 壓縮後 ~27KB，只為一個動畫太重
- GSAP 免費版在商業網站有授權限制
- WAAPI 是瀏覽器原生，零依賴，效能走 compositor thread

## 3. 元件異動

| 元件 | 變動 |
|------|------|
| `components/quick-add-button.tsx` | **刪除** → 由新元件取代 |
| `components/cart-stepper-button.tsx` | **新增** — 包含 idle/added/stepper/has-items/maxed 狀態機 |
| `components/product-card.tsx` | 移除浮動 div，在價格行右側渲染 `CartStepperButton`；alias 移到名稱行 |
| `components/cart/cart-badge.tsx` | 新增 `data-cart-badge` attribute；新增 bounce 動畫支援 |
| `hooks/use-fly-to-cart.ts` | **新增** — 飛入動畫 hook（WAAPI） |
| `components/store-cta.tsx` | 不變 |
| `stores/cart-store.ts` | 不變 |

## 4. 邊界情況

| 情境 | 行為 |
|------|------|
| 商品已下架（`isActive = false`） | 按鈕灰色 disabled，不可操作 |
| 數量已達 maxCount | stepper 的 + disabled，顯示視覺提示 |
| stepper 數量 = 1 時按 − | 顯示刪除 icon（Trash2）取代 −，點擊 → removeItem → 收合回 idle |
| stepper 展開中滑動捲頁 | 不干涉捲動，3 秒計時器繼續，到時收合 |
| 多個卡片同時展開 stepper | 允許，不互斥（各自獨立） |
| 頁面跳轉後回來 | 從 cart store 讀取數量，有商品的卡片直接顯示 has-items |
| 飛入動畫期間快速連點 | 忽略重複觸發，直到動畫完成（debounce） |
| CartBadge 不在視窗內（如已捲過 header） | 跳過飛入動畫，只做按鈕本身的 pulse 回饋 |

## 5. 不做的事

- ❌ 口味 / 規格選擇 — 品項無變體
- ❌ Toast 通知 — stepper + 飛入動畫已是充分回饋
- ❌ 底部 StoreCta 改動 — 保持現有全局 CTA 不變
- ❌ 桌面版 hover 才顯示按鈕 — 改為常駐顯示，確保手機和桌面一致
