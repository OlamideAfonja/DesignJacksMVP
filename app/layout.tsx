import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DesignJacks — AI-Powered UI Component Design Tool',
  description: 'Generate stunning UI components, design systems, and production-ready code with AI. From concept to code in seconds.',
  keywords: 'UI design, UX design, AI design tool, component generator, design system',
  openGraph: {
    title: 'DesignJacks — AI-Powered UI Component Design Tool',
    description: 'Generate stunning UI components, design systems, and production-ready code with AI.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="noise">
        {children}
      </body>
    </html>
  )
}
