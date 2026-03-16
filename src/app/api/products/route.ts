import { NextResponse } from 'next/server'
import path from 'path'
import { readFile } from 'fs/promises'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'json', 'productsList.json')
    const data = await readFile(filePath, 'utf-8')
    return NextResponse.json(JSON.parse(data))
  } catch {
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 })
  }
}
