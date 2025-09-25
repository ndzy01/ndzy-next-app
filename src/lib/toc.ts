export interface TocItem {
  id: string
  text: string
  depth: number
}

export function extractToc(content: string): TocItem[] {
  const toc: TocItem[] = []
  const headingRegex = /^(#{2,3})\s+(.+)$/gm

  let match
  while ((match = headingRegex.exec(content)) !== null) {
    const depth = match[1].length // Number of # characters
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-|-$/g, '')

    toc.push({
      id,
      text,
      depth,
    })
  }

  return toc
}
