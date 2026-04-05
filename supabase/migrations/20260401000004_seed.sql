-- ============================================================
-- 004: Seed Data — site_settings 預設值
-- ============================================================

INSERT INTO site_settings (key, value) VALUES
  ('shipping_fee_home', '{"amount": 150, "free_threshold": 1500}'),
  ('shipping_fee_cvs', '{"amount": 65}'),
  ('store_announcement', '{"text": "", "is_active": false}'),
  ('order_number_counter', '{"date": "", "seq": 0}');
