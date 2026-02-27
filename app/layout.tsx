import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import ConditionalHeader from '@/components/conditional-header'
import ConditionalFooter from '@/components/conditional-footer'
import SmoothScroll from '@/components/SmoothScroll'
import { AuthProvider } from '@/lib/auth-context'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'The Myriad Hotel | Luxury Accommodation',
  description: 'Experience luxury at The Myriad Hotel. Discover elegant rooms, fine dining restaurants, and premium event spaces.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/fav.png',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <SmoothScroll />
          <ConditionalHeader />
          {children}
          <ConditionalFooter />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
