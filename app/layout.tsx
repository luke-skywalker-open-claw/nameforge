import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NameForge — AI Business Name Generator',
  description: 'Generate creative business and project names with AI. Get domain hints, rationale, and vibe scores instantly.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
