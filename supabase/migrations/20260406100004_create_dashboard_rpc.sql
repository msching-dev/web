CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'active_products', (SELECT COUNT(*) FROM products WHERE is_active = true),
    'pending_orders', (SELECT COUNT(*) FROM orders WHERE status = 'pending_payment'),
    'monthly_revenue', (
      SELECT COALESCE(SUM(total_amount), 0) FROM orders
      WHERE status IN ('paid', 'preparing', 'shipped', 'completed')
      AND created_at >= date_trunc('month', now())
    ),
    'total_customers', (SELECT COUNT(*) FROM customers)
  ) INTO result;
  RETURN result;
END;
$$;
