# 商品列表 UX 改善設計

## 背景

首頁商品區塊的 UX 有幾個問題：
1. 預設「全部」tab 無引導感，商品排列缺乏策略
2. 「推薦」篩選邏輯太窄，漏掉有 tag 的商品
3. 後台商品排序只能手動改 `sort_order` 數字，沒有拖曳操作
4. 產品卡片價格沒有單位
5. Section 標題固定「所有商品」，不跟 tab 連動

## A. 後台：商品列表拖曳排序

### 架構

- 列表頁拆成 Server Component（取資料）+ Client Component（可拖曳表格）
- 使用已安裝的 `@dnd-kit/core` + `@dnd-kit/sortable`

### 排列規則

- **上架商品**在上方，按 `sort_order` 排序，可拖曳
- **已下架商品**沉底，灰色分隔線 `──── 已下架 ────` + `opacity-50`
- 下架商品不參與拖曳，保留編輯/重新上架按鈕
- 重新上架時自動插到上架區最後一個（取最大 sort_order + 1）

### 拖曳互動

- 每列左側加 `GripVertical` icon 作為拖曳 handle
- 拖曳時顯示 overlay（半透明的被拖曳列）
- 放下後重算所有上架商品的 `sort_order`（從 1 開始遞增）
- Server Action 批次更新 `sort_order`
- Optimistic update：拖完立即反映新順序，不等 server 回應

### 改動檔案

- `app/(admin)/admin/products/page.tsx` — 拆出資料層，傳給 Client 元件
- 新增 `app/(admin)/admin/products/sortable-product-table.tsx` — 可拖曳表格（Client Component）
- `app/(admin)/admin/products/actions.ts` — 新增 `reorderProducts` Server Action

### 不做的事

- 不加分頁（商品量 < 50，全量載入足夠）
- 不做跨分類拖曳（只有一個扁平列表）

## B. 前台：預設 Tab 改推薦

### 改動

- `components/home-content.tsx` 第 26 行
- URL 無 `category` 參數時 fallback 從 `'all'` 改為 `'featured'`

### 影響

- 首次進站、從其他頁面回到首頁，都預設顯示推薦商品
- 直接連結 `/?category=all` 仍可看全部

## C. 前台：推薦篩選邏輯修正

### 現行邏輯（有問題）

```ts
result = products.filter(p => p.tag === 'hot' || p.tag === 'top_1')
```

只抓 `hot` 和 `top_1`，漏掉 `top_2`、`top_3`、`new` 等有 tag 的商品。

### 新邏輯

```ts
// 推薦 = 所有有 tag 的商品
result = products.filter(p => p.tag)
```

### 推薦內排序

按 tag 權重排序，同 tag 內維持原本的 `sort_order`：

```ts
const tagWeight: Record<string, number> = {
  top_1: 1, top_2: 2, top_3: 3, hot: 4, new: 5, christmas: 6
}
result.sort((a, b) => (tagWeight[a.tag] ?? 99) - (tagWeight[b.tag] ?? 99))
```

## D. 前台：產品卡片顯示單位

### 改動

- `components/product-card.tsx` 價格區域
- 從 `$60` 改為 `$60/顆`
- 單位來自 `product.unit`（DB 預設 `"件"`）

### 顯示邏輯

```tsx
<span className="text-[14px] font-bold text-sandrift-600">
  ${product.price}
  <span className="text-[11px] font-normal text-sandrift-400">/{product.unit}</span>
</span>
```

## E. 前台：Section 標題跟 Tab 連動

### 改動

- `components/home-content.tsx` 標題區域
- 「所有商品」→ 依當前 tab 動態切換

### 對應表

| Tab | 標題 |
|-----|------|
| featured | 推薦商品 |
| all | 所有商品 |
| hot | 熱賣商品 |
| cookie | 餅乾 |
| madeleine | 瑪德蓮 |
| festival | 節慶禮盒 |

### 實作

從 `categoryTabs` 陣列取得當前 tab 的 label，加上「商品」後綴（若 label 不含「商品」）。

## 不改動的部分

- 不加分頁
- 不新增 DB 欄位（用現有 `tag` + `sort_order`）
- 不改 DB schema 或 migration
- 不改商品詳情頁
