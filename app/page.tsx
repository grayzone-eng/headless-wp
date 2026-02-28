import { getCasts, getPosts, getStores } from '@/lib/wordpress'
import { CastCard } from './_components/CastCard'
import Link from 'next/link'

// ISR: 60秒ごとに再生成
export const revalidate = 60

export default async function HomePage() {
  // サーバサイドでWordPress REST APIを並列フェッチ
  const [casts, stores, posts] = await Promise.all([
    getCasts(),
    getStores(),
    getPosts(3),
  ])

  const onlineCasts = casts.filter(c => c.status === 'on')

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      {/* Hero */}
      <section className="mb-20">
        <div className="font-mono text-xs tracking-widest text-emerald-400 mb-4">
          // FUKUOKA NAKASU
        </div>
        <h1 className="text-4xl font-light leading-tight mb-6 text-zinc-100">
          中洲を代表する<br />
          <span className="text-emerald-400">複数店舗</span>を展開するグループ
        </h1>
        <p className="text-sm text-zinc-500 leading-relaxed max-w-lg">
          福岡・中洲で複数ジャンルの店舗を展開するグループです。<br />
          高品質なサービスと安心の環境をご提供します。
        </p>

        {/* ISR説明バナー（ポートフォリオ用） */}
        <div className="mt-8 p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-sm">
          <p className="font-mono text-xs text-emerald-400 leading-relaxed">
            // TECH NOTE: このページはNext.js ISR (revalidate=60) で生成されています。<br />
            // WordPressの管理画面でキャスト情報を更新すると、最大60秒以内にこのページに反映されます。<br />
            // バックエンド: WordPress (Headless) → REST API → Next.js SSG/ISR
          </p>
        </div>
      </section>

      {/* 出勤中キャスト */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-mono text-xs tracking-widest text-emerald-400 mb-1">// NOW ON STAGE</div>
            <h2 className="text-lg font-light">出勤中のキャスト</h2>
          </div>
          <Link
            href="/casts"
            className="font-mono text-xs text-zinc-500 hover:text-zinc-200 transition-colors border border-zinc-800 px-3 py-2 rounded-sm"
          >
            全員を見る →
          </Link>
        </div>

        {onlineCasts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {onlineCasts.slice(0, 4).map(cast => (
              <CastCard key={cast.id} cast={cast} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-zinc-600 font-mono text-sm">
            現在出勤中のキャストはいません
          </div>
        )}
      </section>

      {/* 店舗一覧 */}
      <section className="mb-16">
        <div className="font-mono text-xs tracking-widest text-emerald-400 mb-1">// OUR STORES</div>
        <h2 className="text-lg font-light mb-6">店舗一覧</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stores.map(store => (
            <Link
              key={store.id}
              href={`/stores/${store.slug}`}
              className="group p-5 bg-zinc-900 border border-zinc-800 rounded-sm hover:border-zinc-600 transition-all"
            >
              <div className="font-mono text-xs text-emerald-400 mb-2">{store.genre}</div>
              <h3 className="text-sm font-medium mb-2 text-zinc-100">{store.name}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3 mb-3">
                {store.description}
              </p>
              <div className="font-mono text-xs text-zinc-600">{store.openHours}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* お知らせ */}
      <section>
        <div className="font-mono text-xs tracking-widest text-emerald-400 mb-1">// NEWS</div>
        <h2 className="text-lg font-light mb-6">お知らせ</h2>

        <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-sm overflow-hidden">
          {posts.map(post => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="flex items-center gap-6 px-5 py-4 bg-zinc-900 hover:bg-zinc-800 transition-colors"
            >
              <span className="font-mono text-xs text-zinc-600 whitespace-nowrap">
                {new Date(post.date).toLocaleDateString('ja-JP')}
              </span>
              <span
                className="text-sm text-zinc-300 flex-1"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}
