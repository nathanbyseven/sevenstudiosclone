// app/api/auth/signout/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = createClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/login', process.env.NEXTAUTH_URL ?? 'https://thesevenstudio.co.za'), {
    status: 302,
  })
}
