/**
 * Lightweight markdown-to-HTML converter.
 * Handles headings, bold, italic, lists, tables, blockquotes, paragraphs, and inline code.
 * No external dependencies required.
 */
export function markdownToHtml(md: string): string {
  let html = md

  // Escape HTML entities in code spans first (protect them from further processing)
  const codeSpans: string[] = []
  html = html.replace(/`([^`]+)`/g, (_m: string, code: string) => {
    codeSpans.push(`<code>${escapeHtml(code)}</code>`)
    return `%%CODE_${codeSpans.length - 1}%%`
  })

  // Headings
  html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>')
  html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>')
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')

  // Horizontal rule
  html = html.replace(/^---+$/gm, '<hr />')

  // Bold + italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>')
  html = html.replace(/_(.+?)_/g, '<em>$1</em>')

  // Tables — must run before list/paragraph processing
  // Matches a header row, an alignment row (|---|), and one or more data rows
  html = html.replace(
    /((?:^\|.+\|\s*$\n?)+)/gm,
    (block: string) => {
      const rows = block
        .trim()
        .split('\n')
        .map((r: string) => r.trim())
        .filter((r: string) => r.length > 0)

      if (rows.length < 2) return block // not a valid table

      // Detect alignment separator row (e.g. |---|:---:|---:|)
      const isSeparator = (row: string) => /^\|[\s\-:|]+\|$/.test(row)

      const parseRow = (row: string, tag: 'th' | 'td') =>
        '<tr>' +
        row
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map((cell: string) => `<${tag}>${cell.trim()}</${tag}>`)
          .join('') +
        '</tr>'

      let tableHtml = '<table>\n'

      if (rows.length >= 2 && isSeparator(rows[1])) {
        // First row is the header, rows after separator are body
        const headerRow: string = rows[0]
        const bodyRows: string[] = rows.slice(2)
        tableHtml += `<thead>\n${parseRow(headerRow, 'th')}\n</thead>\n`
        if (bodyRows.length > 0) {
          tableHtml += '<tbody>\n' + bodyRows.map((r: string) => parseRow(r, 'td')).join('\n') + '\n</tbody>\n'
        }
      } else {
        // No recognised separator — treat all rows as body
        tableHtml += '<tbody>\n' + rows.map((r: string) => parseRow(r, 'td')).join('\n') + '\n</tbody>\n'
      }

      tableHtml += '</table>'
      return tableHtml
    }
  )

  // Unordered lists (lines starting with - or *)
  html = html.replace(/((?:^[\-\*]\s+.+$\n?)+)/gm, (block: string) => {
    const items = block
      .trim()
      .split('\n')
      .map((line: string) => `<li>${line.replace(/^[\-\*]\s+/, '')}</li>`)
      .join('\n')
    return `<ul>\n${items}\n</ul>\n`
  })

  // Ordered lists (lines starting with 1. 2. etc.)
  html = html.replace(/((?:^\d+\.\s+.+$\n?)+)/gm, (block: string) => {
    const items = block
      .trim()
      .split('\n')
      .map((line: string) => `<li>${line.replace(/^\d+\.\s+/, '')}</li>`)
      .join('\n')
    return `<ol>\n${items}\n</ol>\n`
  })

  // Blockquote
  html = html.replace(/((?:^>\s*.+$\n?)+)/gm, (block: string) => {
    const inner = block
      .trim()
      .split('\n')
      .map((line: string) => line.replace(/^>\s*/, ''))
      .join('\n')
    return `<blockquote>\n${inner}\n</blockquote>\n`
  })

  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

  // Images ![alt](url)
  html = html.replace(/!\[([^\]]*)]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')

  // Paragraphs — wrap lines that are not already block elements
  // Match both opening AND closing tags so we don't wrap stray closing tags
  const blockTags = /^<\/?( h[1-6]|ul|ol|li|blockquote|hr|pre|div|figure|table|thead|tbody|tr|th|td)/
  const lines = html.split('\n')
  const paragraphed: string[] = []
  let buffer: string[] = []

  const flushBuffer = () => {
    const text = buffer.join(' ').trim()
    if (text) paragraphed.push(`<p>${text}</p>`)
    buffer = []
  }

  for (const line of lines) {
    if (blockTags.test(line.trim()) || line.trim() === '') {
      flushBuffer()
      if (line.trim()) paragraphed.push(line)
    } else {
      buffer.push(line)
    }
  }
  flushBuffer()
  html = paragraphed.join('\n')

  // Restore code spans
  html = html.replace(/%%CODE_(\d+)%%/g, (_m: string, i: string) => codeSpans[parseInt(i)] ?? '')

  return html
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
