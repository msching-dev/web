-- ============================================================
-- 008: 在 customers 表加 line_user_id 欄位
-- 用於快速查找 LINE 登入用戶，取代 listUsers() 全表掃描
-- ============================================================

ALTER TABLE customers ADD COLUMN IF NOT EXISTS line_user_id text;

-- 唯一索引：一個 LINE 帳號只能綁一個 customer
CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_line_user_id
  ON customers (line_user_id) WHERE line_user_id IS NOT NULL;

-- 更新 handle_new_user trigger：同步 line_user_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM customers WHERE email = NEW.email
  ) THEN
    INSERT INTO customers (auth_id, email, name, phone, line_user_id)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'line_display_name',
        ''
      ),
      '',
      NEW.raw_user_meta_data->>'line_user_id'
    );
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user failed for %: %', NEW.email, SQLERRM;
  RETURN NEW;
END;
$$;
