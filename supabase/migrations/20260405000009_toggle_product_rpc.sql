-- ============================================================
-- 009: 原子操作翻轉商品上下架狀態（避免 TOCTOU race condition）
-- ============================================================

CREATE OR REPLACE FUNCTION public.toggle_product_active(product_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_state boolean;
BEGIN
  UPDATE products
  SET is_active = NOT is_active, updated_at = now()
  WHERE id = product_id
  RETURNING is_active INTO new_state;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product not found: %', product_id;
  END IF;

  RETURN new_state;
END;
$$;
