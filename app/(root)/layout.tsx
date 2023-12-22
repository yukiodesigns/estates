// // 'use client';
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import '../globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
    <html lang="en">
      <body>
    <Header />
        {children}
    <Footer /> 
        </body>
    </html>   
    </>
  )
}
