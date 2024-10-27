// server/api/products.ts
import productsList from '@/public/json/productsList.json'

export default defineEventHandler(() => {

  return productsList || []
})
