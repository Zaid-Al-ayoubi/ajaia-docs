import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// 1. جلب المستندات (الخاصة واللي تمت مشاركتها)
export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // المستندات اللي أنا المالك تبعها
  const myDocs = await prisma.document.findMany({
    where: { ownerId: user.id },
    orderBy: { updatedAt: 'desc' },
  })

  // المستندات اللي حد تاني شاركها معي
  const sharedDocs = await prisma.document.findMany({
    where: {
      shares: {
        some: { userId: user.id }
      }
    },
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json({ myDocs, sharedDocs })
}

// 2. إنشاء مستند جديد
export async function POST() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const newDoc = await prisma.document.create({
    data: {
      title: 'Untitled Document',
      ownerId: user.id,
      content: '<p>Start typing here...</p>' // محتوى افتراضي
    }
  })

  return NextResponse.json(newDoc)
}