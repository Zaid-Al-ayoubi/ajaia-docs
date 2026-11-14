import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })

  // نتأكد إنه الملف نصي (txt أو md)
  if (!file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
    return NextResponse.json({ error: 'Only .txt and .md files are supported' }, { status: 400 })
  }

  // نقرأ محتوى الملف
  const textContent = await file.text()
  
  // نحول النص لـ HTML بسيط عشان المحرر يقرأه
  const htmlContent = textContent
    .split('\n')
    .map(line => `<p>${line || '<br>'}</p>`)
    .join('')

  // ننشئ المستند الجديد
  const newDoc = await prisma.document.create({
    data: {
      title: file.name,
      content: htmlContent,
      ownerId: user.id
    }
  })

  return NextResponse.json(newDoc)
}