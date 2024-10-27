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

  const productUrl = `/json/productDetails/${key}.json`
  try {
    const response = await $fetch(productUrl)
    return response
  } catch (error) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }
})
