import { NextRequest, NextResponse } from 'next/server'
import { getAllPostMetadata } from '@/lib/mdx'
import logger from '@/lib/logger'
import { requireAuth } from '@/lib/auth-utils'

export async function GET(request: NextRequest) {
  try {
    // 验证用户是否已登录
    const { response, isAuthenticated } = await requireAuth(
      request,
      '需要登录才能查看文章列表'
    )

    // 如果用户未登录，返回401未授权
    if (!isAuthenticated) {
      return response
    }

    const posts = await getAllPostMetadata()
    logger.info('Fetched posts:', posts)

    return NextResponse.json(posts)
  } catch (error) {
    logger.error('Error fetching posts:', error)
    return NextResponse.json({ error: '获取文章列表失败' }, { status: 500 })
  }
}
