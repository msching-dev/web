# Phase 1 測試驗證計劃

回來後照這份清單逐項操作。預計 30-40 分鐘。

---

## 前置作業（5 分鐘）

- [ ] **執行 Migration SQL**
  1. 打開 Supabase Dashboard → SQL Editor
  2. 貼上 `supabase/migrations/006_auth_user_trigger.sql` 的內容
  3. 點 Run，確認無錯誤

- [ ] **確認 Supabase Auth 設定**
  1. Authentication → Sign In / Providers → Supabase Auth tab
  2. 確認 `Confirm email` 已**關閉**
  3. 確認 Google provider 已啟用（有 Client ID/Secret）
  4. 確認 Custom OIDC `line` provider 已啟用

- [ ] **確認 Storage bucket**
  1. Storage → 確認 `product-images` bucket 存在且為 Public

- [ ] **確認 Redirect URL**
  1. Authentication → URL Configuration
  2. Redirect URLs 裡有 `http://localhost:3000/auth/callback`

- [ ] **啟動 dev server**
  ```bash
  pnpm dev
  ```

---

## A. Email 註冊/登入（5 分鐘）

- [ ] 開啟 `http://localhost:3000/account`
- [ ] 切到「註冊」tab
- [ ] 填入測試 email + 密碼（至少 6 字元）→ 點註冊
- [ ] 應看到「註冊成功！您可以直接登入」綠色提示
- [ ] 自動切回「登入」tab → 用剛才的 email/密碼登入
- [ ] 應自動導回首頁 `/`
- [ ] 檢查 Header：應顯示頭像圓圈（email 首字母）
- [ ] 點頭像 → 下拉選單顯示 email
- [ ] 再次訪問 `/account` → 應自動導回首頁（已登入）
- [ ] 點下拉選單「登出」→ 回到首頁，Header 恢復為登入 icon
- [ ] Supabase Dashboard → Authentication → Users 確認用戶已建立
- [ ] Supabase Dashboard → Table Editor → customers 確認有對應記錄（trigger 自動建立）

---

## B. Google 登入（3 分鐘）

- [ ] 訪問 `/account` → 點「使用 Google 登入」
- [ ] 應跳轉到 Google 授權頁面
- [ ] 授權後應導回首頁，Header 顯示已登入
- [ ] 確認 Supabase Users 和 customers 表有新記錄
- [ ] 登出

---

## C. LINE 登入（3 分鐘）

- [ ] 訪問 `/account` → 點「使用 LINE 登入」
- [ ] 應跳轉到 LINE 授權頁面
- [ ] 授權後應導回首頁，Header 顯示已登入
- [ ] 確認 Supabase Users 和 customers 表有新記錄
- [ ] 登出

---

## D. Admin 權限設定（3 分鐘）

- [ ] Supabase Dashboard → Authentication → Users
- [ ] 找到你要設為 admin 的帳號 → 點進去
- [ ] 在 `app_metadata` 欄位加上：`{"role": "admin"}`
  （或用 SQL Editor：`UPDATE auth.users SET raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}' WHERE email = '你的email';`）
- [ ] 用該帳號登入 → Header 下拉選單應多出「後台管理」
- [ ] 點「後台管理」→ 應進入 `/admin`

---

## E. Admin 商品列表（5 分鐘）

- [ ] 進入 `/admin/products` → 應看到商品列表
- [ ] 確認每一行有「上下架 / 編輯 / 刪除」三個操作按鈕
- [ ] 點一個商品的「上下架」toggle → 狀態應切換（上架↔下架）
- [ ] 重新整理頁面 → 確認狀態持久化
- [ ] 前台首頁確認下架商品不顯示

---

## F. 新增商品（5 分鐘）

- [ ] 點「新增商品」→ 進入 `/admin/products/new`
- [ ] 填寫基本資訊：
  - 名稱：`測試商品`
  - Slug：應自動產生（或手動填 `test-product`）
  - 售價：`100`
  - 選一個分類
  - 勾選一個標籤
  - 確認「上架」已勾選
- [ ] 商品描述區：至少填「商品介紹」
- [ ] 營養標示：新增一個項目（例：熱量 / 100）
- [ ] 規格：新增一個項目（例：原味 / 1）
- [ ] 點「建立商品」→ 應導回列表，新商品出現
- [ ] 前台首頁確認新商品顯示

---

## G. 編輯商品（3 分鐘）

- [ ] 在列表點剛才建的「測試商品」的編輯按鈕
- [ ] 確認表單已預填所有資料
- [ ] 修改售價為 `200`
- [ ] 點「更新商品」→ 應導回列表，價格已更新
- [ ] 前台確認價格已更新

---

## H. 刪除商品（2 分鐘）

- [ ] 在列表點「測試商品」的刪除按鈕
- [ ] 應彈出確認 dialog → 點「確認刪除」
- [ ] 商品從列表消失
- [ ] 前台確認商品不再顯示

---

## I. 圖片上傳（需 Storage bucket 已建好）（5 分鐘）

- [ ] 編輯一個現有商品
- [ ] 在圖片區點上傳 → 選一張 JPG/PNG（< 2MB）
- [ ] 圖片應出現在預覽 grid
- [ ] 上傳第二張 → 確認出現，第一張標記「主圖」
- [ ] 拖曳排序 → 確認順序更新，「主圖」標記跟著移動
- [ ] 點 X 刪除一張圖 → 確認消失
- [ ] 點「更新商品」→ 儲存成功
- [ ] Supabase Dashboard → Storage → product-images → 確認檔案存在

---

## J. 圖片遷移（選做，一次性）（3 分鐘）

如果想把 `public/images/products/` 的靜態圖片遷移到 Supabase Storage：

- [ ] 執行遷移 script：
  ```bash
  set -a && source .env.local && set +a && npx tsx scripts/migrate-images.ts
  ```
- [ ] 確認輸出每個商品的上傳狀態（應顯示 Done ✓）
- [ ] 前台首頁重新整理 → 所有商品圖片正常顯示
- [ ] 產品詳情頁確認圖片正常

---

## K. 錯誤情境（選做）（3 分鐘）

- [ ] Email 登入輸入錯誤密碼 → 應顯示「信箱或密碼錯誤」
- [ ] 註冊時密碼 < 6 字元 → 應顯示「密碼至少需要 6 個字元」
- [ ] 註冊時密碼不一致 → 應顯示「密碼不一致」
- [ ] 未登入直接訪問 `/admin` → 應被導回首頁
- [ ] 一般用戶（非 admin）訪問 `/admin` → 應被導回首頁
- [ ] 新增商品不填名稱直接送出 → 應顯示驗證錯誤

---

## 完成確認

全部通過後：
- [ ] 執行 `pnpm build` 確認建置成功
- [ ] 執行 `pnpm lint` 確認無 lint 錯誤
- [ ] 如果一切正常，可以 commit 並考慮合併到 main
