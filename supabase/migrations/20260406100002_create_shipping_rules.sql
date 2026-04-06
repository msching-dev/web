CREATE TABLE shipping_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rule_type TEXT NOT NULL DEFAULT 'free'
    CHECK (rule_type IN ('free', 'discount', 'fixed')),
  min_amount INTEGER DEFAULT NULL,
  discount_value INTEGER NOT NULL DEFAULT 0,
  shipping_methods TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NULL,
  ended_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE shipping_rules ENABLE ROW LEVEL SECURITY;

-- 前台可讀啟用中的規則（結帳計算用）
CREATE POLICY "shipping_rules_public_read" ON shipping_rules
  FOR SELECT USING (is_active = true);

-- Admin 全權限
CREATE POLICY "shipping_rules_admin_all" ON shipping_rules
  FOR ALL USING (
    (SELECT auth.jwt() ->> 'role') = 'admin'
  );

-- updated_at trigger
CREATE TRIGGER set_shipping_rules_updated_at
  BEFORE UPDATE ON shipping_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
