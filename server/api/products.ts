// server/api/products.ts
import productsInfo from '@/public/json/products.json'

export default defineEventHandler(() => {

  const products = Object.keys(productsInfo).map((key) => {
    return {
      key,
      ...productsInfo[key as keyof typeof productsInfo],
    }
  })
  return products || []
})
