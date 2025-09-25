'use client'

import { TocItem } from '@/types/blog'
import Link from 'next/link'

interface TOCProps {
  items: TocItem[]
}

export default function TOC({ items }: TOCProps) {
  if (items.length === 0) {
    return (
      <div className='text-sm text-gray-500 dark:text-gray-400'>
        <p className='italic'>暂无目录</p>
      </div>
    )
  }

  return (
    <nav className='space-y-2'>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
        目录
      </h3>
      <ul className='space-y-1'>
        {items.map((item) => (
          <li
            key={item.id}
            style={{ marginLeft: `${(item.depth - 2) * 12}px` }}
          >
            <Link
              href={`#${item.id}`}
              className='text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block py-1'
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
