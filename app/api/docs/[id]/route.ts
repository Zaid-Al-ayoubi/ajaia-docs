import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// جلب مستند واحد
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const doc = await prisma.document.findUnique({
    where: { id },
    include: { shares: true }
  })

  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // التحقق إنه المستخدم هو المالك أو عنده صلاحية
  const isOwner = doc.ownerId === user.id
  const isShared = doc.shares.some(share => share.userId === user.id)

  if (!isOwner && !isShared) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json(doc)
}

// تعديل مستند (العنوان أو المحتوى)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { title, content } = await request.json()

  const doc = await prisma.document.findUnique({ where: { id }, include: { shares: true } })
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const isOwner = doc.ownerId === user.id
  const isShared = doc.shares.some((share: { userId: string }) => share.userId === user.id)

  if (!isOwner && !isShared) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const updatedDoc = await prisma.document.update({
    where: { id },
    data: { title, content }
  })

  return NextResponse.json(updatedDoc)
}