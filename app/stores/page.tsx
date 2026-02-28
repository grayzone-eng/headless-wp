import { getStores, getCasts } from '@/lib/wordpress'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 60
export const metadata: Metadata = { title: '店舗一覧' }

export default async function StoresPage() {
  const [stores, allCasts] = await Promise.all([getStores(), getCasts()])

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="font-mono text-xs tracking-widest text-emerald-400 mb-2">// OUR STORES</div>
      <h1 className="text-2xl font-light mb-10">店舗一覧</h1>

      <div className="flex flex-col gap-4">
        {stores.map(store => {
          const storeCasts = allCasts.filter(c => c.storeSlug === store.slug)
          const onCount    = storeCasts.filter(c => c.status === 'on').length

          return (
            <Link
              key={store.id}
              href={`/stores/${store.slug}`}
              className="group grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-zinc-900 border border-zinc-800 rounded-sm hover:border-zinc-600 transition-all"
            >
              <div className="md:col-span-3">
                <div className="font-mono text-xs text-emerald-400 mb-1">{store.genre}</div>
                <h2 className="text-base font-medium mb-2 text-zinc-100">{store.name}</h2>
                <p className="text-sm text-zinc-500 leading-relaxed">{store.description}</p>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <div className="font-mono text-xs text-zinc-600 mb-1">OPEN</div>
                  <div className="font-mono text-xs text-zinc-400">{store.openHours}</div>
                </div>
                <div>
                  <div className="font-mono text-xs text-zinc-600 mb-1">在籍 / 出勤中</div>
                  <div className="font-mono text-sm">
                    <span className="text-zinc-400">{storeCasts.length}</span>
                    <span className="text-zinc-700"> / </span>
                    <span className="text-emerald-400">{onCount}</span>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
