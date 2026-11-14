import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { email } = await request.json() // الإيميل اللي بدنا نشارك معه

  // 1. نتأكد إنه اللي عم يشارك هو صاحب المستند (Owner)
  const doc = await prisma.document.findUnique({ where: { id } })
  if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  if (doc.ownerId !== user.id) return NextResponse.json({ error: 'Only the owner can share' }, { status: 403 })

  // 2. نتأكد إنه الشخص اللي بدنا نشارك معه موجود بالداتابيز
  const targetUser = await prisma.user.findUnique({ where: { email } })
  if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (targetUser.id === user.id) return NextResponse.json({ error: 'Cannot share with yourself' }, { status: 400 })

  // 3. نعمل عملية المشاركة (إذا كان مشارك من قبل، ما بنكررها)
  const existingShare = await prisma.share.findUnique({
    where: { documentId_userId: { documentId: id, userId: targetUser.id } }
  })

  if (existingShare) {
    return NextResponse.json({ message: 'Already shared with this user' }, { status: 200 })
  }

  await prisma.share.create({
    data: {
      documentId: id,
      userId: targetUser.id,
    }
  })

  return NextResponse.json({ success: true })
}