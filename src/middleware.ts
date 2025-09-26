import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 获取请求中的token（如果用户已登录，则存在）
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = request.nextUrl

  // 检查路由是否需要保护（匹配/blog路径）
  const isProtectedRoute = pathname.startsWith('/blog')
  
  // 如果是受保护的路由且用户未登录，则重定向到登录页
  if (isProtectedRoute && !token) {
    // 将当前URL保存为callbackUrl，登录后可以返回到这个页面
    const url = new URL('/auth/signin', request.url)
    url.searchParams.set('callbackUrl', encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// 配置需要保护的路由
export const config = {
  // 定义拦截匹配器，可以同时匹配多个路径
  matcher: ['/blog', '/blog/:path*'],
}