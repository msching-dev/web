# 專案審查檢查清單

全面掃描後歸納的業界標準審查項目。
每次開發新功能或做 code review 時對照使用，避免重複踩坑。

---

## 安全 (Security / OWASP)

- [ ] OAuth callback 的 redirect URL 驗證（防 open redirect，`next` 參數只允許站內路徑）
- [ ] ID token / JWT 必須驗證簽章（不能只 Base64 decode，用 provider 的 verify endpoint 或 JWKS）
- [ ] 環境變數啟動驗證（不用 `!` non-null assertion，缺少時給明確錯誤訊息）
- [ ] Admin 路由除了 middleware 還要有 server-side auth check（defense-in-depth 原則）
- [ ] API routes 加 rate limiting + cache headers（防爬蟲、防 DDoS）
- [ ] 不要在 repo 目錄留任何 `.env.*` 明文密鑰檔案（只放在部署平台的環境變數管理）
- [ ] 不要在 package.json / 原始碼硬編碼 project ID 或 secret
- [ ] 用戶查詢用 DB indexed query，不要 `listUsers()` 全表掃描（超過分頁上限會漏資料）
- [ ] placeholder email 用自有網域避免碰撞（如 `@noreply.msching.com`）
- [ ] CSRF protection（OAuth state parameter 存 httpOnly cookie）

**經驗教訓：**
> LINE Login 用 HS256 簽 ID token，Supabase Custom OIDC 只支援 ES256，導致整合失敗。
> 解法：自己寫 API route 橋接 LINE OAuth，用 LINE 的 `/verify` endpoint 驗證 token。

---

## SEO (Google 搜尋最佳化)

- [ ] `robots.ts` — disallow admin/api/auth 路徑，指向 sitemap
- [ ] `sitemap.ts` — 動態生成所有公開頁面 + lastModified
- [ ] 每個頁面都要有獨立的 `title` + `description` metadata
- [ ] OG metadata 要包含 `description`（社群分享預覽用）
- [ ] JSON-LD structured data（Organization、Product、FAQPage 依頁面類型加）
- [ ] `generateStaticParams` + `revalidate`（ISR）用於不常變動的頁面，減少 DB 查詢
- [ ] 產品頁 `generateMetadata` 完整（title、description、images、OG 全部填）

**經驗教訓：**
> FAQ 頁有完整問答內容但沒加 FAQPage schema，錯失 Google Rich Snippet 曝光。
> 加了 JSON-LD 後搜尋結果會直接展開顯示問答，點擊率顯著提升。

---

## 無障礙 (Accessibility / WCAG 2.1 AA)

- [ ] **絕對不要**設 `userScalable: false` 或 `maximumScale: 1`（違反 WCAG 1.4.4）
- [ ] Dialog / Mobile menu 要有 focus trap + Escape 鍵關閉 + `aria-modal="true"`
- [ ] Carousel 要鍵盤可及 + `aria-live="polite"` 通知切換
- [ ] Dropdown menu 要有 ARIA `role="menu"` / `role="menuitem"` + 方向鍵導航
- [ ] 裝飾圖片用 `alt=""`，有意義的圖片給描述性 alt text

**經驗教訓：**
> viewport 設 `userScalable: false` 是為了防止 iOS 雙擊放大，但正確做法是用 CSS `touch-action: manipulation`。

---

## UX (使用者體驗)

- [ ] `error.tsx` — 每個 route segment 都要有錯誤邊界，顯示友善錯誤頁 + 重試按鈕
- [ ] `not-found.tsx` — 品牌化的 404 頁面，有導覽和返回首頁連結
- [ ] `loading.tsx` — 路由切換時的 skeleton / loading UI
- [ ] 功能未完成的按鈕要 disable 或提示（不要點了無反應）
- [ ] 操作失敗要有 UI 回饋（error toast / 錯誤訊息）
- [ ] 表單離開前要確認未儲存變更（`beforeunload` + confirm dialog）
- [ ] Query 失敗不要靜默回傳空陣列，至少 log 或 throw 讓 error boundary 接住

**經驗教訓：**
> 後台 toggle/delete 操作失敗時完全沒有 UI 回饋，admin 以為操作成功了實際沒有。
> 加了 error state + tooltip 後問題解決。

---

## 資料完整性 (Data Integrity)

- [ ] 避免 TOCTOU race（read → write 改成 `UPDATE SET col = NOT col` 單一 SQL 原子操作）
- [ ] 檔案刪除不能 fire-and-forget，要檢查結果並處理失敗
- [ ] 關聯資料清理（刪 auth user 時連動刪 customer，或有定期清理機制）
- [ ] DB 預設值要合理（不要讓所有商品預設顯示「new」tag）
- [ ] 帳號合併邏輯要考慮同 email 不同 provider 的情況

**經驗教訓：**
> `listUsers()` 預設只回傳 50 筆，超過 50 個用戶後 LINE 登入就找不到已存在帳號，會建重複帳號。
> 解法：在 customers 表加 `line_user_id` 欄位 + unique index，用 DB query 取代全表掃描。

---

## 效能 (Performance)

- [ ] Supabase client 用 `useMemo` 快取，不要每次 render 重建
- [ ] 非首屏圖片加 `loading="lazy"`
- [ ] 不常變動的資料用 ISR（`revalidate`）而非純 SSR
- [ ] `Suspense` 要包在真正會 suspend 的 async component 上，否則 fallback 永遠不會顯示
- [ ] 陣列操作不要 mutate 原始資料（用 `toSorted()` / `[...arr].sort()` 取代 `.sort()`）

---

## Visual / UI

- [ ] z-index 建立層級系統，不要全部用 `z-50`（header、menu、dialog 各一層）
- [ ] 條件式元素（如 sticky CTA bar）影響的 padding 要動態計算
- [ ] 字體大小用設計系統 scale，減少 `text-[13px]` 等任意值
- [ ] `cursor-pointer` 不需要加在 `<button>` 和 `<a>` 上（現代瀏覽器已預設）

---

## 認證相關 (Auth)

- [ ] LINE Login 不能走 Supabase Custom OIDC（HS256 不支援），要自己寫 API route 橋接
- [ ] OAuth provider 的 callback URL 要設在 provider dashboard + Supabase dashboard 兩邊
- [ ] 帳號合併：同 email 自動綁定，不同 email 需手動在個人資訊頁綁定
- [ ] 第三方登入建的帳號沒有密碼，要在 profile 頁讓用戶補設
- [ ] LINE 的 email scope 需要另外申請，且用戶可能不提供 → 要開 "allow users without email"
- [ ] `unlinkLine` 時只刪 LINE 相關 metadata，不要誤刪其他 provider 的資料（如 Google 頭像）

---

*最後更新：2026-04-05*
*來源：MS. CHING 專案全面審查*
