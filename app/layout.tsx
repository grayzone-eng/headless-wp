import type { Metadata } from 'next'
import { Header } from './_components/Header'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | NAKASU GROUP',
    default: 'NAKASU GROUP — 中洲の風俗グループ',
  },
  description: '福岡・中洲で複数店舗を展開する風俗グループ。',
  robots: {
    index: false,   // デモサイトのためインデックスしない
    follow: false,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-black text-zinc-100 antialiased">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="border-t border-zinc-800 py-8 mt-20">
          <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
            <span className="font-mono text-xs text-zinc-600">
              © 2026 NAKASU GROUP
            </span>
            <span className="font-mono text-xs text-zinc-700">
              — Demo: Headless WordPress + Next.js ISR —
            </span>
          </div>
        </footer>
      </body>
    </html>
  )
}
