'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MagnifyingGlassIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { ContentSearchResult } from '@/app/api/search/route'
import { useSession } from 'next-auth/react'

function SearchPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { status } = useSession()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState<ContentSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalResults, setTotalResults] = useState(0)

  // 如果用户未登录，重定向到登录页面
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(
        '/auth/signin?callbackUrl=' + encodeURIComponent('/blog/search')
      )
    }
  }, [status, router])

  // 执行搜索
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setTotalResults(0)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&limit=20`
      )
      const data = await response.json()

      if (response.ok) {
        setResults(data.results || [])
        setTotalResults(data.total || 0)
      } else {
        setError(data.error || '搜索失败')
      }
    } catch (_e) {
      console.error(_e)
      setError('网络错误，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  // 初始搜索
  useEffect(() => {
    const initialQuery = searchParams.get('q')
    if (initialQuery) {
      setQuery(initialQuery)
      performSearch(initialQuery)
    }
  }, [searchParams])

  // 处理搜索提交
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/blog/search?q=${encodeURIComponent(query)}`)
      performSearch(query)
    }
  }

  // 高亮搜索关键词
  const highlightText = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text

    const regex = new RegExp(
      `(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
      'gi'
    )
    return text.replace(
      regex,
      '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>'
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        {/* 导航 */}
        <div className='mb-8'>
          <Link
            href='/blog'
            className='inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline'
          >
            <ArrowLeftIcon className='h-4 w-4 mr-2' />
            返回博客
          </Link>
        </div>

        {/* 搜索标题 */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
            搜索博客
          </h1>
          <p className='text-gray-600 dark:text-gray-300'>
            在所有文章中搜索内容
          </p>
        </div>

        {/* 搜索框 */}
        <form onSubmit={handleSearch} className='mb-8'>
          <div className='relative max-w-2xl mx-auto'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' />
            </div>
            <input
              type='text'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='输入搜索关键词...'
              className='block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg'
            />
          </div>
        </form>

        {/* 搜索结果统计 */}
        {query && !isLoading && (
          <div className='mb-6 text-center'>
            <p className='text-gray-600 dark:text-gray-300'>
              {totalResults > 0
                ? `找到 ${totalResults} 个关于 "${query}" 的结果`
                : `未找到关于 "${query}" 的结果`}
            </p>
          </div>
        )}

        {/* 加载状态 */}
        {isLoading && (
          <div className='text-center py-12'>
            <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
            <p className='mt-4 text-gray-600 dark:text-gray-300'>搜索中...</p>
          </div>
        )}

        {/* 错误信息 */}
        {error && (
          <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6'>
            <p className='text-red-700 dark:text-red-400'>{error}</p>
          </div>
        )}

        {/* 搜索结果 */}
        {!isLoading && results.length > 0 && (
          <div className='space-y-6'>
            {results.map((result) => (
              <article
                key={result.id}
                className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow'
              >
                <Link href={`/blog/${result.slug}`} className='block'>
                  <h2
                    className='text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400'
                    dangerouslySetInnerHTML={{
                      __html: highlightText(result.title, query),
                    }}
                  />

                  <p
                    className='text-gray-600 dark:text-gray-300 mb-3 line-clamp-2'
                    dangerouslySetInnerHTML={{
                      __html: highlightText(result.excerpt, query),
                    }}
                  />

                  {/* 内容片段 */}
                  {result.contentSnippets &&
                    result.contentSnippets.length > 0 && (
                      <div className='mb-3'>
                        {result.contentSnippets.map((snippet, index) => (
                          <p
                            key={index}
                            className='text-sm text-gray-500 dark:text-gray-400 mb-1'
                            dangerouslySetInnerHTML={{
                              __html: highlightText(snippet, query),
                            }}
                          />
                        ))}
                      </div>
                    )}

                  <div className='flex items-center justify-between text-sm text-gray-500 dark:text-gray-400'>
                    <div className='flex items-center space-x-4'>
                      <span>{result.date}</span>
                      <span>作者: {result.author}</span>
                      {result.matchedContent.length > 0 && (
                        <span className='text-blue-500'>
                          匹配: {result.matchedContent.join(', ')}
                        </span>
                      )}
                    </div>
                    <div className='flex flex-wrap gap-1'>
                      {result.tags.map((tag) => (
                        <span
                          key={tag}
                          className='px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* 无结果提示 */}
        {!isLoading && query && results.length === 0 && !error && (
          <div className='text-center py-12'>
            <MagnifyingGlassIcon className='h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
              未找到相关结果
            </h3>
            <p className='text-gray-600 dark:text-gray-300 mb-4'>
              尝试使用不同的关键词或检查拼写
            </p>
            <div className='text-sm text-gray-500 dark:text-gray-400'>
              <p>搜索建议：</p>
              <ul className='mt-2 space-y-1'>
                <li>• 使用更通用的关键词</li>
                <li>• 检查关键词拼写</li>
                <li>• 尝试使用同义词</li>
                <li>• 减少搜索词数量</li>
              </ul>
            </div>
          </div>
        )}

        {/* 空状态 */}
        {!query && !isLoading && (
          <div className='text-center py-12'>
            <MagnifyingGlassIcon className='h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
              开始搜索
            </h3>
            <p className='text-gray-600 dark:text-gray-300'>
              在上方输入关键词来搜索博客文章
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <SearchPageContent />
    </Suspense>
  )
}
