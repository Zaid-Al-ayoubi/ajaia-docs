'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'

export default function DocumentEditor({ docId }: { docId: string }) {
  const router = useRouter()
  
  const [title, setTitle] = useState('Loading...')
  const [isSaving, setIsSaving] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareEmail, setShareEmail] = useState('')
  const [shareMessage, setShareMessage] = useState('')

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: '<p>Start typing...</p>',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      debouncedSave(title, editor.getHTML())
    },
  })

  useEffect(() => {
    fetch(`/api/docs/${docId}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then(data => {
        setTitle(data.title)
        if (data.ownerId) setIsOwner(true)
        if (editor) editor.commands.setContent(data.content)
      })
      .catch(() => {
        alert('Document not found or no access')
        router.push('/docs')
      })
  }, [docId, editor, router])

  let saveTimeout: NodeJS.Timeout
  const debouncedSave = (newTitle: string, newContent: string) => {
    setIsSaving(true)
    clearTimeout(saveTimeout)
    saveTimeout = setTimeout(async () => {
      await fetch(`/api/docs/${docId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      })
      setIsSaving(false)
    }, 1000)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    if (editor) debouncedSave(e.target.value, editor.getHTML())
  }

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault()
    setShareMessage('Sharing...')
    const res = await fetch(`/api/docs/${docId}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: shareEmail })
    })
    const data = await res.json()
    if (res.ok) {
      setShareMessage('Shared successfully!')
      setTimeout(() => {
        setShowShareModal(false)
        setShareMessage('')
        setShareEmail('')
      }, 1500)
    } else {
      setShareMessage(data.error || 'Failed to share')
    }
  }

  if (!editor) return null

  const btnClass = (isActive: boolean) => 
    `px-3 py-1 rounded border ${isActive ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-white border-gray-300 hover:bg-gray-100 text-black'}`

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white min-h-screen text-gray-900 shadow-lg mt-4 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => router.push('/docs')} className="text-blue-600 hover:underline">
          &larr; Back to Docs
        </button>
        <div className="flex gap-4 items-center">
          <span className="text-sm text-gray-500">{isSaving ? 'Saving...' : 'All changes saved'}</span>
          {isOwner && (
            <button onClick={() => setShowShareModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Share
            </button>
          )}
        </div>
      </div>

      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        className="w-full text-3xl font-bold mb-4 outline-none border-b-2 border-transparent focus:border-gray-300 pb-2 text-black"
      />

      <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-50 border rounded-lg">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))}><b>B</b></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))}><i>I</i></button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive('underline'))}><u>U</u></button>
        <div className="w-px h-8 bg-gray-300 mx-2"></div>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))}>H1</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))}>H2</button>
        <div className="w-px h-8 bg-gray-300 mx-2"></div>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))}>Bullet List</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))}>Numbered List</button>
      </div>

      <div className="border rounded-lg p-4 min-h-[500px] prose max-w-none text-black">
        <EditorContent editor={editor} />
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-black">Share Document</h2>
            <form onSubmit={handleShare}>
              <input
                type="email"
                placeholder="Enter email (e.g. bob@ajaia.test)"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                className="w-full p-2 border rounded mb-4 text-black"
                required
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowShareModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Share</button>
              </div>
              {shareMessage && <p className="mt-4 text-sm text-center text-blue-600">{shareMessage}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}