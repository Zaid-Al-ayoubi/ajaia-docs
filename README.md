# Ajaia Docs (AI-Native Assessment)

A lightweight collaborative document editor inspired by Google Docs. Built for the Ajaia AI-Native Full Stack Developer Assessment.

## 🔗 Live Demo
[https://ajaia-docs-4ofu.vercel.app](https://ajaia-docs-4ofu.vercel.app)

## 🔐 Test Accounts (Mock Auth)
This app uses mock authentication. Simply click on one of the seeded users to log in.
- **Alice:** `alice@ajaia.test` (Owner)
- **Bob:** `bob@ajaia.test` (Recipient for sharing)
- **Carol:** `carol@ajaia.test` (Recipient for sharing)

## ✨ Features
- **Document Management:** Create, rename, and delete documents.
- **Rich Text Editor:** Powered by TipTap, supporting Bold, Italic, Underline, Headings, and Lists.
- **Autosave:** Debounced auto-saving to the database.
- **Sharing:** Share documents with other users via email.
- **File Import:** Upload `.txt` or `.md` files to create new editable documents.
- **Ownership vs. Shared:** Clear separation of "Owned by me" and "Shared with me" in the dashboard.

## 🛠 Tech Stack
- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Editor:** TipTap
- **Database ORM:** Prisma
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel

## 🚀 Local Setup
1. Clone the repository
2. Run `npm install`
3. Add your `.env` file with `DATABASE_URL` and `DIRECT_URL` (PostgreSQL).
4. Run `npx prisma db push`
5. Run `npx prisma db seed` (to create test users)
6. Run `npm run dev`