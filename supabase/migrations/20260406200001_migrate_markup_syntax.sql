-- 將商品描述中的舊語法轉換為新語法
-- ##text## → ==text==（高亮備註）
-- ::text:: 保留不變（標籤語法）

UPDATE products
SET detail = jsonb_set(
  detail,
  '{desc}',
  to_jsonb(
    regexp_replace(
      detail->>'desc',
      '##(.*?)##', '==\1==', 'g'
    )
  )
)
WHERE detail->>'desc' IS NOT NULL
  AND detail->>'desc' LIKE '%##%';
