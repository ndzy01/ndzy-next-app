'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import SearchBox from './SearchBox'
import { BlogPostMeta } from '@/types/blog'
import { useSession, signIn, signOut } from 'next-auth/react'

export function GlobalHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [posts, setPosts] = useState<BlogPostMeta[]>([])
  const { data: session, status } = useSession()

  // 获取博客文章数据，只有用户登录时才获取
  useEffect(() => {
    const fetchPosts = async () => {
      // 只有用户已登录时才获取文章数据
      if (status === 'authenticated') {
        try {
          const response = await fetch('/api/posts')
          if (response.ok) {
            const postsData = await response.json()
            setPosts(postsData)
          }
        } catch (error) {
          console.error('Failed to fetch posts:', error)
        }
      }
    }

    fetchPosts()
  }, [status])

  return (
    <header className='bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo/Brand */}
          <div className='flex items-center'>
            <Link
              href='/'
              className='text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400'
            >
              ndzy的博客
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-8'>
            <Link
              href='/'
              className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium'
            >
              首页
            </Link>
            <Link
              href='/blog'
              className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium'
            >
              博客
            </Link>
            {status === 'authenticated' ? (
              <div className="flex items-center space-x-2">
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  {session.user?.name}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium"
                >
                  登出
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn('github')}
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium"
              >
                <UserCircleIcon className="h-5 w-5 mr-1" />
                登录
              </button>
            )}
          </nav>

          {/* Search and Mobile Menu */}
          <div className='flex items-center space-x-4'>
            {/* Desktop Search - Only visible when logged in */}
            {status === 'authenticated' && (
              <div className='hidden md:block'>
                <div className='relative'>
                  <SearchBox
                    posts={posts}
                    placeholder='搜索文章...'
                    className='w-64'
                  />
                </div>
              </div>
            )}

            {/* Mobile Search Button - Only visible when logged in */}
            {status === 'authenticated' && (
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className='md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              >
                <MagnifyingGlassIcon className='h-5 w-5' />
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
            >
              {isMenuOpen ? (
                <XMarkIcon className='h-6 w-6' />
              ) : (
                <Bars3Icon className='h-6 w-6' />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - Only visible when logged in */}
        {isSearchOpen && status === 'authenticated' && (
          <div className='md:hidden py-4 border-t border-gray-200 dark:border-gray-700'>
            <SearchBox
              posts={posts}
              placeholder='搜索文章...'
              className='w-full'
            />
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className='md:hidden py-4 border-t border-gray-200 dark:border-gray-700'>
            <nav className='flex flex-col space-y-2'>
              <Link
                href='/'
                className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium'
                onClick={() => setIsMenuOpen(false)}
              >
                首页
              </Link>
              <Link
                href='/blog'
                className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium'
                onClick={() => setIsMenuOpen(false)}
              >
                博客
              </Link>
              {status === 'authenticated' ? (
                <>
                  <div className="text-gray-700 dark:text-gray-300 px-3 py-2 text-sm font-medium">
                    {session.user?.name}
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium"
                  >
                    登出
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    signIn('github');
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center text-left text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium"
                >
                  <UserCircleIcon className="h-5 w-5 mr-1" />
                  登录
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
