import type { Metadata } from 'next'
import { Inter, Lexend, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
})

const jbMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jbmono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'GST Genie — AI GST & Invoice Assistant for MSMEs',
  description:
    'GST Genie helps Indian MSMEs create GST-compliant invoices, track expenses, and stay on top of GST filing with AI-powered insights.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${lexend.variable} ${jbMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
