import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  const { userId } = await request.json()

  // نتأكد إنه المستخدم موجود بالداتابيز
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // نحط الـ userId بالكوكيز (عشان نعرف مين مسجل دخول)
  const response = NextResponse.json({ success: true, redirect: '/docs' })
  response.cookies.set('userId', userId, { httpOnly: true, path: '/' })
  
  return response
}