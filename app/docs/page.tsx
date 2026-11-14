'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import LogoutButton from './LogoutButton'

type Document = {
  id: string
  title: string
  updatedAt: string
}

export default function DocsPage() {
  const [myDocs, setMyDocs] = useState<Document[]>([])
  const [sharedDocs, setSharedDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    fetchDocs()
  }, [])

  const fetchDocs = async () => {
    try {
      const res = await fetch('/api/docs')
      if (res.status === 401) {
        router.push('/login')
        return
      }
      const data = await res.json()
      setMyDocs(data.myDocs || [])
      setSharedDocs(data.sharedDocs || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const createDocument = async () => {
    const res = await fetch('/api/docs', { method: 'POST' })
    if (res.ok) {
      const newDoc = await res.json()
      router.push(`/docs/${newDoc.id}`) // نروح للمحرر
    }
  }

  // دالة رفع الملف
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/docs/upload', {
      method: 'POST',
      body: formData,
    })

    if (res.ok) {
      const newDoc = await res.json()
      router.push(`/docs/${newDoc.id}`) // نروح للمحرر بعد الرفع
    } else {
      const error = await res.json()
      alert(error.error || 'Failed to upload file')
    }
  }

  if (loading) return <div className="p-8 text-center text-xl">Loading...</div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Documents</h1>
        <div className="flex gap-4 items-center">
          
          {/* زر رفع الملف مخفي، بيشتغل لما نضغط على الزر اللي جنبه */}
          <input 
            type="file" 
            accept=".txt,.md" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Upload .txt/.md
          </button>

          <button onClick={createDocument} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            + Create Document
          </button>
          <LogoutButton />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Owned by me</h2>
        {myDocs.length === 0 ? (
          <p className="text-gray-500">No documents yet. Create or upload one!</p>
        ) : (
          <div className="grid gap-4">
            {myDocs.map(doc => (
              <div 
                key={doc.id} 
                onClick={() => router.push(`/docs/${doc.id}`)}
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
              >
                <h3 className="font-bold text-blue-600">{doc.title}</h3>
                <p className="text-sm text-gray-500">Last updated: {new Date(doc.updatedAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Shared with me</h2>
        {sharedDocs.length === 0 ? (
          <p className="text-gray-500">No shared documents.</p>
        ) : (
          <div className="grid gap-4">
            {sharedDocs.map(doc => (
              <div 
                key={doc.id} 
                onClick={() => router.push(`/docs/${doc.id}`)}
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
              >
                <h3 className="font-bold text-blue-600">{doc.title}</h3>
                <p className="text-sm text-gray-500">Last updated: {new Date(doc.updatedAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}