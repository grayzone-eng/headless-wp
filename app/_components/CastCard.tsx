'use client'

import Link from 'next/link'
import { Cast } from '@/types/wordpress'

const STATUS_MAP = {
  on:    { label: '出勤中',   color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  off:   { label: '本日休み', color: 'bg-zinc-800 text-zinc-500 border-zinc-700' },
  break: { label: '休憩中',   color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
}

export function CastCard({ cast }: { cast: Cast }) {
  const status = STATUS_MAP[cast.status]

  return (
    <Link
      href={`/casts/${cast.slug}`}
      className="group block bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden hover:border-zinc-600 transition-all duration-200"
    >
      {/* 画像エリア */}
      <div className="aspect-[3/4] bg-zinc-800 relative overflow-hidden">
        {cast.imageUrl ? (
          <img
            src={cast.imageUrl}
            alt={cast.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-mono text-5xl text-zinc-700">
              {cast.name[0]}
            </span>
          </div>
        )}

        {/* ステータスバッジ */}
        <div className="absolute top-3 left-3">
          <span className={`font-mono text-[10px] px-2 py-1 rounded-sm border ${status.color}`}>
            {status.label}
          </span>
        </div>

        {/* ストア名 */}
        <div className="absolute bottom-3 right-3">
          <span className="font-mono text-[9px] text-zinc-500 bg-black/60 px-2 py-1 rounded-sm">
            {cast.storeName}
          </span>
        </div>
      </div>

      {/* テキストエリア */}
      <div className="p-4">
        <div className="flex items-baseline justify-between mb-1">
          <h3 className="text-sm font-medium text-zinc-100">{cast.name}</h3>
          <span className="font-mono text-xs text-zinc-500">{cast.age}歳</span>
        </div>

        <p className="text-xs text-zinc-500 leading-relaxed mb-3 line-clamp-1">
          {cast.catchcopy}
        </p>

        {/* スペック */}
        {(cast.height || cast.bust) && (
          <div className="flex gap-3 font-mono text-[10px] text-zinc-600">
            {cast.height && <span>T{cast.height}</span>}
            {cast.bust    && <span>B{cast.bust}</span>}
            {cast.waist   && <span>W{cast.waist}</span>}
            {cast.hip     && <span>H{cast.hip}</span>}
          </div>
        )}
      </div>
    </Link>
  )
}
