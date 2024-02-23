import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// meta.js

export const metadata = {
  title: 'Add Details',
  description: 'Add random details here', 
  author: 'Italic Dev',
  keywords: [
    'website', 'Details', 'Random' , 'fun'
  ],
  siteUrl: 'https://random-details.vercel.app/', 
  image: '/avatar.jpeg' 
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="p-0 m-0 bg-slate-800  overflow-x-hidden ">{children}</body>
    </html>
  )
}
