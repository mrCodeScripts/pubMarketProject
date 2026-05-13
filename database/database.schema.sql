-- ============================================================================
-- PUBMARKET — COMPLETE DATABASE SCHEMA
-- Stack: Supabase (PostgreSQL)
-- ============================================================================
-- TABLE ORDER (dependency-safe):
-- 1. profiles
-- 2. seller_profiles
-- 3. categories
-- 4. products
-- 5. product_images
-- 6. addresses
-- 7. orders
-- 8. order_items
-- 9. cart_items
-- 10. reviews
-- 11. wishlist
-- 12. notifications
-- 13. conversations
-- 14. messages
-- 15. support_tickets
-- 16. support_messages
-- 17. inventory_logs
-- 18. seller_analytics (daily snapshot)
-- ============================================================================
-- ============================================================================
-- EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- for fuzzy search on product names

-- ============================================================================
-- ENUMS
-- ============================================================================
CREATE TYPE user_role AS ENUM ('customer', 'seller', 'admin');

CREATE TYPE seller_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'packed',
  'out_for_delivery',
  'delivered',
  'cancelled'
);

CREATE TYPE payment_status AS ENUM (
  'unpaid',
  'paid',
  'refunded',
  'failed'
);

CREATE TYPE notification_type AS ENUM (
  'order_placed',
  'order_confirmed',
  'order_packed',
  'order_out_for_delivery',
  'order_delivered',
  'order_cancelled',
  'seller_approved',
  'seller_rejected',
  'new_review',
  'low_stock',
  'new_message',
  'promo',
  'system'
);

  CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');

CREATE TYPE ticket_category AS ENUM (
  'order_issue',
  'payment_issue',
  'account_issue',
  'seller_issue',
  'product_issue',
  'other'
);

-- ============================================================================
-- 1. PROFILES
-- extends Supabase auth.users (1:1 relationship)
-- ============================================================================
CREATE TABLE profiles (
  id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name        TEXT NOT NULL,
  email            TEXT NOT NULL UNIQUE,
  avatar_url       TEXT,
  phone            TEXT,
  role             user_role NOT NULL DEFAULT 'customer',

-- location
  province         TEXT,
  city             TEXT,
  barangay         TEXT,
  postal_code      TEXT,

-- seller status (tracks application state even before seller_profile exists)
  seller_status    seller_status DEFAULT NULL,

-- meta
  is_suspended     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- trigger: keep updated_at fresh
create or replace function update_updated_at()
returns trigger
as $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$
language plpgsql
;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- trigger: auto-insert profile on auth.users insert
create or replace function handle_new_user()
returns trigger
as $$
BEGIN
  INSERT INTO profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email
  );
  RETURN NEW;
END;
$$
language plpgsql
security definer
;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- 2. SELLER PROFILES
-- one seller_profile per approved/pending seller user
-- ============================================================================
CREATE TABLE seller_profiles (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,

-- shop info
  shop_name           TEXT NOT NULL,
  shop_description    TEXT,
  shop_banner_url     TEXT,
  shop_logo_url       TEXT,

-- location (can differ from profile location)
  province            TEXT NOT NULL,
  city                TEXT NOT NULL,
  barangay            TEXT NOT NULL,
  full_address        TEXT,
  latitude            NUMERIC(10, 7), -- for Leaflet map
  longitude           NUMERIC(10, 7), -- for Leaflet map

-- BIR / verification
  bir_document_url    TEXT,           -- uploaded to Supabase Storage
  bir_tin             TEXT,           -- mock TIN number

-- status
  status              seller_status NOT NULL DEFAULT 'pending',
  rejection_reason    TEXT,
  approved_at         TIMESTAMPTZ,
  approved_by         UUID REFERENCES profiles(id),

-- stats (denormalized for dashboard speed)
  total_sales         NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_orders        INT NOT NULL DEFAULT 0,
  average_rating      NUMERIC(3, 2) NOT NULL DEFAULT 0,
  total_reviews       INT NOT NULL DEFAULT 0,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER seller_profiles_updated_at
  BEFORE UPDATE ON seller_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 3. CATEGORIES
-- ============================================================================
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL UNIQUE,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  icon        TEXT,           -- icon name or emoji
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. PRODUCTS
-- ============================================================================
CREATE TABLE products (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id        UUID NOT NULL REFERENCES seller_profiles(id) ON DELETE CASCADE,
  category_id      UUID REFERENCES categories(id) ON DELETE SET NULL,

-- core fields
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL,
  description      TEXT,
  price            NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  original_price   NUMERIC(10, 2),          -- for showing discounts (mock)
  stock            INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  low_stock_threshold INT NOT NULL DEFAULT 5,
  unit             TEXT DEFAULT 'piece',    -- piece, kg, bundle, etc.

-- location (inherited from seller but stored for filtering)
  province         TEXT NOT NULL,
  city             TEXT NOT NULL,
  barangay         TEXT NOT NULL,

-- media
  thumbnail_url    TEXT,                    -- main image

-- status
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  is_draft         BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured      BOOLEAN NOT NULL DEFAULT FALSE,

-- ai generated flag
  ai_generated_description BOOLEAN NOT NULL DEFAULT FALSE,

-- stats (denormalized)
  average_rating   NUMERIC(3, 2) NOT NULL DEFAULT 0,
  total_reviews    INT NOT NULL DEFAULT 0,
  total_sold       INT NOT NULL DEFAULT 0,

-- search
  search_vector    TSVECTOR,

  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(seller_id, slug)
);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- full text search index
CREATE INDEX products_search_idx ON products USING GIN(search_vector);
CREATE INDEX products_category_idx ON products(category_id);
CREATE INDEX products_seller_idx ON products(seller_id);
CREATE INDEX products_province_idx ON products(province);
CREATE INDEX products_city_idx ON products(city);
CREATE INDEX products_price_idx ON products(price);

-- update search vector on insert/update
create or replace function update_product_search_vector()
returns trigger
as $$
BEGIN
  NEW.search_vector =
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.city, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.province, '')), 'C');
  RETURN NEW;
END;
$$
language plpgsql
;

CREATE TRIGGER products_search_vector_update
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_product_search_vector();

-- ============================================================================
-- 5. PRODUCT IMAGES
-- multiple images per product
-- ============================================================================
CREATE TABLE product_images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt_text    TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX product_images_product_idx ON product_images(product_id);

-- ============================================================================
-- 6. ADDRESSES
-- saved delivery addresses per user
-- ============================================================================
CREATE TABLE addresses (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label        TEXT NOT NULL DEFAULT 'Home',  -- Home, Work, Other
  full_name    TEXT NOT NULL,
  phone        TEXT NOT NULL,
  province     TEXT NOT NULL,
  city         TEXT NOT NULL,
  barangay     TEXT NOT NULL,
  street       TEXT NOT NULL,
  postal_code  TEXT,
  latitude     NUMERIC(10, 7),
  longitude    NUMERIC(10, 7),
  is_default   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX addresses_user_idx ON addresses(user_id);

-- ============================================================================
-- 7. ORDERS
-- ============================================================================
CREATE TABLE orders (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  seller_id           UUID NOT NULL REFERENCES seller_profiles(id) ON DELETE RESTRICT,

-- snapshot of delivery address at time of order
  delivery_address    JSONB NOT NULL,
  -- { full_name, phone, province, city, barangay, street, postal_code, latitude,
  -- longitude }
  -- status
  status              order_status NOT NULL DEFAULT 'pending',
  payment_status      payment_status NOT NULL DEFAULT 'unpaid',

-- mock payment
  payment_method      TEXT DEFAULT 'card',    -- card, gcash, maya (all mock)
  payment_reference   TEXT,                   -- mock ref number

-- pricing
  subtotal            NUMERIC(12, 2) NOT NULL,
  delivery_fee        NUMERIC(10, 2) NOT NULL DEFAULT 49.00,
  total_amount        NUMERIC(12, 2) NOT NULL,

-- tracking (mock coords for Leaflet)
  seller_latitude     NUMERIC(10, 7),
  seller_longitude    NUMERIC(10, 7),
  buyer_latitude      NUMERIC(10, 7),
  buyer_longitude     NUMERIC(10, 7),

-- timestamps per status (for timeline)
  confirmed_at        TIMESTAMPTZ,
  packed_at           TIMESTAMPTZ,
  out_for_delivery_at TIMESTAMPTZ,
  delivered_at        TIMESTAMPTZ,
  cancelled_at        TIMESTAMPTZ,
  cancellation_reason TEXT,

-- notes
  customer_notes      TEXT,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX orders_customer_idx ON orders(customer_id);
CREATE INDEX orders_seller_idx ON orders(seller_id);
CREATE INDEX orders_status_idx ON orders(status);
CREATE INDEX orders_created_at_idx ON orders(created_at DESC);

-- ============================================================================
-- 8. ORDER ITEMS
-- line items per order
-- ============================================================================
CREATE TABLE order_items (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id         UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id       UUID REFERENCES products(id) ON DELETE SET NULL,

-- snapshot at time of purchase (product may change later)
  product_name     TEXT NOT NULL,
  product_image    TEXT,
  unit_price       NUMERIC(10, 2) NOT NULL,
  quantity         INT NOT NULL CHECK (quantity > 0),
  subtotal         NUMERIC(12, 2) NOT NULL,

-- review tracking
  review_id        UUID,                      -- filled after review is submitted

  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX order_items_order_idx ON order_items(order_id);
CREATE INDEX order_items_product_idx ON order_items(product_id);

-- ============================================================================
-- 9. CART ITEMS
-- persistent cart stored in DB (per user)
-- ============================================================================
CREATE TABLE cart_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity    INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, product_id)
);

CREATE TRIGGER cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX cart_items_user_idx ON cart_items(user_id);

-- ============================================================================
-- 10. REVIEWS
-- product reviews by customers (only after delivered order)
-- ============================================================================
CREATE TABLE reviews (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id   UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  seller_id    UUID NOT NULL REFERENCES seller_profiles(id) ON DELETE CASCADE,
  customer_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id     UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

  rating       SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      TEXT,
  is_flagged   BOOLEAN NOT NULL DEFAULT FALSE,   -- admin moderation
  flag_reason  TEXT,

  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

-- one review per customer per order item
  UNIQUE(customer_id, order_id, product_id)
);

CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX reviews_product_idx ON reviews(product_id);
CREATE INDEX reviews_seller_idx ON reviews(seller_id);
CREATE INDEX reviews_customer_idx ON reviews(customer_id);

-- update product and seller average rating after review insert/update/delete
create or replace function update_ratings_on_review()
returns trigger
as
    $$
DECLARE
  product_uuid UUID;
  seller_uuid UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    product_uuid := OLD.product_id;
    seller_uuid := OLD.seller_id;
  ELSE
    product_uuid := NEW.product_id;
    seller_uuid := NEW.seller_id;
  END IF;

  -- update product rating
  UPDATE products SET
    average_rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE product_id = product_uuid),
    total_reviews  = (SELECT COUNT(*) FROM reviews WHERE product_id = product_uuid)
  WHERE id = product_uuid;

  -- update seller rating
  UPDATE seller_profiles SET
    average_rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE seller_id = seller_uuid),
    total_reviews  = (SELECT COUNT(*) FROM reviews WHERE seller_id = seller_uuid)
  WHERE id = seller_uuid;

  RETURN COALESCE(NEW, OLD);
END;
$$
language plpgsql
;

CREATE TRIGGER reviews_update_ratings
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_ratings_on_review();

-- ============================================================================
-- 11. WISHLIST
-- ============================================================================
CREATE TABLE wishlist (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, product_id)
);

CREATE INDEX wishlist_user_idx ON wishlist(user_id);

-- ============================================================================
-- 12. NOTIFICATIONS
-- ============================================================================
CREATE TABLE notifications (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type         notification_type NOT NULL,
  title        TEXT NOT NULL,
  body         TEXT NOT NULL,
  is_read      BOOLEAN NOT NULL DEFAULT FALSE,

-- optional link context
  entity_type  TEXT,    -- 'order' | 'product' | 'seller' | 'ticket'
  entity_id    UUID,    -- the relevant record ID

  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX notifications_user_idx ON notifications(user_id);
CREATE INDEX notifications_unread_idx ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX notifications_created_at_idx ON notifications(created_at DESC);

-- ============================================================================
-- 13. CONVERSATIONS
-- one conversation per customer-seller pair
-- ============================================================================
CREATE TABLE conversations (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id     UUID NOT NULL REFERENCES seller_profiles(id) ON DELETE CASCADE,
  product_id    UUID REFERENCES products(id) ON DELETE SET NULL,  -- optional context

  last_message  TEXT,
  last_message_at TIMESTAMPTZ,
  unread_count_customer INT NOT NULL DEFAULT 0,
  unread_count_seller   INT NOT NULL DEFAULT 0,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(customer_id, seller_id)
);

CREATE TRIGGER conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX conversations_customer_idx ON conversations(customer_id);
CREATE INDEX conversations_seller_idx ON conversations(seller_id);

-- ============================================================================
-- 14. MESSAGES
-- ============================================================================
CREATE TABLE messages (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id  UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body             TEXT NOT NULL,
  is_read          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX messages_conversation_idx ON messages(conversation_id);
CREATE INDEX messages_created_at_idx ON messages(created_at ASC);

-- ============================================================================
-- 15. SUPPORT TICKETS
-- ============================================================================
CREATE TABLE support_tickets (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject      TEXT NOT NULL,
  category     ticket_category NOT NULL DEFAULT 'other',
  status       ticket_status NOT NULL DEFAULT 'open',

-- optional reference
  order_id     UUID REFERENCES orders(id) ON DELETE SET NULL,
  product_id   UUID REFERENCES products(id) ON DELETE SET NULL,

  resolved_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX support_tickets_user_idx ON support_tickets(user_id);
CREATE INDEX support_tickets_status_idx ON support_tickets(status);

-- ============================================================================
-- 16. SUPPORT MESSAGES
-- thread messages per ticket
-- ============================================================================
CREATE TABLE support_messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id   UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body        TEXT NOT NULL,
  is_staff    BOOLEAN NOT NULL DEFAULT FALSE,   -- TRUE = admin/support reply
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX support_messages_ticket_idx ON support_messages(ticket_id);

-- ============================================================================
-- 17. INVENTORY LOGS
-- track every stock change
-- ============================================================================
CREATE TABLE inventory_logs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id   UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  seller_id    UUID NOT NULL REFERENCES seller_profiles(id) ON DELETE CASCADE,
  change       INT NOT NULL,              -- positive = restock, negative = sold/deducted
  reason       TEXT NOT NULL,             -- 'sale', 'manual_update', 'cancellation', 'adjustment'
  stock_before INT NOT NULL,
  stock_after  INT NOT NULL,
  order_id     UUID REFERENCES orders(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX inventory_logs_product_idx ON inventory_logs(product_id);
CREATE INDEX inventory_logs_seller_idx ON inventory_logs(seller_id);

-- ============================================================================
-- 18. SELLER ANALYTICS (daily snapshots for charts)
-- ============================================================================
CREATE TABLE seller_analytics (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id    UUID NOT NULL REFERENCES seller_profiles(id) ON DELETE CASCADE,
  date         DATE NOT NULL,
  revenue      NUMERIC(12, 2) NOT NULL DEFAULT 0,
  orders_count INT NOT NULL DEFAULT 0,
  units_sold   INT NOT NULL DEFAULT 0,
  new_reviews  INT NOT NULL DEFAULT 0,

  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(seller_id, date)
);

CREATE INDEX seller_analytics_seller_idx ON seller_analytics(seller_id);
CREATE INDEX seller_analytics_date_idx ON seller_analytics(date DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles: users can read own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles: users can update own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles: admin full access" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "profiles: public read basic info" ON profiles FOR SELECT USING (TRUE);

-- seller_profiles
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "seller_profiles: owner access" ON seller_profiles FOR ALL USING (user_id = auth.uid());
CREATE POLICY "seller_profiles: public read approved" ON seller_profiles FOR SELECT USING (status = 'approved');
CREATE POLICY "seller_profiles: admin full access" ON seller_profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products: public read active" ON products FOR SELECT USING (is_active = TRUE AND is_draft = FALSE);
CREATE POLICY "products: seller manages own" ON products FOR ALL USING (
  seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "products: admin full access" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders: customer sees own" ON orders FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "orders: customer creates" ON orders FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "orders: seller sees own" ON orders FOR SELECT USING (
  seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "orders: seller updates status" ON orders FOR UPDATE USING (
  seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "orders: admin full access" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- cart_items
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cart: user manages own" ON cart_items FOR ALL USING (user_id = auth.uid());

-- wishlist
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wishlist: user manages own" ON wishlist FOR ALL USING (user_id = auth.uid());

-- notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications: user sees own" ON notifications FOR ALL USING (user_id = auth.uid());

-- conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "conversations: participants only" ON conversations FOR ALL USING (
  customer_id = auth.uid() OR
  seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid())
);

-- messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages: conversation participants" ON messages FOR ALL USING (
  conversation_id IN (
    SELECT id FROM conversations
    WHERE customer_id = auth.uid()
    OR seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid())
  )
);

-- reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews: public read" ON reviews FOR SELECT USING (TRUE);
CREATE POLICY "reviews: customer creates own" ON reviews FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "reviews: customer updates own" ON reviews FOR UPDATE USING (customer_id = auth.uid());
CREATE POLICY "reviews: admin full access" ON reviews FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- support_tickets
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "support_tickets: user manages own" ON support_tickets FOR ALL USING (user_id = auth.uid());
CREATE POLICY "support_tickets: admin full access" ON support_tickets FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- support_messages
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "support_messages: ticket owner" ON support_messages FOR ALL USING (
  ticket_id IN (SELECT id FROM support_tickets WHERE user_id = auth.uid())
);
CREATE POLICY "support_messages: admin full access" ON support_messages FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- inventory_logs
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inventory_logs: seller sees own" ON inventory_logs FOR SELECT USING (
  seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid())
);
    CREATE POLICY "inventory_logs: admin full access" ON inventory_logs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- seller_analytics
ALTER TABLE seller_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "seller_analytics: seller sees own" ON seller_analytics FOR SELECT USING (
  seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid())
);
  CREATE POLICY "seller_analytics: admin full access" ON seller_analytics FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================================
-- SEED DATA — CATEGORIES
-- ============================================================================
INSERT INTO categories (name, slug, description, icon) VALUES
  ('Fresh Produce',     'fresh-produce',     'Fruits, vegetables, and farm-fresh goods',         '🥬'),
  ('Meat & Seafood',    'meat-seafood',       'Fresh meat, poultry, and seafood',                 '🥩'),
  ('Dairy & Eggs',      'dairy-eggs',         'Milk, cheese, butter, eggs',                       '🥚'),
  ('Baked Goods',       'baked-goods',        'Bread, pastries, cakes, and local kakanin',        '🍞'),
  ('Beverages',         'beverages',          'Juices, coffee, teas, and local drinks',           '🍵'),
  ('Dry Goods',         'dry-goods',          'Rice, grains, beans, spices, and pantry staples',  '🌾'),
  ('Condiments',        'condiments',         'Sauces, vinegars, bagoong, and local condiments',  '🫙'),
  ('Snacks',            'snacks',             'Local chips, dried fruits, nuts, and sweets',      '🍿'),
  ('Handicrafts',       'handicrafts',        'Handmade crafts, decor, and local artisan goods',  '🧺'),
  ('Clothing',          'clothing',           'Local fashion, accessories, and textiles',         '👗'),
  ('Health & Wellness', 'health-wellness',    'Herbal products, supplements, and wellness items', '🌿'),
  ('Home & Living',     'home-living',        'Furniture, home decor, and household items',       '🏠'),
  ('Plants & Garden',   'plants-garden',      'Indoor plants, seedlings, and garden supplies',    '🌱'),
  ('Street Food',       'street-food',        'Ready-to-eat local street food and delicacies',   '🍢'),
  ('Other',             'other',              'Everything else',                                  '📦');

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================




-- ============================================================================
-- PUBMARKET — STORAGE BUCKET POLICIES
-- Run this AFTER creating the buckets manually in Supabase dashboard:
-- pubmarket-avatars   (public)
-- pubmarket-products  (public)
-- pubmarket-shops     (public)
-- pubmarket-documents (public — demo only)
-- ============================================================================

-- Drop existing policies first (safe to re-run)
DROP POLICY IF EXISTS "avatars: public read"          ON storage.objects;
DROP POLICY IF EXISTS "products: public read"         ON storage.objects;
DROP POLICY IF EXISTS "shops: public read"            ON storage.objects;
DROP POLICY IF EXISTS "documents: public read"        ON storage.objects;
DROP POLICY IF EXISTS "avatars: user uploads own"     ON storage.objects;
DROP POLICY IF EXISTS "products: seller uploads own"  ON storage.objects;
DROP POLICY IF EXISTS "shops: seller uploads own"     ON storage.objects;
DROP POLICY IF EXISTS "documents: owner uploads own"  ON storage.objects;
DROP POLICY IF EXISTS "storage: owner can update own" ON storage.objects;
DROP POLICY IF EXISTS "storage: owner can delete own" ON storage.objects;

-- Public read (all 4 buckets are public for demo)
CREATE POLICY "avatars: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pubmarket-avatars');

CREATE POLICY "products: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pubmarket-products');

CREATE POLICY "shops: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pubmarket-shops');

CREATE POLICY "documents: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pubmarket-documents');

-- Authenticated uploads (each user uploads only under their own userId folder)
CREATE POLICY "avatars: user uploads own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'pubmarket-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "products: seller uploads own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'pubmarket-products'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "shops: seller uploads own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'pubmarket-shops'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "documents: owner uploads own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'pubmarket-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Owner can replace and delete their own files
CREATE POLICY "storage: owner can update own"
  ON storage.objects FOR UPDATE
  USING (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "storage: owner can delete own"
  ON storage.objects FOR DELETE
  USING (auth.uid()::text = (storage.foldername(name))[1]);
