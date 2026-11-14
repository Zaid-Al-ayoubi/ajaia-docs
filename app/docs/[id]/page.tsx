import DocumentEditor from './DocumentEditor'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params
  return <DocumentEditor docId={unwrappedParams.id} />
}