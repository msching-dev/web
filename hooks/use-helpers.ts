'use client'

export function formatTimestampToDateRange(
  startTime: number,
  endTime: number
): string {
  const start = new Date(startTime * 1000)
  const end = new Date(endTime * 1000)
  const startStr = `${start.getFullYear()}/${String(start.getMonth() + 1).padStart(2, '0')}/${String(start.getDate()).padStart(2, '0')}`
  const endStr = `${String(end.getMonth() + 1).padStart(2, '0')}/${String(end.getDate()).padStart(2, '0')}`
  return `${startStr}-${endStr}`
}
