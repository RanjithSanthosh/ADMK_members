import type { Metadata } from 'next'
// Import the font
import { Noto_Sans_Tamil } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/sonner" // <-- Import Toaster
// Configure the font
const noto_sans_tamil = Noto_Sans_Tamil({
  subsets: ['tamil'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-noto-sans-tamil', // We don't really need this, but it's good practice
})

export const metadata: Metadata = {
  title: 'அ.தி.மு.க - திருவண்ணாமலை மாவட்டம் வருகை பதிவேடு',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ta">
      {/* Apply the font class to the body */}
      <body className={`${noto_sans_tamil.className} bg-white`}>
        {children}
        <Toaster richColors/>
      </body>
    </html>
  )
}