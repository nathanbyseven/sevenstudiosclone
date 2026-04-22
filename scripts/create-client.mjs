#!/usr/bin/env node
// scripts/create-client.mjs
// Run: node scripts/create-client.mjs
//
// Creates a new Supabase Auth user + client_profiles row for a paid client.
// Requires SUPABASE_SERVICE_ROLE_KEY in your .env.local

import { createClient } from '@supabase/supabase-js'
import * as readline from 'readline/promises'
import { stdin as input, stdout as output } from 'process'

const SUPABASE_URL        = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY    = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const rl = readline.createInterface({ input, output })

console.log('\n── Seven Studios: Create Client Portal User ──\n')

const email    = await rl.question('Client email:    ')
const password = await rl.question('Password:        ')
const fullName = await rl.question('Full name:       ')
const company  = await rl.question('Company (opt):   ')

rl.close()

// 1. Create auth user
const { data: authData, error: authError } = await supabase.auth.admin.createUser({
  email: email.trim().toLowerCase(),
  password: password.trim(),
  email_confirm: true,  // skip email verification
})

if (authError) {
  console.error('\nFailed to create auth user:', authError.message)
  process.exit(1)
}

const userId = authData.user.id
console.log(`\nAuth user created: ${userId}`)

// 2. Insert client_profiles row
const { error: profileError } = await supabase
  .from('client_profiles')
  .insert({
    id:        userId,
    full_name: fullName.trim(),
    company:   company.trim() || null,
  })

if (profileError) {
  console.error('\nAuth user created but profile insert failed:', profileError.message)
  console.error('Manually insert into client_profiles with id:', userId)
  process.exit(1)
}

console.log('\n✓ Client created successfully!')
console.log(`  Email:   ${email.trim().toLowerCase()}`)
console.log(`  Name:    ${fullName.trim()}`)
if (company.trim()) console.log(`  Company: ${company.trim()}`)
console.log('\nSend these credentials to your client securely.')
console.log('They can log in at: https://thesevenstudio.co.za/login\n')
