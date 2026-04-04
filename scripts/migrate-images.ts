/**
 * One-time migration: Move product images from public/images/products/
 * to Supabase Storage bucket "product-images".
 *
 * Usage: npx tsx scripts/migrate-images.ts
 *
 * Prerequisites:
 * - .env.local must have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY
 * - Supabase Storage bucket "product-images" must exist (public)
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SECRET_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)
const BUCKET = 'product-images'
const PUBLIC_DIR = join(process.cwd(), 'public')

async function main() {
  console.log('Fetching all products...')
  const { data: products, error } = await supabase
    .from('products')
    .select('id, slug, images')

  if (error || !products) {
    console.error('Failed to fetch products:', error)
    process.exit(1)
  }

  console.log(`Found ${products.length} products`)

  for (const product of products) {
    const images = (product.images as Array<{ url: string; alt: string; sort_order: number }>) || []

    if (images.length === 0) {
      console.log(`  [${product.slug}] No images, skipping`)
      continue
    }

    const updatedImages: typeof images = []
    let changed = false

    for (const img of images) {
      if (!img.url.startsWith('/images/')) {
        updatedImages.push(img)
        continue
      }

      const localPath = join(PUBLIC_DIR, img.url)
      if (!existsSync(localPath)) {
        console.warn(`  [${product.slug}] File not found: ${img.url}`)
        updatedImages.push(img)
        continue
      }

      const fileBuffer = readFileSync(localPath)
      const ext = img.url.split('.').pop() || 'jpg'
      const filename = `${img.sort_order + 1}.${ext}`
      const storagePath = `${product.slug}/${filename}`

      console.log(`  [${product.slug}] Uploading ${img.url} → ${storagePath}`)

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, fileBuffer, {
          contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
          upsert: true,
        })

      if (uploadError) {
        console.error(`  [${product.slug}] Upload failed: ${uploadError.message}`)
        updatedImages.push(img)
        continue
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)

      updatedImages.push({
        ...img,
        url: publicUrl,
      })
      changed = true
    }

    if (changed) {
      console.log(`  [${product.slug}] Updating DB with new URLs...`)
      const { error: updateError } = await supabase
        .from('products')
        .update({ images: updatedImages as any })
        .eq('id', product.id)

      if (updateError) {
        console.error(`  [${product.slug}] DB update failed: ${updateError.message}`)
      } else {
        console.log(`  [${product.slug}] Done ✓`)
      }
    } else {
      console.log(`  [${product.slug}] No local images to migrate`)
    }
  }

  console.log('\nMigration complete!')
  console.log('After verifying all images load correctly, you can remove public/images/products/')
}

main()
