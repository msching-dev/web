-- 商品檔期：限定時間上架（節慶禮盒等）
ALTER TABLE products
  ADD COLUMN available_from TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN available_until TIMESTAMPTZ DEFAULT NULL;

COMMENT ON COLUMN products.available_from IS '檔期開始時間，NULL 表示不限';
COMMENT ON COLUMN products.available_until IS '檔期結束時間，NULL 表示不限';

-- 索引加速前台過濾
CREATE INDEX idx_products_availability ON products (available_from, available_until)
  WHERE available_from IS NOT NULL OR available_until IS NOT NULL;
