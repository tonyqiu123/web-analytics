import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Easy 2 Use Web Analytics',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
