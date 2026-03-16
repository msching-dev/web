import { NextResponse } from 'next/server'
import path from 'path'
import { readFile } from 'fs/promises'

const VALID_KEYS = new Set([
  'almondCookie',
  'chocolateMadeleine',
  'cranBerryMadeleine',
  'earlGreyTeaAndHoneyLemonMadeleine',
  'earlGreyTeaMadeleine',
  'honeyLemonMadeleine',
  'matchaMadeleine',
  'pineappleCake_6',
  'pineappleCake_12',
  'poloCookie',
  'quartetMadeleine',
  'thaiAndChocolateMadeleine',
  'thaiTeaMadeleine',
])

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params

  if (!VALID_KEYS.has(key)) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  try {
    const filePath = path.join(
      process.cwd(),
      'public',
      'json',
      'productDetails',
      `${key}.json`
    )
    const data = await readFile(filePath, 'utf-8')
    return NextResponse.json(JSON.parse(data))
  } catch {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }
}
