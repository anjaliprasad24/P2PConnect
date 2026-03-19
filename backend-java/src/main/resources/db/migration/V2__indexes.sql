-- Add helpful indexes for common joins/lookups
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Optional category index if you filter by category frequently
-- CREATE INDEX idx_products_category ON products(category);