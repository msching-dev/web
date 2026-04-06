-- 修復：為所有在 auth.users 但不在 customers 的帳號建立記錄
-- 原因：admin 帳號手動建立於 trigger 機制完成前，導致 customers 表缺記錄
INSERT INTO customers (auth_id, email, name, phone)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', ''),
  ''
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM customers WHERE auth_id = u.id)
  AND u.email IS NOT NULL;
