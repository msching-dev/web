/**
 * One-time setup: Configure Supabase Storage bucket and run pending migrations.
 *
 * Usage: npx tsx scripts/setup-supabase.ts
 *
 * What it does:
 * 1. Creates 'product-images' public Storage bucket (if not exists)
 * 2. Runs 006_auth_user_trigger.sql migration
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SECRET_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in environment')
  console.error('Make sure .env.local is loaded or set these variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createStorageBucket() {
  console.log('1. Creating product-images bucket...')

  const { data: buckets } = await supabase.storage.listBuckets()
  const exists = buckets?.some(b => b.name === 'product-images')

  if (exists) {
    console.log('   Bucket already exists, skipping')
    return
  }

  const { error } = await supabase.storage.createBucket('product-images', {
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    fileSizeLimit: 2 * 1024 * 1024, // 2MB
  })

  if (error) {
    console.error('   Failed to create bucket:', error.message)
  } else {
    console.log('   Bucket created successfully ✓')
  }
}

async function runMigration() {
  console.log('2. Running auth user trigger migration...')

  const sqlPath = join(process.cwd(), 'supabase/migrations/006_auth_user_trigger.sql')
  const sql = readFileSync(sqlPath, 'utf-8')

  const { error } = await supabase.rpc('exec_sql', { sql_string: sql }).single()

  if (error) {
    // Try direct approach if rpc doesn't exist
    console.log('   RPC not available, trying direct SQL...')
    // The service_role key can run SQL via the REST API's /rest/v1/rpc endpoint
    // but if that doesn't work, we need to use the SQL editor in dashboard
    console.log('   ⚠ Could not run migration automatically.')
    console.log('   Please run this SQL manually in Supabase Dashboard → SQL Editor:')
    console.log('   File: supabase/migrations/006_auth_user_trigger.sql')
  } else {
    console.log('   Migration applied successfully ✓')
  }
}

async function main() {
  console.log('Setting up Supabase...\n')
  await createStorageBucket()
  await runMigration()
  console.log('\nSetup complete!')
}

main()
