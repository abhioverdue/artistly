import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Artistly - Performing Artist Booking Platform',
  description: 'Connect event planners with talented performing artists. Book singers, dancers, speakers, and DJs for your events.',
  keywords: ['artists', 'booking', 'events', 'performers', 'entertainment'],
  authors: [{ name: 'Artistly Team' }],
  openGraph: {
    title: 'Artistly - Performing Artist Booking Platform',
    description: 'Connect event planners with talented performing artists.',
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
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}