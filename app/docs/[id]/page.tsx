import DocumentEditor from './DocumentEditor'

// هذا السطر يخبر Next.js 16 أن هذه الصفحة مسموح لها بأن تكون ديناميكية أثناء البناء
export const instant = false;

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params
  return <DocumentEditor docId={unwrappedParams.id} />
}