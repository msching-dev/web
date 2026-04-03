-- Categories
INSERT INTO categories (name, slug, sort_order) VALUES ('餅乾', 'cookie', 1);
INSERT INTO categories (name, slug, sort_order) VALUES ('瑪德蓮', 'madeleine', 2);
INSERT INTO categories (name, slug, sort_order) VALUES ('節慶禮盒', 'festival', 3);

-- Products
INSERT INTO products (name, slug, alias, description, detail, price, compare_price, stock_quantity, max_order_qty, images, is_active, is_featured, tags, specifications, portion_size, include_size, unit, nutrition, category_id)
VALUES (
  '手作杏仁瓦片',
  'almondCookie',
  '純粹',
  NULL,
  '{"desc":"我們精心製作的手工杏仁片是一種精緻的甜點，\n具有脆脆的質地和濃郁的杏仁味道，##每包7片##。","nonAdditive":"我們的杏仁片絕不添加人工色素、防腐劑或其他化學添加劑，保證了產品的純淨和健康。","howToEat":"這款手工製作的杏仁片是一種絕佳的甜點選擇，可供單獨享用，也可以搭配咖啡、茶或其他飲品一起品嘗。您還可以將它們加入麥片、優格或冰淇淋中，增添一份香脆美味。","preservationMethod":"請將杏仁片存放在密封的容器中，避免陽光直射和潮濕的環境，以保持其新鮮度和脆度。建議在開封後盡快食用，以充分享受其美味。","precautions":"本產品含有堅果成分，可能引起過敏反應。請在購買前仔細閱讀產品成分標籤，並避免食用者對任何成分過敏的情況。本產品含有動物性奶油及蛋，並非適合素食者食用。","tastePeriod":"請參考包裝上標示的賞味期限，以保證最佳品質和口感。本產品的賞味期限為製造日期起20天"}'::jsonb,
  105,
  115,
  99,
  20,
  '[{"url":"/images/products/almond_cookie.png","alt":"手作杏仁瓦片","sort_order":-1},{"url":"/images/products/almondCookie/1.jpg","alt":"手作杏仁瓦片","sort_order":0},{"url":"/images/products/almondCookie/2.jpg","alt":"手作杏仁瓦片","sort_order":1},{"url":"/images/products/almondCookie/3.jpg","alt":"手作杏仁瓦片","sort_order":2},{"url":"/images/products/almondCookie/4.jpg","alt":"手作杏仁瓦片","sort_order":3}]'::jsonb,
  true,
  true,
  ARRAY['hot'],
  '[{"key":"原味","value":1}]'::jsonb,
  90,
  '7片',
  '包',
  '{"perServing":[{"key":"熱量","value":138.3},{"key":"蛋白質","value":2.9},{"key":"脂肪","value":9.3},{"key":"飽和脂肪","value":5.9},{"key":"反式脂肪","value":0.031},{"key":"碳水化合物","value":11.5},{"key":"糖","value":0.7},{"key":"鈉","value":0.182}],"perHundred":[{"key":"熱量","value":153.7},{"key":"蛋白質","value":3.3},{"key":"脂肪","value":10.3},{"key":"飽和脂肪","value":6.6},{"key":"反式脂肪","value":3.4},{"key":"碳水化合物","value":12.8},{"key":"糖","value":0.7},{"key":"鈉","value":0.203}]}'::jsonb,
  (SELECT id FROM categories WHERE slug = 'cookie')
);

INSERT INTO products (name, slug, alias, description, detail, price, compare_price, stock_quantity, max_order_qty, images, is_active, is_featured, tags, specifications, portion_size, include_size, unit, nutrition, category_id)
VALUES (
  '蜂蜜檸檬瑪德蓮',
  'honeyLemonMadeleine',
  NULL,
  NULL,
  '{"desc":"新鮮的檸檬汁和天然蜂蜜的完美結合，呈現了這款蜂蜜檸檬瑪德蓮的極致美味。\n每一口都帶來清新風味和甜蜜滋味。","nonAdditive":"本產品採用天然食材製作，不添加人工色素、香料或防腐劑，讓您安心享受每一口。","howToEat":"可直接食用作為甜點或下午茶的美味選擇，也可搭配您喜歡的飲品一同享用，如茶或咖啡。","preservationMethod":"請存放於陰涼乾燥處，避免陽光直射。建議於開封後盡快食用以保持最佳口感。由於無添加劑，請注意保存期限，避免長時間存放。常溫可存放7天，收到後兩天內未食用請冷藏存放，冷藏可存放14天，建議用烤箱180度回烤1~2分鐘或退冰後再食用。","precautions":"本產品含有蜂蜜成分，可能引起過敏反應。請在購買前仔細閱讀產品成分標籤，並避免食用者對任何成分過敏的情況。本產品含有動物性奶油及蛋，並非適合素食者食用。","tastePeriod":"請參考包裝上標示的賞味期限，以保證最佳品質和口感。本產品的賞味期限為製造日期起7~14天"}'::jsonb,
  50,
  60,
  99,
  50,
  '[{"url":"/images/products/honeyLemon_madeleine.png","alt":"蜂蜜檸檬瑪德蓮","sort_order":-1},{"url":"/images/products/honeyLemonMadeleine/1.jpg","alt":"蜂蜜檸檬瑪德蓮","sort_order":0},{"url":"/images/products/honeyLemonMadeleine/2.jpg","alt":"蜂蜜檸檬瑪德蓮","sort_order":1}]'::jsonb,
  true,
  false,
  ARRAY['top_2'],
  '[{"key":"蜂蜜檸檬","value":1}]'::jsonb,
  30,
  '',
  '顆',
  '{"perServing":[{"key":"熱量","value":91.4},{"key":"蛋白質","value":1.6},{"key":"脂肪","value":6.4},{"key":"飽和脂肪","value":4.2},{"key":"反式脂肪","value":0.021},{"key":"碳水化合物","value":7},{"key":"糖","value":0.3},{"key":"鈉","value":0.398}],"perHundred":[{"key":"熱量","value":304.8},{"key":"蛋白質","value":5.3},{"key":"脂肪","value":21.3},{"key":"飽和脂肪","value":13.9},{"key":"反式脂肪","value":0.068},{"key":"碳水化合物","value":23.5},{"key":"糖","value":1.1},{"key":"鈉","value":1.326}]}'::jsonb,
  (SELECT id FROM categories WHERE slug = 'madeleine')
);

INSERT INTO products (name, slug, alias, description, detail, price, compare_price, stock_quantity, max_order_qty, images, is_active, is_featured, tags, specifications, portion_size, include_size, unit, nutrition, category_id)
VALUES (
  '伯爵茶瑪德蓮',
  'earlGreyTeaMadeleine',
  '高貴',
  NULL,
  '{"desc":"伯爵茶瑪德蓮是一款結合了經典法式甜點與濃郁伯爵茶香的糕點。\n其鬆軟細緻的口感和獨特的香氣讓人難以抗拒。","nonAdditive":"本產品採用天然食材製作，不添加人工色素、香料或防腐劑，讓您安心享受每一口。","howToEat":"可直接食用作為甜點或下午茶的美味選擇，也可搭配您喜歡的飲品一同享用，如茶或咖啡。","preservationMethod":"請存放於陰涼乾燥處，避免陽光直射。建議於開封後盡快食用以保持最佳口感。由於無添加劑，請注意保存期限，避免長時間存放。常溫可存放7天，收到後兩天內未食用請冷藏存放，冷藏可存放14天，建議用烤箱180度回烤1~2分鐘或退冰後再食用。","precautions":"請在購買前仔細閱讀產品成分標籤，並避免食用者對任何成分過敏的情況。本產品含有動物性奶油及蛋，並非適合素食者食用。","tastePeriod":"請參考包裝上標示的賞味期限，以保證最佳品質和口感。本產品的賞味期限為製造日期起7~14天"}'::jsonb,
  60,
  70,
  99,
  50,
  '[{"url":"/images/products/earlGaryTea_madeleine.png","alt":"伯爵茶瑪德蓮","sort_order":-1},{"url":"/images/products/earlGreyTeaMadeleine/1.jpg","alt":"伯爵茶瑪德蓮","sort_order":0},{"url":"/images/products/earlGreyTeaMadeleine/2.jpg","alt":"伯爵茶瑪德蓮","sort_order":1}]'::jsonb,
  true,
  true,
  ARRAY['top_1','hot'],
  '[{"key":"伯爵茶","value":1}]'::jsonb,
  30,
  '',
  '顆',
  '{"perServing":[{"key":"熱量","value":58.5},{"key":"蛋白質","value":1.6},{"key":"脂肪","value":3.4},{"key":"飽和脂肪","value":2.1},{"key":"反式脂肪","value":0.002},{"key":"碳水化合物","value":5.5},{"key":"糖","value":0.3},{"key":"鈉","value":0.107}],"perHundred":[{"key":"熱量","value":194.9},{"key":"蛋白質","value":5.4},{"key":"脂肪","value":11.4},{"key":"飽和脂肪","value":7},{"key":"反式脂肪","value":0.068},{"key":"碳水化合物","value":18.5},{"key":"糖","value":1.1},{"key":"鈉","value":0.358}]}'::jsonb,
  (SELECT id FROM categories WHERE slug = 'madeleine')
);

INSERT INTO products (name, slug, alias, description, detail, price, compare_price, stock_quantity, max_order_qty, images, is_active, is_featured, tags, specifications, portion_size, include_size, unit, nutrition, category_id)
VALUES (
  '巧克力瑪德蓮',
  'chocolateMadeleine',
  '浪漫',
  NULL,
  '{"desc":"巧克力瑪德蓮是一款精緻的法式小蛋糕，\n完美融合濃郁巧克力的香氣與鬆軟口感，帶來極致的甜點享受。","nonAdditive":"本產品採用天然食材製作，不添加人工色素、香料或防腐劑，讓您安心享受每一口。","howToEat":"可直接食用作為甜點或下午茶的美味選擇，也可搭配您喜歡的飲品一同享用，如茶或咖啡。","preservationMethod":"請存放於陰涼乾燥處，避免陽光直射。建議於開封後盡快食用以保持最佳口感。由於無添加劑，請注意保存期限，避免長時間存放。常溫可存放7天，收到後兩天內未食用請冷藏存放，冷藏可存放14天，建議用烤箱180度回烤1~2分鐘或退冰後再食用。","precautions":"本產品含有巧克力成分，可能引起過敏反應。請在購買前仔細閱讀產品成分標籤，並避免食用者對任何成分過敏的情況。本產品含有動物性奶油及蛋，並非適合素食者食用。","tastePeriod":"請參考包裝上標示的賞味期限，以保證最佳品質和口感。本產品的賞味期限為製造日期7~14天"}'::jsonb,
  60,
  70,
  99,
  50,
  '[{"url":"/images/products/chocolate_madeleine.png","alt":"巧克力瑪德蓮","sort_order":-1},{"url":"/images/products/chocolateMadeleine/1.jpg","alt":"巧克力瑪德蓮","sort_order":0},{"url":"/images/products/chocolateMadeleine/2.jpg","alt":"巧克力瑪德蓮","sort_order":1}]'::jsonb,
  true,
  false,
  ARRAY['top_2','hot'],
  '[{"key":"巧克力","value":1}]'::jsonb,
  30,
  '',
  '顆',
  '{"perServing":[{"key":"熱量","value":91.9},{"key":"蛋白質","value":1.8},{"key":"脂肪","value":6.4},{"key":"飽和脂肪","value":4.2},{"key":"反式脂肪","value":0.019},{"key":"碳水化合物","value":7},{"key":"糖","value":0.9},{"key":"鈉","value":0.094}],"perHundred":[{"key":"熱量","value":306.4},{"key":"蛋白質","value":6},{"key":"脂肪","value":21.3},{"key":"飽和脂肪","value":13.8},{"key":"反式脂肪","value":0.064},{"key":"碳水化合物","value":23.4},{"key":"糖","value":3.1},{"key":"鈉","value":0.314}]}'::jsonb,
  (SELECT id FROM categories WHERE slug = 'madeleine')
);

INSERT INTO products (name, slug, alias, description, detail, price, compare_price, stock_quantity, max_order_qty, images, is_active, is_featured, tags, specifications, portion_size, include_size, unit, nutrition, category_id)
VALUES (
  '抹茶瑪德蓮',
  'matchaMadeleine',
  '綠意',
  NULL,
  '{"desc":"抹茶瑪德蓮是一款融合了經典法式甜點與濃郁抹茶香氣的小蛋糕，特別選用日本宇治抹茶粉製作，\n其鬆軟口感和獨特風味帶來絕佳的味覺享受。","nonAdditive":"本產品採用天然食材製作，不添加人工色素、香料或防腐劑，讓您安心享受每一口。","howToEat":"可直接食用作為甜點或下午茶的美味選擇，也可搭配您喜歡的飲品一同享用，如茶或咖啡。","preservationMethod":"請存放於陰涼乾燥處，避免陽光直射。建議於開封後盡快食用以保持最佳口感。由於無添加劑，請注意保存期限，避免長時間存放。常溫可存放7天，收到後兩天內未食用請冷藏存放，冷藏可存放14天，建議用烤箱180度回烤1~2分鐘或退冰後再食用。","precautions":"本產品含有抹茶成分，可能引起過敏反應。請在購買前仔細閱讀產品成分標籤，並避免食用者對任何成分過敏的情況。本產品含有動物性奶油及蛋，並非適合素食者食用。","tastePeriod":"請參考包裝上標示的賞味期限，以保證最佳品質和口感。本產品的賞味期限為製造日期起7~14天"}'::jsonb,
  60,
  70,
  99,
  50,
  '[{"url":"/images/products/matcha_madeleine.png","alt":"抹茶瑪德蓮","sort_order":-1},{"url":"","alt":"抹茶瑪德蓮","sort_order":0},{"url":"","alt":"抹茶瑪德蓮","sort_order":1},{"url":"","alt":"抹茶瑪德蓮","sort_order":2},{"url":"","alt":"抹茶瑪德蓮","sort_order":3}]'::jsonb,
  true,
  false,
  ARRAY['new'],
  '[{"key":"抹茶","value":1}]'::jsonb,
  30,
  '',
  '顆',
  '{"perServing":[{"key":"熱量","value":87.5},{"key":"蛋白質","value":1.7},{"key":"脂肪","value":6.4},{"key":"飽和脂肪","value":4.2},{"key":"反式脂肪","value":0.023},{"key":"碳水化合物","value":6},{"key":"糖","value":0.2},{"key":"鈉","value":0.095}],"perHundred":[{"key":"熱量","value":291.6},{"key":"蛋白質","value":5.6},{"key":"脂肪","value":21.3},{"key":"飽和脂肪","value":13.9},{"key":"反式脂肪","value":0.076},{"key":"碳水化合物","value":20.1},{"key":"糖","value":0.47},{"key":"鈉","value":0.318}]}'::jsonb,
  (SELECT id FROM categories WHERE slug = 'madeleine')
);

INSERT INTO products (name, slug, alias, description, detail, price, compare_price, stock_quantity, max_order_qty, images, is_active, is_featured, tags, specifications, portion_size, include_size, unit, nutrition, category_id)
VALUES (
  '蔓越莓瑪德蓮',
  'cranBerryMadeleine',
  '嫵媚',
  NULL,
  '{"desc":"蔓越莓瑪德蓮是一款結合經典法式小蛋糕與酸甜蔓越莓的美味甜點，\n口感鬆軟，果香濃郁，帶來清新愉悅的味覺體驗。","nonAdditive":"本產品採用天然食材製作，不添加人工色素、香料或防腐劑，讓您安心享受每一口。","howToEat":"可直接食用作為甜點或下午茶的美味選擇，也可搭配您喜歡的飲品一同享用，如茶或咖啡。","preservationMethod":"請存放於陰涼乾燥處，避免陽光直射。建議於開封後盡快食用以保持最佳口感。由於無添加劑，請注意保存期限，避免長時間存放。常溫可存放7天，收到後兩天內未食用請冷藏存放，冷藏可存放14天，建議用烤箱180度回烤1~2分鐘或退冰後再食用。","precautions":"本產品含有蔓越莓成分，可能引起過敏反應。請在購買前仔細閱讀產品成分標籤，並避免食用者對任何成分過敏的情況。本產品含有動物性奶油及蛋，並非適合素食者食用。","tastePeriod":"請參考包裝上標示的賞味期限，以保證最佳品質和口感。本產品的賞味期限為製造日期起7~14天"}'::jsonb,
  60,
  70,
  99,
  50,
  '[{"url":"/images/products/cranberry_madeleine.png","alt":"蔓越莓瑪德蓮","sort_order":-1},{"url":"","alt":"蔓越莓瑪德蓮","sort_order":0},{"url":"","alt":"蔓越莓瑪德蓮","sort_order":1},{"url":"","alt":"蔓越莓瑪德蓮","sort_order":2},{"url":"","alt":"蔓越莓瑪德蓮","sort_order":3}]'::jsonb,
  true,
  false,
  ARRAY['top_2','hot'],
  '[{"key":"蔓越莓","value":1}]'::jsonb,
  30,
  '',
  '顆',
  '{"perServing":[{"key":"熱量","value":94.2},{"key":"蛋白質","value":1.4},{"key":"脂肪","value":6.6},{"key":"飽和脂肪","value":4.3},{"key":"反式脂肪","value":0.021},{"key":"碳水化合物","value":7.5},{"key":"糖","value":2.4},{"key":"鈉","value":9.9}],"perHundred":[{"key":"熱量","value":313.9},{"key":"蛋白質","value":4.8},{"key":"脂肪","value":22.1},{"key":"飽和脂肪","value":14.3},{"key":"反式脂肪","value":0.071},{"key":"碳水化合物","value":25.2},{"key":"糖","value":7.8},{"key":"鈉","value":0.033}]}'::jsonb,
  (SELECT id FROM categories WHERE slug = 'madeleine')
);

INSERT INTO products (name, slug, alias, description, detail, price, compare_price, stock_quantity, max_order_qty, images, is_active, is_featured, tags, specifications, portion_size, include_size, unit, nutrition, category_id)
VALUES (
  '泰式奶茶瑪德蓮',
  'thaiTeaMadeleine',
  '愜意',
  NULL,
  '{"desc":"這款泰式奶茶瑪德蓮，採用傳統法式配方，融合泰式奶茶的濃郁茶香。\n每一口都充滿濃郁奶茶香氣與瑪德蓮的經典鬆軟，風味層次豐富且持久。\n搭配天然材料，不添加人工色素及防腐劑，讓你安心享受原汁原味的手作甜點。","nonAdditive":"本產品採用天然食材製作，不添加人工色素、香料或防腐劑，讓您安心享受每一口。","howToEat":"可直接享用或搭配奶茶、咖啡增添風味。建議於常溫下靜置片刻，讓口感更為柔軟。","preservationMethod":"請存放於陰涼乾燥處，避免陽光直射。建議於開封後盡快食用以保持最佳口感。由於無添加劑，請注意保存期限，避免長時間存放。常溫可存放7天，收到後兩天內未食用請冷藏存放，冷藏可存放14天，建議用烤箱180度回烤1~2分鐘或退冰後再食用。","precautions":"本產品含有動物性奶油及蛋，並非適合素食者食用。","tastePeriod":"請參考包裝上標示的賞味期限，以保證最佳品質和口感。本產品的賞味期限為製造日期起7～14天"}'::jsonb,
  60,
  70,
  99,
  50,
  '[{"url":"/images/products/thaiTea_madeleine.png","alt":"泰式奶茶瑪德蓮","sort_order":-1},{"url":"/images/products/thaiTeaMadeleine/1.jpg","alt":"泰式奶茶瑪德蓮","sort_order":0},{"url":"/images/products/thaiTeaMadeleine/2.jpg","alt":"泰式奶茶瑪德蓮","sort_order":1},{"url":"/images/products/thaiTeaMadeleine/3.png","alt":"泰式奶茶瑪德蓮","sort_order":2},{"url":"/images/products/thaiTeaMadeleine/4.jpg","alt":"泰式奶茶瑪德蓮","sort_order":3}]'::jsonb,
  true,
  false,
  ARRAY['new','hot'],
  '[{"key":"泰式奶茶","value":1}]'::jsonb,
  30,
  '',
  '顆',
  '{"perServing":[{"key":"熱量","value":94.2},{"key":"蛋白質","value":1.4},{"key":"脂肪","value":6.6},{"key":"飽和脂肪","value":4.3},{"key":"反式脂肪","value":0.021},{"key":"碳水化合物","value":7.5},{"key":"糖","value":2.4},{"key":"鈉","value":0.009}],"perHundred":[{"key":"熱量","value":313.9},{"key":"蛋白質","value":4.8},{"key":"脂肪","value":22.1},{"key":"飽和脂肪","value":14.3},{"key":"反式脂肪","value":0.071},{"key":"碳水化合物","value":25.2},{"key":"糖","value":7.8},{"key":"鈉","value":0.033}]}'::jsonb,
  (SELECT id FROM categories WHERE slug = 'madeleine')
);

INSERT INTO products (name, slug, alias, description, detail, price, compare_price, stock_quantity, max_order_qty, images, is_active, is_featured, tags, specifications, portion_size, include_size, unit, nutrition, category_id)
VALUES (
  '菠蘿小餅乾',
  'poloCookie',
  '甜在心',
  NULL,
  '{"desc":"波羅小餅乾是一款口感外脆內鬆、香甜可口的小點心。\n每一口都帶有濃郁的奶油香氣和微微的甜味，令人愛不釋手。\n餅乾的外觀呈現金黃色澤，表面有細緻的格子紋理，增添視覺上的享受。##每包6顆##","nonAdditive":"本產品選用高品質天然原料製作，不添加人工色素、香精和防腐劑。讓您在享受美味的同時，也能放心品嚐每一口。","howToEat":"可搭配牛奶或豆漿，作為美味的早餐。也可以配上一杯熱茶或咖啡作為理想的下午茶點心。也可以隨時隨地當作解饞的小零食，無論在家中還是辦公室，都能輕鬆享用。","preservationMethod":"開封後請放置於密封容器中，保持乾燥，避免受潮。建議於開封後盡快食用以保持最佳口感。由於無添加劑，請注意保存期限，避免長時間存放。","precautions":"本產品含有小麥、奶製品及雞蛋，不適合對上述成分過敏者食用。請在購買前仔細閱讀產品成分標籤，並避免食用者對任何成分過敏的情況。本產品含有動物性奶油及蛋，並非適合素食者食用。","tastePeriod":"本產品賞味期限為製造日期起一個月。請於包裝上的有效日期前食用，以確保最佳品質和風味。"}'::jsonb,
  60,
  70,
  99,
  50,
  '[{"url":"/images/products/polo_cookie.png","alt":"菠蘿小餅乾","sort_order":-1},{"url":"/images/products/poloCookie/1.jpg","alt":"菠蘿小餅乾","sort_order":0},{"url":"/images/products/poloCookie/3.jpg","alt":"菠蘿小餅乾","sort_order":1},{"url":"/images/products/poloCookie/4.jpg","alt":"菠蘿小餅乾","sort_order":2}]'::jsonb,
  true,
  false,
  ARRAY['new','hot'],
  '[{"key":"原味","value":1}]'::jsonb,
  60,
  '6顆',
  '包',
  '{"perServing":[{"key":"熱量","value":184},{"key":"蛋白質","value":3.5},{"key":"脂肪","value":21.6},{"key":"飽和脂肪","value":8},{"key":"反式脂肪","value":0},{"key":"碳水化合物","value":16.8},{"key":"糖","value":6.6},{"key":"鈉","value":0.068}],"perHundred":[{"key":"熱量","value":204.4},{"key":"蛋白質","value":3.9},{"key":"脂肪","value":24},{"key":"飽和脂肪","value":8.9},{"key":"反式脂肪","value":0},{"key":"碳水化合物","value":18.7},{"key":"糖","value":7.3},{"key":"鈉","value":0.075}]}'::jsonb,
  (SELECT id FROM categories WHERE slug = 'cookie')
);

INSERT INTO products (name, slug, alias, description, detail, price, compare_price, stock_quantity, max_order_qty, images, is_active, is_featured, tags, specifications, portion_size, include_size, unit, nutrition, category_id)
VALUES (
  '巧遇泰香瑪德蓮禮盒',
  'thaiAndChocolateMadeleine',
  '醇雅',
  NULL,
  '{"desc":"這款精美禮盒包含**兩種特色瑪德蓮口味**，讓您在送禮或自用時都能感受到細膩甜點的魔力！\n內含::巧克力瑪德蓮3顆::+::泰式奶茶瑪德蓮3顆::。\n##禮盒外觀是隨機的哦！##","nonAdditive":"本產品採用天然食材製作，不添加人工色素、香料或防腐劑，讓您安心享受每一口。","howToEat":"可直接享用或搭配奶茶、咖啡增添風味。建議於常溫下靜置片刻，讓口感更為柔軟。","preservationMethod":"請存放於陰涼乾燥處，避免陽光直射。建議於開封後盡快食用以保持最佳口感。由於無添加劑，請注意保存期限，避免長時間存放。常溫可存放7天，收到後兩天內未食用請冷藏存放，冷藏可存放14天，建議用烤箱180度回烤1~2分鐘或退冰後再食用。","precautions":"本產品含有動物性奶油及蛋，並非適合素食者食用。","tastePeriod":"請參考包裝上標示的賞味期限，以保證最佳品質和口感。本產品的賞味期限為製造日期起7～14天"}'::jsonb,
  399,
  NULL,
  99,
  50,
  '[{"url":"/images/products/thai_and_chocolate_madeleine.png","alt":"巧遇泰香瑪德蓮禮盒","sort_order":-1},{"url":"/images/products/thaiAndChocolateMadeleine/1.jpg","alt":"巧遇泰香瑪德蓮禮盒","sort_order":0},{"url":"/images/products/thaiAndChocolateMadeleine/2.jpg","alt":"巧遇泰香瑪德蓮禮盒","sort_order":1},{"url":"/images/products/thaiAndChocolateMadeleine/3.jpg","alt":"巧遇泰香瑪德蓮禮盒","sort_order":2},{"url":"/images/products/thaiAndChocolateMadeleine/4.jpg","alt":"巧遇泰香瑪德蓮禮盒","sort_order":3}]'::jsonb,
  true,
  false,
  ARRAY['christmas','hot'],
  '[]'::jsonb,
  30,
  '6顆',
  '盒',
  '{"giftBox":[{"taste":"巧克力","content":[{"key":"熱量","value":91.9},{"key":"蛋白質","value":1.8},{"key":"脂肪","value":6.4},{"key":"飽和脂肪","value":4.2},{"key":"反式脂肪","value":0.019},{"key":"碳水化合物","value":7},{"key":"糖","value":0.9},{"key":"鈉","value":0.094}]},{"taste":"泰式奶茶","content":[{"key":"熱量","value":94.2},{"key":"蛋白質","value":1.4},{"key":"脂肪","value":6.6},{"key":"飽和脂肪","value":4.3},{"key":"反式脂肪","value":0.021},{"key":"碳水化合物","value":7.5},{"key":"糖","value":2.4},{"key":"鈉","value":0.009}]}]}'::jsonb,
  (SELECT id FROM categories WHERE slug = 'festival')
);

INSERT INTO products (name, slug, alias, description, detail, price, compare_price, stock_quantity, max_order_qty, images, is_active, is_featured, tags, specifications, portion_size, include_size, unit, nutrition, category_id)
VALUES (
  '蜜檸茶語瑪德蓮禮盒',
  'earlGreyTeaAndHoneyLemonMadeleine',
  '馥沁',
  NULL,
  '{"desc":"這款精美禮盒包含**兩種特色瑪德蓮口味**，讓您在送禮或自用時都能感受到細膩甜點的魔力！\n內含::蜂蜜檸檬瑪德蓮 3顆:: + ::伯爵茶瑪德蓮3顆::。\n##禮盒外觀是隨機的哦！##","nonAdditive":"本產品採用天然食材製作，不添加人工色素、香料或防腐劑，讓您安心享受每一口。","howToEat":"可直接享用或搭配奶茶、咖啡增添風味。建議於常溫下靜置片刻，讓口感更為柔軟。","preservationMethod":"請存放於陰涼乾燥處，避免陽光直射。建議於開封後盡快食用以保持最佳口感。由於無添加劑，請注意保存期限，避免長時間存放。常溫可存放7天，收到後兩天內未食用請冷藏存放，冷藏可存放14天，建議用烤箱180度回烤1~2分鐘或退冰後再食用。","precautions":"本產品含有動物性奶油及蛋，並非適合素食者食用。","tastePeriod":"請參考包裝上標示的賞味期限，以保證最佳品質和口感。本產品的賞味期限為製造日期起7～14天"}'::jsonb,
  369,
  NULL,
  99,
  50,
  '[{"url":"/images/products/earl_grey_tea_and_honey_lemon_madeleine.png","alt":"蜜檸茶語瑪德蓮禮盒","sort_order":-1},{"url":"/images/products/earlGreyTeaAndHoneyLemonMadeleine/1.jpg","alt":"蜜檸茶語瑪德蓮禮盒","sort_order":0},{"url":"/images/products/earlGreyTeaAndHoneyLemonMadeleine/2.jpg","alt":"蜜檸茶語瑪德蓮禮盒","sort_order":1},{"url":"/images/products/earlGreyTeaAndHoneyLemonMadeleine/3.jpg","alt":"蜜檸茶語瑪德蓮禮盒","sort_order":2},{"url":"/images/products/earlGreyTeaAndHoneyLemonMadeleine/4.jpg","alt":"蜜檸茶語瑪德蓮禮盒","sort_order":3}]'::jsonb,
  true,
  false,
  ARRAY['christmas','hot'],
  '[]'::jsonb,
  30,
  '6顆',
  '盒',
  '{"giftBox":[{"taste":"蜂蜜檸檬","content":[{"key":"熱量","value":91.4},{"key":"蛋白質","value":1.6},{"key":"脂肪","value":6.4},{"key":"飽和脂肪","value":4.2},{"key":"反式脂肪","value":0.021},{"key":"碳水化合物","value":7},{"key":"糖","value":0.3},{"key":"鈉","value":0.398}]},{"taste":"伯爵茶","content":[{"key":"熱量","value":58.5},{"key":"蛋白質","value":1.6},{"key":"脂肪","value":3.4},{"key":"飽和脂肪","value":2.1},{"key":"反式脂肪","value":0.002},{"key":"碳水化合物","value":5.5},{"key":"糖","value":0.3},{"key":"鈉","value":0.107}]}]}'::jsonb,
  (SELECT id FROM categories WHERE slug = 'festival')
);

INSERT INTO products (name, slug, alias, description, detail, price, compare_price, stock_quantity, max_order_qty, images, is_active, is_featured, tags, specifications, portion_size, include_size, unit, nutrition, category_id)
VALUES (
  '四重奏瑪德蓮禮盒',
  'quartetMadeleine',
  '韻致',
  NULL,
  '{"desc":"這款精美禮盒包含**四種特色瑪德蓮口味**，讓您在送禮或自用時都能感受到細膩甜點的魔力！\n內含::巧克力瑪德蓮2顆::+::伯爵茶瑪德蓮2顆::+::蜂蜜檸檬瑪德蓮1顆::+::泰式奶茶瑪德蓮1顆::。\n##禮盒外觀是隨機的哦！##","nonAdditive":"本產品採用天然食材製作，不添加人工色素、香料或防腐劑，讓您安心享受每一口。","howToEat":"可直接享用或搭配奶茶、咖啡增添風味。建議於常溫下靜置片刻，讓口感更為柔軟。","preservationMethod":"請存放於陰涼乾燥處，避免陽光直射。建議於開封後盡快食用以保持最佳口感。由於無添加劑，請注意保存期限，避免長時間存放。常溫可存放7天，收到後兩天內未食用請冷藏存放，冷藏可存放14天，建議用烤箱180度回烤1~2分鐘或退冰後再食用。","precautions":"本產品含有動物性奶油及蛋，並非適合素食者食用。","tastePeriod":"請參考包裝上標示的賞味期限，以保證最佳品質和口感。本產品的賞味期限為製造日期起7～14天"}'::jsonb,
  389,
  NULL,
  99,
  50,
  '[{"url":"/images/products/quartet_madeleine.png","alt":"四重奏瑪德蓮禮盒","sort_order":-1},{"url":"/images/products/quartetMadeleine/1.jpg","alt":"四重奏瑪德蓮禮盒","sort_order":0},{"url":"/images/products/quartetMadeleine/2.jpg","alt":"四重奏瑪德蓮禮盒","sort_order":1},{"url":"/images/products/quartetMadeleine/3.jpg","alt":"四重奏瑪德蓮禮盒","sort_order":2},{"url":"/images/products/quartetMadeleine/4.jpg","alt":"四重奏瑪德蓮禮盒","sort_order":3}]'::jsonb,
  true,
  false,
  ARRAY['christmas','hot'],
  '[]'::jsonb,
  30,
  '6顆',
  '盒',
  '{"giftBox":[{"taste":"巧克力","content":[{"key":"熱量","value":91.9},{"key":"蛋白質","value":1.8},{"key":"脂肪","value":6.4},{"key":"飽和脂肪","value":4.2},{"key":"反式脂肪","value":0.019},{"key":"碳水化合物","value":7},{"key":"糖","value":0.9},{"key":"鈉","value":0.094}]},{"taste":"泰式奶茶","content":[{"key":"熱量","value":94.2},{"key":"蛋白質","value":1.4},{"key":"脂肪","value":6.6},{"key":"飽和脂肪","value":4.3},{"key":"反式脂肪","value":0.021},{"key":"碳水化合物","value":7.5},{"key":"糖","value":2.4},{"key":"鈉","value":0.009}]},{"taste":"蜂蜜檸檬","content":[{"key":"熱量","value":91.4},{"key":"蛋白質","value":1.6},{"key":"脂肪","value":6.4},{"key":"飽和脂肪","value":4.2},{"key":"反式脂肪","value":0.021},{"key":"碳水化合物","value":7},{"key":"糖","value":0.3},{"key":"鈉","value":0.398}]},{"taste":"伯爵茶","content":[{"key":"熱量","value":58.5},{"key":"蛋白質","value":1.6},{"key":"脂肪","value":3.4},{"key":"飽和脂肪","value":2.1},{"key":"反式脂肪","value":0.002},{"key":"碳水化合物","value":5.5},{"key":"糖","value":0.3},{"key":"鈉","value":0.107}]}]}'::jsonb,
  (SELECT id FROM categories WHERE slug = 'festival')
);

INSERT INTO products (name, slug, alias, description, detail, price, compare_price, stock_quantity, max_order_qty, images, is_active, is_featured, tags, specifications, portion_size, include_size, unit, nutrition, category_id)
VALUES (
  '手作鳳梨酥6入禮盒',
  'pineappleCake_6',
  NULL,
  NULL,
  '{"desc":"一口咬下，是陽光與果香的邂逅。\n手工製作的鳳梨酥外層酥香，內餡清甜不膩，\n以時間慢烘、以溫度封存，\n讓酸甜鳳梨的香氣在口中緩緩綻放。\n##每盒6顆##","nonAdditive":"本產品選用優質鳳梨餡與高品質天然奶油製作，\n由職人手工包製、低溫烘焙完成。\n不額外添加人工香料、色素與防腐劑，\n以純粹工法呈現酥香與果香的自然風味。","howToEat":"常溫下直接食用，外皮酥鬆、內餡柔軟。\n若想品嚐剛出爐的香氣，可於180°C烤箱中回烤約5分鐘，\n外層將更酥香、內餡更綿密，是下午茶與節慶送禮的完美選擇。","preservationMethod":"請存放於陰涼乾燥處，避免陽光直射與高溫潮濕。\n開封後請盡快食用，未食用完畢者請密封保存。\n冷藏可延長保存期限，食用前建議回溫或回烤恢復最佳口感。","precautions":"本產品含有小麥、蛋及奶製品，對上述成分過敏者請勿食用。\n鳳梨餡含有天然果酸，請避免與金屬容器長時間接觸。\n本產品使用動物性奶油，蛋奶素者可食用。","tastePeriod":"本產品賞味期限為製造日期起 常溫可保存14天、冷藏可保存21天。\n為確保最佳風味，建議於有效期限內食用完畢。"}'::jsonb,
  259,
  NULL,
  99,
  10,
  '[{"url":"/images/products/pine_apple_cake_6.png","alt":"手作鳳梨酥6入禮盒","sort_order":-1},{"url":"/images/products/pineappleCake6/1.png","alt":"手作鳳梨酥6入禮盒","sort_order":0},{"url":"/images/products/pineappleCake6/2.png","alt":"手作鳳梨酥6入禮盒","sort_order":1},{"url":"/images/products/pineappleCake6/3.png","alt":"手作鳳梨酥6入禮盒","sort_order":2},{"url":"/images/products/pineappleCake6/4.png","alt":"手作鳳梨酥6入禮盒","sort_order":3},{"url":"/images/products/pineappleCake6/5.png","alt":"手作鳳梨酥6入禮盒","sort_order":4},{"url":"/images/products/pineappleCake6/6.png","alt":"手作鳳梨酥6入禮盒","sort_order":5},{"url":"/images/products/pineappleCake6/7.png","alt":"手作鳳梨酥6入禮盒","sort_order":6}]'::jsonb,
  true,
  false,
  ARRAY['new','hot'],
  '[{"key":"原味","value":1}]'::jsonb,
  30,
  '6顆',
  '盒',
  '{"perServing":[{"key":"熱量","value":116},{"key":"蛋白質","value":1.6},{"key":"脂肪","value":6.3},{"key":"飽和脂肪","value":3.9},{"key":"反式脂肪","value":0.1},{"key":"碳水化合物","value":14.3},{"key":"糖","value":6.4},{"key":"鈉","value":0.018}],"perHundred":[{"key":"熱量","value":386.7},{"key":"蛋白質","value":5.4},{"key":"脂肪","value":21.1},{"key":"飽和脂肪","value":13.1},{"key":"反式脂肪","value":0.4},{"key":"碳水化合物","value":47.6},{"key":"糖","value":21.5},{"key":"鈉","value":0.062}]}'::jsonb,
  (SELECT id FROM categories WHERE slug = 'festival')
);

INSERT INTO products (name, slug, alias, description, detail, price, compare_price, stock_quantity, max_order_qty, images, is_active, is_featured, tags, specifications, portion_size, include_size, unit, nutrition, category_id)
VALUES (
  '手作鳳梨酥12入禮盒',
  'pineappleCake_12',
  NULL,
  NULL,
  '{"desc":"一口咬下，是陽光與果香的邂逅。\n手工製作的鳳梨酥外層酥香，內餡清甜不膩，\n以時間慢烘、以溫度封存，\n讓酸甜鳳梨的香氣在口中緩緩綻放。\n##每盒12顆##","nonAdditive":"本產品選用優質鳳梨餡與高品質天然奶油製作，\n由職人手工包製、低溫烘焙完成。\n不額外添加人工香料、色素與防腐劑，\n以純粹工法呈現酥香與果香的自然風味。","howToEat":"常溫下直接食用，外皮酥鬆、內餡柔軟。\n若想品嚐剛出爐的香氣，可於180°C烤箱中回烤約5分鐘，\n外層將更酥香、內餡更綿密，是下午茶與節慶送禮的完美選擇。","preservationMethod":"請存放於陰涼乾燥處，避免陽光直射與高溫潮濕。\n開封後請盡快食用，未食用完畢者請密封保存。\n冷藏可延長保存期限，食用前建議回溫或回烤恢復最佳口感。","precautions":"本產品含有小麥、蛋及奶製品，對上述成分過敏者請勿食用。\n鳳梨餡含有天然果酸，請避免與金屬容器長時間接觸。\n本產品使用動物性奶油，蛋奶素者可食用。","tastePeriod":"本產品賞味期限為製造日期起 常溫可保存14天、冷藏可保存21天。\n為確保最佳風味，建議於有效期限內食用完畢。"}'::jsonb,
  499,
  NULL,
  99,
  10,
  '[{"url":"/images/products/pine_apple_cake_12.png","alt":"手作鳳梨酥12入禮盒","sort_order":-1},{"url":"/images/products/pineappleCake12/1.png","alt":"手作鳳梨酥12入禮盒","sort_order":0},{"url":"/images/products/pineappleCake12/2.png","alt":"手作鳳梨酥12入禮盒","sort_order":1},{"url":"/images/products/pineappleCake12/3.png","alt":"手作鳳梨酥12入禮盒","sort_order":2},{"url":"/images/products/pineappleCake12/4.png","alt":"手作鳳梨酥12入禮盒","sort_order":3},{"url":"/images/products/pineappleCake12/5.png","alt":"手作鳳梨酥12入禮盒","sort_order":4},{"url":"/images/products/pineappleCake12/6.png","alt":"手作鳳梨酥12入禮盒","sort_order":5},{"url":"/images/products/pineappleCake12/7.png","alt":"手作鳳梨酥12入禮盒","sort_order":6}]'::jsonb,
  true,
  false,
  ARRAY['new','hot'],
  '[{"key":"原味","value":1}]'::jsonb,
  30,
  '12顆',
  '盒',
  '{"perServing":[{"key":"熱量","value":116},{"key":"蛋白質","value":1.6},{"key":"脂肪","value":6.3},{"key":"飽和脂肪","value":3.9},{"key":"反式脂肪","value":0.1},{"key":"碳水化合物","value":14.3},{"key":"糖","value":6.4},{"key":"鈉","value":0.018}],"perHundred":[{"key":"熱量","value":386.7},{"key":"蛋白質","value":5.4},{"key":"脂肪","value":21.1},{"key":"飽和脂肪","value":13.1},{"key":"反式脂肪","value":0.4},{"key":"碳水化合物","value":47.6},{"key":"糖","value":21.5},{"key":"鈉","value":0.062}]}'::jsonb,
  (SELECT id FROM categories WHERE slug = 'festival')
);

