// =============================================================================
// lib/wordpress.ts — WordPress REST API クライアント
//
// 設計方針:
//   - WordPressはDockerネットワーク内部のみに公開（外部から直接アクセス不可）
//   - Next.jsはサーバサイドからWP_API_URLを叩く（ブラウザには公開しない）
//   - ISR (revalidate: 60) でキャスト情報の更新を最大60秒で反映
//   - エラー時はフォールバックデータを返す（デモ用）
// =============================================================================

import { Cast, Store, WPPost, WPCategory } from '@/types/wordpress'

const WP_API_URL = process.env.WP_API_URL ?? 'http://wordpress:9000/wp-json/wp/v2'
const REVALIDATE  = 60  // ISR: 60秒ごとに再生成

// ── ベースフェッチ ─────────────────────────────────────────────────────────────
async function wpFetch<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${WP_API_URL}${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: REVALIDATE },
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`WordPress API Error: ${res.status} ${url.toString()}`)
  }

  return res.json() as Promise<T>
}

// ── 店舗一覧（カスタム投稿タイプ: store） ─────────────────────────────────────
export async function getStores(): Promise<Store[]> {
  try {
    const posts = await wpFetch<WPPost[]>('/store', {
      per_page: '20',
      status: 'publish',
      _fields: 'id,slug,title,acf,featured_media,_links',
    })
    return posts.map(normalizeStore)
  } catch {
    // デモ用フォールバック
    return DEMO_STORES
  }
}

export async function getStoreBySlug(slug: string): Promise<Store | null> {
  try {
    const posts = await wpFetch<WPPost[]>('/store', { slug })
    if (!posts.length) return null
    return normalizeStore(posts[0])
  } catch {
    return DEMO_STORES.find(s => s.slug === slug) ?? null
  }
}

// ── キャスト一覧（カスタム投稿タイプ: cast） ──────────────────────────────────
export async function getCasts(storeSlug?: string): Promise<Cast[]> {
  try {
    const params: Record<string, string> = {
      per_page: '50',
      status:   'publish',
      _fields:  'id,slug,title,acf,featured_media,categories,_links',
    }
    if (storeSlug) params['filter[category_name]'] = storeSlug

    const posts = await wpFetch<WPPost[]>('/cast', params)
    return posts.map(normalizeCast)
  } catch {
    return DEMO_CASTS
  }
}

export async function getCastBySlug(slug: string): Promise<Cast | null> {
  try {
    const posts = await wpFetch<WPPost[]>('/cast', { slug })
    if (!posts.length) return null
    return normalizeCast(posts[0])
  } catch {
    return DEMO_CASTS.find(c => c.slug === slug) ?? null
  }
}

// ── お知らせ（標準のpostsを使用） ─────────────────────────────────────────────
export async function getPosts(limit = 5): Promise<WPPost[]> {
  try {
    return await wpFetch<WPPost[]>('/posts', {
      per_page: String(limit),
      status:   'publish',
      _fields:  'id,slug,title,excerpt,date,_links',
    })
  } catch {
    return DEMO_POSTS
  }
}

// ── データ正規化 ───────────────────────────────────────────────────────────────
function normalizeStore(post: WPPost): Store {
  return {
    id:          post.id,
    slug:        post.slug,
    name:        post.title.rendered,
    genre:       post.acf?.genre ?? '風俗',
    area:        post.acf?.area ?? '中洲',
    description: post.acf?.description ?? '',
    openHours:   post.acf?.open_hours ?? '19:00〜翌5:00',
    tel:         post.acf?.tel ?? '',
    imageUrl:    post.acf?.image_url ?? null,
  }
}

function normalizeCast(post: WPPost): Cast {
  return {
    id:          post.id,
    slug:        post.slug,
    name:        post.title.rendered,
    age:         post.acf?.age ?? 20,
    height:      post.acf?.height ?? null,
    bust:        post.acf?.bust ?? null,
    waist:       post.acf?.waist ?? null,
    hip:         post.acf?.hip ?? null,
    catchcopy:   post.acf?.catchcopy ?? '',
    description: post.acf?.description ?? '',
    storeSlug:   post.acf?.store_slug ?? '',
    storeName:   post.acf?.store_name ?? '',
    status:      post.acf?.status ?? 'off',
    imageUrl:    post.acf?.image_url ?? null,
  }
}

// =============================================================================
// デモ用フォールバックデータ
// WordPressに接続できない環境でもUIが確認できるようにする
// =============================================================================
export const DEMO_STORES: Store[] = [
  { id: 1, slug: 'shop-a', name: 'SHOP A — ソープ',      genre: 'ソープランド', area: '中洲', description: '中洲最高峰の技術と接客を誇る老舗。', openHours: '19:00〜翌5:00', tel: '092-xxx-xxxx', imageUrl: null },
  { id: 2, slug: 'shop-b', name: 'SHOP B — デリヘル',    genre: 'デリバリーヘルス', area: '中洲', description: '在籍数福岡No.1。全エリア対応。', openHours: '12:00〜翌6:00', tel: '092-xxx-xxxx', imageUrl: null },
  { id: 3, slug: 'shop-c', name: 'SHOP C — エステ',      genre: 'メンズエステ', area: '博多', description: '本格派の施術と極上のリラクゼーション。', openHours: '11:00〜翌3:00', tel: '092-xxx-xxxx', imageUrl: null },
]

export const DEMO_CASTS: Cast[] = [
  { id: 1, slug: 'sakura',  name: 'さくら',  age: 22, height: 158, bust: 85, waist: 58, hip: 86, catchcopy: '笑顔が自慢の甘えん坊',     description: 'はじめまして！さくらです。明るく楽しい時間を提供します。',      storeSlug: 'shop-a', storeName: 'SHOP A', status: 'on',   imageUrl: null },
  { id: 2, slug: 'akane',   name: 'あかね',  age: 24, height: 162, bust: 88, waist: 60, hip: 89, catchcopy: '艶やかな大人の魅力',         description: '落ち着いた雰囲気で特別なひとときをご一緒しましょう。',        storeSlug: 'shop-a', storeName: 'SHOP A', status: 'off',  imageUrl: null },
  { id: 3, slug: 'mizuki',  name: 'みずき',  age: 20, height: 155, bust: 83, waist: 56, hip: 84, catchcopy: '清楚系の癒し系',             description: 'のんびりした性格です。リラックスして過ごしてください！',      storeSlug: 'shop-b', storeName: 'SHOP B', status: 'on',   imageUrl: null },
  { id: 4, slug: 'yuzuha',  name: 'ゆずは',  age: 23, height: 160, bust: 90, waist: 62, hip: 91, catchcopy: 'Gカップの爆乳美女',           description: '元気いっぱいです！楽しい時間にしましょう。',                  storeSlug: 'shop-b', storeName: 'SHOP B', status: 'on',   imageUrl: null },
  { id: 5, slug: 'momoka',  name: 'ももか',  age: 21, height: 156, bust: 84, waist: 57, hip: 85, catchcopy: '天然ドジっ子系',             description: 'よく転びます笑。でもサービスは真剣です！',                    storeSlug: 'shop-c', storeName: 'SHOP C', status: 'off',  imageUrl: null },
  { id: 6, slug: 'hinata',  name: 'ひなた',  age: 25, height: 164, bust: 87, waist: 61, hip: 88, catchcopy: '知的な雰囲気のお姉さん系',   description: '会話も楽しめる大人の時間を提供します。',                      storeSlug: 'shop-c', storeName: 'SHOP C', status: 'on',   imageUrl: null },
]

const DEMO_POSTS: WPPost[] = [
  { id: 1, slug: 'news-1', title: { rendered: '夏季料金のご案内' },        excerpt: { rendered: '7月1日より夏季特別料金にて営業いたします。' }, date: '2025-07-01', acf: {}, categories: [], featured_media: 0 },
  { id: 2, slug: 'news-2', title: { rendered: '新人キャスト入店情報' },    excerpt: { rendered: 'フレッシュな新人キャストが続々入店中です。' }, date: '2025-07-10', acf: {}, categories: [], featured_media: 0 },
  { id: 3, slug: 'news-3', title: { rendered: 'イベント情報：七夕祭り' }, excerpt: { rendered: '7/7は特別イベントを開催します。お楽しみに。' }, date: '2025-07-07', acf: {}, categories: [], featured_media: 0 },
]
