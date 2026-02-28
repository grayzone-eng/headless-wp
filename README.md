# headless-wp

**WordPress (Headless CMS) + Next.js 14 App Router + ISR**  
風俗グループ向けデモサイト — WordPress REST APIによるヘッドレス構成

---

## 概要

WordPressをAPIサーバとして使い、フロントエンドをNext.jsで構築するヘッドレス構成のデモです。

```
WordPress管理画面
    ↓ (ACF + REST API)
WordPress (Docker — 外部非公開)
    ↓ /wp-json/wp/v2/
Next.js (ISR revalidate=60)
    ↓ 静的生成
Vercel CDN → ユーザー
```

### なぜこの構成にするのか

| 課題 | 解決策 |
|------|--------|
| WordPressの表示速度劣化 | Next.js ISRで静的生成・CDN配信 |
| WordPressへの直接攻撃リスク | Dockerネットワーク内に閉じ込め |
| 管理画面の教育コスト | WordPressのまま維持（ゼロコスト） |
| キャストページのSEO | 個別URLで静的生成・構造化データ付与 |

---

## ISRの動作

```typescript
// app/casts/[slug]/page.tsx
export const revalidate = 60  // 60秒ごとに再生成

// ビルド時に全キャストのページを静的生成
export async function generateStaticParams() {
  const casts = await getCasts()
  return casts.map(cast => ({ slug: cast.slug }))
}
```

WordPressで新しいキャストを追加・更新すると、最大60秒後に反映されます。  
再ビルド不要でコンテンツを更新できる点が、風俗店のような更新頻度が高いサイトに適しています。

---

## ローカル開発

```bash
# 1. infra-iacリポジトリでWordPressを起動
cd ../infra-iac
docker compose up -d

# 2. このプロジェクトを起動
cp .env.local.example .env.local
npm install
npm run dev
```

### .env.local.example

```
# DockerローカルではWordPressのAPIを直接指定
WP_API_URL=http://localhost:8080/wp-json/wp/v2

# WordPressに接続できない場合はフォールバックデータを使用
# （lib/wordpress.ts内のDEMO_STORES / DEMO_CASTSが返される）
```

---

## WordPress側のセットアップ

1. WordPressを起動して初期設定を完了
2. **Advanced Custom Fields (ACF)** プラグインをインストール
3. カスタム投稿タイプ `cast` / `store` を作成（Custom Post Type UIプラグイン）
4. ACFでフィールドを設定:
   - cast: `age`, `height`, `bust`, `waist`, `hip`, `catchcopy`, `description`, `store_slug`, `store_name`, `status`, `image_url`
   - store: `genre`, `area`, `description`, `open_hours`, `tel`, `image_url`
5. REST APIでACFフィールドが返るように **ACF to REST API** プラグインをインストール

---

## 技術スタック

- **Next.js 14** App Router / SSG / ISR
- **TypeScript**
- **Tailwind CSS**
- **WordPress REST API** (ヘッドレスCMS)
- **Docker Compose** (infra-iacと連携)

---

## 関連リポジトリ

- [infra-iac](../infra-iac) — WordPress + PostgreSQL + Nginx のDocker Compose構成
- [media-pipeline](../media-pipeline) — メディア投稿パイプラインCLI
- [shift-api](../shift-api) — シフト管理バックエンドAPI（Redis・Telegram通知・テスト38ケース付き）
