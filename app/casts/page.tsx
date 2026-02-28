import { getCasts } from '@/lib/wordpress'
import { CastCard } from '../_components/CastCard'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'キャスト一覧',
}

export default async function CastsPage() {
  const casts = await getCasts()

  const onCasts  = casts.filter(c => c.status === 'on')
  const offCasts = casts.filter(c => c.status !== 'on')

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      <div className="mb-10">
        <div className="font-mono text-xs tracking-widest text-emerald-400 mb-2">// CAST LIST</div>
        <h1 className="text-2xl font-light">キャスト一覧</h1>
        <p className="text-sm text-zinc-500 mt-2">
          在籍 <span className="font-mono text-zinc-300">{casts.length}</span> 名 /
          出勤中 <span className="font-mono text-emerald-400">{onCasts.length}</span> 名
        </p>
      </div>

      {/* 出勤中 */}
      {onCasts.length > 0 && (
        <section className="mb-12">
          <h2 className="font-mono text-xs tracking-widest text-emerald-400 mb-4">
            // NOW ON — {onCasts.length}名
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {onCasts.map(cast => (
              <CastCard key={cast.id} cast={cast} />
            ))}
          </div>
        </section>
      )}

      {/* 本日休み */}
      {offCasts.length > 0 && (
        <section>
          <h2 className="font-mono text-xs tracking-widest text-zinc-600 mb-4">
            // TODAY OFF — {offCasts.length}名
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 opacity-60">
            {offCasts.map(cast => (
              <CastCard key={cast.id} cast={cast} />
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
