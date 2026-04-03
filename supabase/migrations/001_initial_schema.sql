-- ============================================================
-- 001: Initial Schema — enums + tables + indexes
-- ============================================================

-- Enums
CREATE TYPE order_status AS ENUM (
  'pending_payment',  -- 待付款
  'paid',             -- 已付款
  'preparing',        -- 製作中
  'shipped',          -- 已寄出
  'completed',        -- 已完成
  'cancelled'         -- 已取消
);

CREATE TYPE shipping_method AS ENUM (
  'pickup',           -- 自取
  'home_delivery',    -- 宅配
  'convenience_store' -- 超商店到店
);

CREATE TYPE payment_method AS ENUM (
  'credit_card',      -- 信用卡
  'atm',              -- ATM 虛擬帳號
  'cvs_code',         -- 超商代碼
  'cvs_barcode'       -- 超商條碼
);

-- ============================================================
-- CUSTOMERS（客人 / 會員）
-- ============================================================
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- null = 訪客
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  default_address TEXT,
  default_shipping_method shipping_method DEFAULT 'home_delivery',
  note TEXT,                    -- 內部備註（過敏、特殊需求等），客人看不到
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_auth_id ON customers(auth_id);

-- ============================================================
-- CATEGORIES（產品分類）
-- ============================================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,            -- 餅乾、瑪德蓮、節慶禮盒
  slug TEXT UNIQUE NOT NULL,     -- cookie, madeleine, festival
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- PRODUCTS（商品）
-- ============================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,             -- 手作杏仁瓦片
  slug TEXT UNIQUE NOT NULL,      -- almond-cookie（URL 用）
  alias TEXT,                     -- 產品副標（「純粹」「高貴」）

  -- 描述
  description TEXT,               -- 列表頁簡短描述（一句話）
  detail JSONB,                   -- 詳情頁完整描述，結構：
                                  -- {desc, nonAdditive, howToEat,
                                  --  preservationMethod, precautions, tastePeriod}

  -- 價格
  price INT NOT NULL,             -- 售價（TWD 整數）
  compare_price INT,              -- 原價（劃線用，nullable）

  -- 庫存與訂購限制
  stock_quantity INT DEFAULT 0,   -- 0 = 售完
  min_order_qty INT DEFAULT 1,
  max_order_qty INT,              -- nullable = 不限

  -- 圖片
  images JSONB DEFAULT '[]',      -- [{url, alt, sort_order}]

  -- 上架與推薦
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,  -- 首頁「招牌推薦」
  sort_order INT DEFAULT 0,

  -- 標籤（多值）
  tags TEXT[],                    -- ['hot', 'new', 'christmas']

  -- 商品規格
  specifications JSONB DEFAULT '[]',  -- [{key: "原味", value: 1}]
  portion_size INT,               -- 每份重量 (g)
  include_size TEXT,              -- 「7片」「6顆」
  unit TEXT,                      -- 「包」「盒」「顆」

  -- 營養標示
  nutrition JSONB,                -- 統一存所有營養資訊，結構：
                                  -- {perServing: [{key,value}],
                                  --  perHundred: [{key,value}],
                                  --  giftBox?: [{taste, content: [{key,value}]}]}

  -- 食品資訊
  shelf_life TEXT,                -- 保存期限描述
  allergens TEXT,                 -- 過敏原描述
  storage_instructions TEXT,      -- 保存方式

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;

-- ============================================================
-- ORDERS（訂單）
-- ============================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL, -- 人類可讀：MS-20260401-001
  customer_id UUID NOT NULL REFERENCES customers(id),
  status order_status DEFAULT 'pending_payment',

  -- 付款
  payment_method payment_method,
  ecpay_merchant_trade_no TEXT,   -- 我方產生的交易編號
  ecpay_trade_no TEXT,            -- 綠界回傳的交易編號
  paid_at TIMESTAMPTZ,

  -- 物流
  shipping_method shipping_method NOT NULL,
  shipping_name TEXT NOT NULL,    -- 收件人姓名
  shipping_phone TEXT NOT NULL,   -- 收件人電話
  shipping_address TEXT,          -- 宅配地址（超商取貨可為空）
  shipping_fee INT DEFAULT 0,    -- 運費快照
  tracking_number TEXT,           -- 物流追蹤碼（手動填）
  shipped_at TIMESTAMPTZ,

  -- 金額（快照，不隨商品改價而變）
  subtotal INT NOT NULL,          -- 商品小計
  total_amount INT NOT NULL,      -- subtotal + shipping_fee

  -- 備註
  customer_note TEXT,             -- 客人備註
  admin_note TEXT,                -- 管理備註（客人看不到）

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- ============================================================
-- ORDER ITEMS（訂單明細）
-- ============================================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL, -- 刪商品不影響歷史訂單
  product_name TEXT NOT NULL,     -- 快照：下單時的品名
  product_price INT NOT NULL,     -- 快照：下單時的單價
  quantity INT NOT NULL,
  subtotal INT NOT NULL,          -- product_price * quantity
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ============================================================
-- SITE SETTINGS（網站設定 / KV store）
-- ============================================================
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);
