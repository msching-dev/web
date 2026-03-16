import React from 'react'

interface HighlightedTextProps {
  text: string
}

function parseMarkup(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  const remaining = text
  let key = 0

  const regex =
    /\{b\}(.*?)\{\/b\}|\{color=(#[0-9a-fA-F]{3,6})\}(.*?)\{\/color\}|\{highlight\}(.*?)\{\/highlight\}/g

  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(remaining)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      nodes.push(remaining.slice(lastIndex, match.index))
    }

    if (match[1] !== undefined) {
      // {b}bold{/b}
      nodes.push(
        <span key={key++} className="font-bold">
          {match[1]}
        </span>
      )
    } else if (match[2] !== undefined && match[3] !== undefined) {
      // {color=#xxx}text{/color}
      nodes.push(
        <span key={key++} style={{ color: match[2] }}>
          {match[3]}
        </span>
      )
    } else if (match[4] !== undefined) {
      // {highlight}text{/highlight}
      nodes.push(
        <span
          key={key++}
          className="rounded bg-sandrift-200 px-1 py-0.5"
        >
          {match[4]}
        </span>
      )
    }

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < remaining.length) {
    nodes.push(remaining.slice(lastIndex))
  }

  return nodes
}

export default function HighlightedText({ text }: HighlightedTextProps) {
  return <>{parseMarkup(text)}</>
}
