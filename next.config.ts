import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // WordPress REST APIのエンドポイント（Docker内部URL）
  // 本番環境では .env.local で上書きする
  env: {
    WP_API_URL: process.env.WP_API_URL ?? 'http://wordpress:9000/wp-json/wp/v2',
  },

  images: {
    // Bunny.netのCDNドメインを許可
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.b-cdn.net',  // Bunny.net CDN
      },
      {
        protocol: 'http',
        hostname: 'localhost',    // ローカル開発時
      },
    ],
    // 画像フォーマット最適化
    formats: ['image/avif', 'image/webp'],
  },

  // セキュリティヘッダー
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',        value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
