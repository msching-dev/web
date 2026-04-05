-- ============================================================
-- 006: Auto-create customer on auth signup
-- ============================================================

-- When a new user signs up via Supabase Auth and no matching
-- guest customer record exists, create one automatically.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create if no existing customer with this email
  IF NOT EXISTS (SELECT 1 FROM public.customers WHERE email = NEW.email) THEN
    INSERT INTO public.customers (auth_id, email, name, phone)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
      ''
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_create_customer_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
