// server/api/products/[key].ts
import { promises as fs } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(async (event) => {
  
  const key = event.context.params?.key as string | undefined
  console.log('event key', key)

  if (!key) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product key is required',
    })
  }

  
  const productPath = resolve(
    process.cwd(),
    `public/json/productDetails/${key}.json`
  )
  try {
    const productData = await fs.readFile(productPath, 'utf-8')
    return JSON.parse(productData)
  } catch (error) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }
})
