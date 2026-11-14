# Submission Details

## 🔗 Live Deployment URL
[https://ajaia-docs-4ofu.vercel.app](https://ajaia-docs-4ofu.vercel.app)

## 🎥 Walkthrough Video
*(ضع رابط الفيديو هنا بعد ما تصوره)*

## 📦 What is Included
- Source code (Next.js + Prisma)
- `README.md` (Setup & Credentials)
- `ARCHITECTURE.md` (Engineering decisions)
- `AI_WORKFLOW.md` (AI usage explanation)
- Automated test (`test.test.ts`)

## ✅ What is Working
- Complete document CRUD.
- Rich text formatting (Bold, Italic, H1, H2, Lists).
- Autosave with debounce.
- Mock Auth (Switching between seeded users).
- Sharing logic (Owner can share via email, shows up in "Shared with me").
- File upload (`.txt` and `.md` files convert to new documents).
- Persistent cloud database.

## ⚠️ What is Incomplete / Deprioritized
- Real-time WebSocket collaboration (no live cursors).
- Role-based permissions (currently, shared users have full edit access).
- `.docx` file parsing (limited to `.txt` and `.md` for simplicity).

## 🚀 What to Build Next (With another 2-4 hours)
- Implement real-time collaborative editing using Yjs and TipTap collaboration extensions.
- Add Viewer/Editor role toggles in the share modal.
- Add PDF export.