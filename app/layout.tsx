import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import '../styles/globals.css'
import ChatButton from '@/components/ChatButton'

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'Emmanuel Dela Pena | BSIT Student & Full Stack Developer',
  description: 'Professional portfolio showcasing projects and expertise',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={jetbrainsMono.className}>
        {children}
        <ChatButton />
      </body>
    </html>
  )
}
