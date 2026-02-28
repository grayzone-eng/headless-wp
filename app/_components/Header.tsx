'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/',        label: 'TOP' },
  { href: '/casts',   label: 'CAST' },
  { href: '/stores',  label: 'STORE' },
  { href: '/news',    label: 'NEWS' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-mono text-sm font-bold tracking-tight">
          NAKASU<span className="text-emerald-400">.</span>GROUP
        </Link>

        <nav className="flex items-center gap-6">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-mono text-[11px] tracking-widest transition-colors ${
                pathname === item.href
                  ? 'text-emerald-400'
                  : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
