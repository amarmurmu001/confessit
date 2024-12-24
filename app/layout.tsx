import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Confessit',
  description: 'A platform for anonymous confessions',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
