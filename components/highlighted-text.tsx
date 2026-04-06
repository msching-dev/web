import React from 'react'

interface HighlightedTextProps {
  text: string
  className?: string
}

/**
 * Markdown subset parser
 *
 * 支援語法：
 * - **粗體**     → 粗體強調
 * - ==高亮==     → 品牌色背景標記（備註提示）
 * - ::標籤::     → pill 標籤（禮盒內容物列舉）
 * - - 列表項目   → 圓點列表
 * - 換行         → 換行
 */
function parseLine(line: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  // 匹配 **粗體**、==高亮==、::標籤::
  const regex = /\*\*(.*?)\*\*|==(.*?)==|::(.*?)::/g

  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(line.slice(lastIndex, match.index))
    }

    if (match[1] !== undefined) {
      // **粗體**
      nodes.push(
        <strong key={key++} className="font-semibold text-sandrift-900">
          {match[1]}
        </strong>
      )
    } else if (match[2] !== undefined) {
      // ==高亮== — 備註/提示
      nodes.push(
        <mark key={key++} className="rounded bg-sandrift-200/50 px-1.5 py-0.5 text-sandrift-700 text-[0.9em]">
          {match[2]}
        </mark>
      )
    } else if (match[3] !== undefined) {
      // ::標籤:: — pill 標籤
      nodes.push(
        <span key={key++} className="inline-flex items-center rounded-full bg-sandrift-100/60 px-2 py-0.5 text-[0.85em] font-medium text-sandrift-700 ring-1 ring-sandrift-200/30">
          {match[3]}
        </span>
      )
    }

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < line.length) {
    nodes.push(line.slice(lastIndex))
  }

  return nodes
}

export default function HighlightedText({ text, className }: HighlightedTextProps) {
  const lines = text.split('\n')

  return (
    <div className={className}>
      {lines.map((line, i) => {
        // 列表項目：- 開頭
        if (line.trimStart().startsWith('- ')) {
          const content = line.trimStart().slice(2)
          return (
            <div key={i} className="flex items-start gap-1.5 py-0.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sandrift-300" />
              <span>{parseLine(content)}</span>
            </div>
          )
        }

        // 空行
        if (line.trim() === '') {
          return <div key={i} className="h-2" />
        }

        // 一般文字
        return (
          <p key={i}>
            {parseLine(line)}
          </p>
        )
      })}
    </div>
  )
}
