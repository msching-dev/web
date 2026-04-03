-- ============================================================
-- 002: RLS Policies
-- ============================================================

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- ── Products ──
-- 任何人可讀上架商品（前台瀏覽）
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (is_active = true);
-- admin 可做任何操作（含讀下架商品）
CREATE POLICY "products_admin_all" ON products
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- ── Categories ──
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT USING (is_active = true);
CREATE POLICY "categories_admin_all" ON categories
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- ── Customers ──
-- 客人只能讀自己的資料（我的帳號頁）
CREATE POLICY "customers_own_read" ON customers
  FOR SELECT USING (auth_id = auth.uid());
-- 客人可以更新自己的資料（改地址、電話）
CREATE POLICY "customers_own_update" ON customers
  FOR UPDATE USING (auth_id = auth.uid());
-- 訪客結帳時建立 customer 記錄（透過 server action + service_role 處理，
-- 不需要 client-side INSERT policy）
CREATE POLICY "customers_admin_all" ON customers
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- ── Orders ──
-- 客人只能看自己的訂單
CREATE POLICY "orders_customer_read" ON orders
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM customers WHERE auth_id = auth.uid()
    )
  );
-- 客人可以建立訂單（結帳時 INSERT）
CREATE POLICY "orders_customer_insert" ON orders
  FOR INSERT WITH CHECK (
    customer_id IN (
      SELECT id FROM customers WHERE auth_id = auth.uid()
    )
  );
CREATE POLICY "orders_admin_all" ON orders
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- ── Order Items ──
-- 客人只能看自己訂單的明細
CREATE POLICY "order_items_customer_read" ON order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders WHERE customer_id IN (
        SELECT id FROM customers WHERE auth_id = auth.uid()
      )
    )
  );
-- 客人可以建立訂單明細（結帳時 INSERT）
CREATE POLICY "order_items_customer_insert" ON order_items
  FOR INSERT WITH CHECK (
    order_id IN (
      SELECT id FROM orders WHERE customer_id IN (
        SELECT id FROM customers WHERE auth_id = auth.uid()
      )
    )
  );
CREATE POLICY "order_items_admin_all" ON order_items
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- ── Site Settings ──
-- 前台讀運費等設定（公開讀）
CREATE POLICY "settings_public_read" ON site_settings
  FOR SELECT USING (true);
-- admin 可改設定
CREATE POLICY "settings_admin_write" ON site_settings
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
