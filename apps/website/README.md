# Website - 勤怠管理システム 製品サイト

React + TypeScriptで構築された製品紹介・サポートサイト。

## 🎨 主な機能

- 製品紹介ページ
- 機能説明
- 料金プラン
- サポートページ（FAQ、お問い合わせ）
- ドキュメント
- リリースノート
- 多言語対応（日本語・英語）

## 🚀 開発

### セットアップ

```bash
npm install
cp .env.example .env
```

### 実行

```bash
# 開発モード
npm run dev

# プロダクションビルド
npm run build

# プレビュー
npm run preview
```

## 🏗️ ディレクトリ構造

```
src/
├── components/
│   ├── product/        # 製品紹介コンポーネント
│   ├── support/        # サポートコンポーネント
│   ├── releases/       # リリースノートコンポーネント
│   ├── common/         # 共通コンポーネント
│   └── layout/         # レイアウトコンポーネント
├── pages/              # ページコンポーネント
├── routes/             # ルーティング設定
├── hooks/              # カスタムフック
├── utils/              # ユーティリティ
├── locales/            # 多言語リソース
└── styles/             # グローバルスタイル
```

## 🎨 デザイン

### カラースキーム

- プライマリ: `#007CC0`
- セカンダリ: `#005A8D`
- 背景: `#FFFFFF`, `#F9FAFB`

### タイポグラフィ

- 見出し: フォントウェイト 700
- 本文: フォントウェイト 400
- レスポンシブフォントサイズ

## 🌍 多言語化

i18nextを使用。ブラウザ言語を自動検出。

```tsx
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation();
  return <h1>{t('hero.title')}</h1>;
}
```

## 🛣️ ルーティング

- `/` - ホーム（製品紹介）
- `/support` - サポート
- `/releases` - リリースノート

## 📄 リリースノート

リリース情報は`public/data/releases.json`で管理。

```json
{
  "releases": [
    {
      "version": "1.0.0",
      "date": "2025-12-24",
      "title": "初回リリース",
      "description": "...",
      "features": ["...", "..."],
      "fixes": ["...", "..."]
    }
  ]
}
```

## 📚 技術スタック

- React 18
- TypeScript 5
- Vite
- React Router 6
- Tailwind CSS
- i18next

## 📦 ビルド

```bash
npm run build
```

静的サイトとして`dist/`に出力。

## 🚀 デプロイ

AWS S3 + CloudFrontにデプロイ。

```bash
# CDKでデプロイ
cd ../../infrastructure/cdk
npm run deploy:website
```

## 🎯 SEO最適化

- セマンティックHTML
- メタタグ最適化
- Open Graph対応
- 構造化データ
- サイトマップ

## 📱 レスポンシブ

- モバイルファースト
- ブレークポイント:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

## ♿ アクセシビリティ

- WCAG 2.1 AA準拠
- セマンティックマークアップ
- キーボードナビゲーション
- スクリーンリーダー対応

## 🎨 コンポーネント

### Hero

製品のメインビジュアルとCTA。

### Features

機能一覧をグリッド表示。

### Pricing

料金プランを3カラムで表示。

### FAQ

アコーディオン形式のよくある質問。

### ContactForm

お問い合わせフォーム。

### ReleaseList

リリース履歴を時系列表示。

## 🔧 カスタマイズ

### 色の変更

`tailwind.config.js`で設定：

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#007CC0',
      },
    },
  },
};
```

### コンテンツの変更

- 製品紹介: `src/components/product/`
- サポート: `src/components/support/`
- リリースノート: `public/data/releases.json`

## 🌐 多言語コンテンツ

言語ファイル:
- `src/locales/ja.json`
- `src/locales/en.json`

新しい言語を追加する場合は、言語ファイルを作成し、`src/utils/i18n.ts`に登録。
