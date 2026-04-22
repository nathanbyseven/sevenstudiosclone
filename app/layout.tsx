// app/layout.tsx
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
  ],
  variable: '--font-creatodisplay',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Client Portal — Seven Studios',
  description: 'Your private workspace with Seven Studios.',
  robots: { index: false, follow: false }, // portal pages stay private
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={creatoDisplay.variable}>
      <body className="font-display bg-brand-black text-brand-white antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
