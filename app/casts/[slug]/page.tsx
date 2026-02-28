import { getCasts, getCastBySlug } from '@/lib/wordpress'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 60

// ── 静的パス生成（SSG） ────────────────────────────────────────────────────────
// ビルド時に全キャストのページを静的生成する
// WordPressで新しいキャストが追加された場合はISRで自動的に追加される
export async function generateStaticParams() {
  const casts = await getCasts()
  return casts.map(cast => ({ slug: cast.slug }))
}

// ── メタデータ生成 ─────────────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const cast = await getCastBySlug(params.slug)
  if (!cast) return { title: 'Not Found' }

  return {
    title: `${cast.name} | ${cast.storeName}`,
    description: cast.catchcopy,
  }
}

// ── ページコンポーネント ───────────────────────────────────────────────────────
export default async function CastDetailPage(
  { params }: { params: { slug: string } }
) {
  const cast = await getCastBySlug(params.slug)
  if (!cast) notFound()

  const statusMap = {
    on:    { label: '出勤中',   cls: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
    off:   { label: '本日休み', cls: 'text-zinc-500 border-zinc-700 bg-zinc-800/50' },
    break: { label: '休憩中',   cls: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  }
  const status = statusMap[cast.status]

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">

      {/* パンくず */}
      <nav className="font-mono text-xs text-zinc-600 mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-zinc-400 transition-colors">TOP</Link>
        <span>/</span>
        <Link href="/casts" className="hover:text-zinc-400 transition-colors">CAST</Link>
        <span>/</span>
        <span className="text-zinc-400">{cast.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* 画像 */}
        <div className="aspect-[3/4] bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden">
          {cast.imageUrl ? (
            <img src={cast.imageUrl} alt={cast.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-mono text-8xl text-zinc-700">{cast.name[0]}</span>
            </div>
          )}
        </div>

        {/* 情報 */}
        <div className="flex flex-col">

          {/* ステータス */}
          <div className={`inline-flex w-fit font-mono text-xs px-3 py-1 border rounded-sm mb-4 ${status.cls}`}>
            {status.label}
          </div>

          <h1 className="text-3xl font-light mb-1">{cast.name}</h1>
          <p className="text-sm text-zinc-500 mb-2">{cast.storeName}</p>
          <p className="text-sm text-emerald-400 mb-6">{cast.catchcopy}</p>

          {/* スペック */}
          <div className="grid grid-cols-2 gap-2 mb-6 font-mono">
            {[
              { label: 'AGE',    value: cast.age ? `${cast.age}歳` : null },
              { label: 'HEIGHT', value: cast.height ? `${cast.height}cm` : null },
              { label: 'BUST',   value: cast.bust ? `B${cast.bust}` : null },
              { label: 'WAIST',  value: cast.waist ? `W${cast.waist}` : null },
              { label: 'HIP',    value: cast.hip ? `H${cast.hip}` : null },
            ].filter(s => s.value).map(spec => (
              <div key={spec.label} className="bg-zinc-900 border border-zinc-800 rounded-sm p-3">
                <div className="text-[9px] text-zinc-600 tracking-widest mb-1">{spec.label}</div>
                <div className="text-sm text-zinc-200">{spec.value}</div>
              </div>
            ))}
          </div>

          {/* 自己紹介 */}
          {cast.description && (
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-sm mb-6">
              <div className="font-mono text-xs text-zinc-600 mb-2">// PROFILE</div>
              <p className="text-sm text-zinc-300 leading-relaxed">{cast.description}</p>
            </div>
          )}

          {/* ISR技術ノート（ポートフォリオ用） */}
          <div className="mt-auto p-3 border border-zinc-800 rounded-sm">
            <p className="font-mono text-[10px] text-zinc-700 leading-relaxed">
              // このページはSSGで静的生成済み<br />
              // ISR revalidate=60 — WordPressで更新すると60秒以内に反映
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}
