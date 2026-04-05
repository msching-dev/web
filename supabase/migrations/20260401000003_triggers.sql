-- ============================================================
-- 003: Triggers & Functions
-- ============================================================

-- 自動更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 訪客轉會員時，auth.users 建立後自動關聯 customers
CREATE OR REPLACE FUNCTION link_auth_to_customer()
RETURNS TRIGGER AS $$
BEGIN
  -- 只在 customers 表有匹配的訪客記錄時才 UPDATE
  IF EXISTS (SELECT 1 FROM customers WHERE email = NEW.email AND auth_id IS NULL) THEN
    UPDATE customers
    SET auth_id = NEW.id, updated_at = now()
    WHERE email = NEW.email AND auth_id IS NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_link_auth_customer
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION link_auth_to_customer();
