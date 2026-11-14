import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

// إخبار Next.js أن هذه الصفحة ديناميكية
export const instant = false;

export default async function Home() {
  const user = await getCurrentUser()
  
  if (user) {
    redirect('/docs')
  } else {
    redirect('/login')
  }
}