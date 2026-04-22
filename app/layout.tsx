// app/layout.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Root layout used by EVERY route:
//   /           → homepage (app/page.tsx) — injects its own <style> block
//   /login      → portal login
//   /client/*   → portal dashboard
//
// We keep this layout minimal. The homepage manages its own full CSS.
// The portal pages use Tailwind classes defined in globals.css.
// ─────────────────────────────────────────────────────────────────────────────
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const creatoDisplay = localFont({
  src: [
    { path: '../public/fonts/CreatoDisplay-Light.otf',     weight: '300', style: 'normal' },
    { path: '../public/fonts/CreatoDisplay-Regular.otf',   weight: '400', style: 'normal' },
    { path: '../public/fonts/CreatoDisplay-Medium.otf',    weight: '500', style: 'normal' },
    { path: '../public/fonts/CreatoDisplay-Bold.otf',      weight: '700', style: 'normal' },
    { path: '../public/fonts/CreatoDisplay-ExtraBold.otf', weight: '800', style: 'normal' },
    { path: '../public/fonts/CreatoDisplay-Black.otf',     weight: '900', style: 'normal' },
  ],
  variable: '--font-creatodisplay',
  display: 'swap',
})

export const metadata: Metadata = {
  // Default metadata — individual pages override title/description as needed.
  title: {
    default: 'Seven Studios® — Purpose-Led Creative Studio',
    template: '%s — Seven Studios',
  },
  description:
    'Seven Studios helps ambitious purpose-led brands define sharper positioning, build stronger identities, and create creative systems that carry across every touchpoint.',
  icons: { icon: 'https://i.ibb.co/Fb31LWRc/ssfavicon.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The homepage's inline <style> block sets body { background: #000; color: #fff }
    // The portal layout sets its own dark background via Tailwind.
    // suppressHydrationWarning is needed because next/script injects attributes.
    <html lang="en" className={creatoDisplay.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
