import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * 验证用户是否已登录的通用函数
 * @param request NextRequest 对象
 * @param customErrorMessage 可选的自定义错误消息
 * @param status 可选的 HTTP 状态码，默认为 401
 * @returns 如果用户未登录，返回错误响应；如果已登录，返回 token
 */
export async function requireAuth(
  request: NextRequest,
  customErrorMessage: string = '需要登录才能访问此功能',
  status: number = 401
) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    return {
      response: NextResponse.json({ error: customErrorMessage }, { status }),
      isAuthenticated: false,
      token: null,
    }
  }

  return {
    response: null,
    isAuthenticated: true,
    token,
  }
}
