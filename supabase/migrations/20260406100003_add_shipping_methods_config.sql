-- 物流方式設定（KV store in site_settings）
INSERT INTO site_settings (key, value) VALUES
  ('shipping_methods_config', '{
    "cvs": { "enabled": true, "label": "全家店到店", "fee": 60 },
    "home": { "enabled": false, "label": "宅配到府", "fee": 150 }
  }'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
