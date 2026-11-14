'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [users, setUsers] = useState<{id: string, name: string}[]>([])
  const router = useRouter()

  // بنجيب المستخدمين من الـ API
  useEffect(() => {
    fetch('/api/users').then(res => res.json()).then(data => setUsers(data))
  }, [])

  const handleLogin = async (userId: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    })
    const data = await res.json()
    if (data.success) {
      router.push(data.redirect) // نروح لصفحة الدوكيومنتس
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Select a User to Login</h1>
      <div className="flex gap-4">
        {users.map(user => (
          <button 
            key={user.id} 
            onClick={() => handleLogin(user.id)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login as {user.name}
          </button>
        ))}
      </div>
    </div>
  )
}