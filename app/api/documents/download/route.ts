// app/api/documents/download/route.ts
// Generates a short-lived signed URL for a client document.
// The client must be authenticated and own the document.
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const documentId = searchParams.get('id')

  if (!documentId) {
    return NextResponse.json({ error: 'Missing document id' }, { status: 400 })
  }

  const supabase = createClient()

  // Verify authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  // Fetch the document row — RLS ensures only the owner can read it
  const { data: doc, error: docError } = await supabase
    .from('documents')
    .select('storage_path, name')
    .eq('id', documentId)
    .eq('client_id', user.id)
    .single()

  if (docError || !doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  // Generate signed URL valid for 60 seconds
  const { data: signed, error: signError } = await supabase
    .storage
    .from('client-documents')
    .createSignedUrl(doc.storage_path, 60)

  if (signError || !signed) {
    return NextResponse.json({ error: 'Could not generate download link' }, { status: 500 })
  }

  return NextResponse.json({ url: signed.signedUrl, name: doc.name })
}
