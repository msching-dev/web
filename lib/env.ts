/**
 * 環境變數驗證 — 啟動時檢查必要的環境變數是否存在
 * 缺少時拋出明確錯誤，而不是在運行時遇到 undefined 崩潰
 */

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`缺少必要的環境變數：${name}`)
  }
  return value
}

export const env = {
  NEXT_PUBLIC_SUPABASE_URL: requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: requireEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'),
}

export const serverEnv = {
  get SUPABASE_SECRET_KEY() { return requireEnv('SUPABASE_SECRET_KEY') },
  get LINE_CHANNEL_ID() { return requireEnv('LINE_CHANNEL_ID') },
  get LINE_CHANNEL_SECRET() { return requireEnv('LINE_CHANNEL_SECRET') },
}
