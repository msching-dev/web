-- ============================================================
-- 007: Fix auth user trigger — add search_path + error handling
-- ============================================================

-- Drop the old trigger and function from 006
DROP TRIGGER IF EXISTS trg_create_customer_on_signup ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate with:
-- 1. SET search_path = public (ensures customers table is found)
-- 2. EXCEPTION handler (trigger failure won't block signup)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only create if no existing customer with this email
  IF NEW.email IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM customers WHERE email = NEW.email
  ) THEN
    INSERT INTO customers (auth_id, email, name, phone)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        ''
      ),
      ''
    );
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log but don't block signup — customer record can be created later
  RAISE WARNING 'handle_new_user failed for %: %', NEW.email, SQLERRM;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_create_customer_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also fix the existing link_auth_to_customer from 003 with same treatment
CREATE OR REPLACE FUNCTION public.link_auth_to_customer()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM customers WHERE email = NEW.email AND auth_id IS NULL) THEN
    UPDATE customers
    SET auth_id = NEW.id, updated_at = now()
    WHERE email = NEW.email AND auth_id IS NULL;
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'link_auth_to_customer failed for %: %', NEW.email, SQLERRM;
  RETURN NEW;
END;
$$;
