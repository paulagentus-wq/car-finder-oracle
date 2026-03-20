import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/navbar'

export const metadata: Metadata = {
  title: 'Car Finder Oracle — AI-Powered Car Intelligence',
  description:
    'Premium car intelligence platform. AI deal scoring, fault prediction, price tracking, and negotiation coaching. Find your perfect car.',
  keywords: ['car finder', 'AI car intelligence', 'deal scoring', 'fault prediction', 'used cars UK'],
  openGraph: {
    title: 'Car Finder Oracle — AI-Powered Car Intelligence',
    description: 'AI deal scoring, fault prediction, price tracking. Find your perfect car.',
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0a0a0f] text-white antialiased" style={{ fontFamily: 'Inter, sans-serif' }}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
