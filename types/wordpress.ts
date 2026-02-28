// =============================================================================
// types/wordpress.ts — WordPress REST APIレスポンスと正規化済みデータの型定義
// =============================================================================

// ── WordPress REST APIの生レスポンス ──────────────────────────────────────────
export interface WPPost {
  id:              number
  slug:            string
  title:           { rendered: string }
  excerpt:         { rendered: string }
  date:            string
  acf:             Record<string, any>   // Advanced Custom Fieldsプラグイン
  categories:      number[]
  featured_media:  number
}

// ── 正規化済みデータ型 ─────────────────────────────────────────────────────────
export interface Store {
  id:          number
  slug:        string
  name:        string
  genre:       string
  area:        string
  description: string
  openHours:   string
  tel:         string
  imageUrl:    string | null
}

export interface Cast {
  id:          number
  slug:        string
  name:        string
  age:         number
  height:      number | null
  bust:        number | null
  waist:       number | null
  hip:         number | null
  catchcopy:   string
  description: string
  storeSlug:   string
  storeName:   string
  status:      'on' | 'off' | 'break'   // 出勤中 / 本日休み / 休憩中
  imageUrl:    string | null
}

export interface WPCategory {
  id:   number
  slug: string
  name: string
}
