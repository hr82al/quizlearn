import Navbar from '@/components/Navbar';
import './globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'

const poppins = Poppins({weight: "400", subsets: ['latin']});

export const metadata: Metadata = {
  title: 'Quiz Learn',
  description: 'Quiz application to learn typescript and other languages',
  keywords: 'learn, TS, typescript, quiz',
  authors : {name: 'Alexandr Khromov'},
  creator: 'Alexandr Khromov',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={poppins.className + " relative"} >
        <Navbar />
        {children}
        </body>
    </html>
  )
}
