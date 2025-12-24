# Frontend - 勤怠管理システム

React + TypeScriptで構築された勤怠管理システムのWebアプリケーション。

## 🎨 主な機能

- ユーザー登録・ログイン
- 出勤・退勤打刻
- 勤怠履歴表示
- 管理者ダッシュボード
- ユーザー・従業員管理
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

### テスト

```bash
# ユニットテスト
npm test

# テストwatch
npm run test:watch
```

## 🏗️ ディレクトリ構造

```
src/
├── components/
│   ├── admin/          # 管理者コンポーネント
│   ├── attendance/     # 勤怠コンポーネント
│   ├── auth/           # 認証コンポーネント
│   ├── common/         # 共通コンポーネント
│   └── layout/         # レイアウトコンポーネント
├── hooks/              # カスタムフック
├── pages/              # ページコンポーネント
├── routes/             # ルーティング設定
├── services/           # APIサービス
├── styles/             # グローバルスタイル
├── utils/              # ユーティリティ
└── locales/            # 多言語リソース
```

## 🎨 スタイリング

Tailwind CSSを使用。プライマリカラーは`#007CC0`。

### カスタム設定

```js
// tailwind.config.js
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

## 🌍 多言語化

i18nextを使用。言語はlocalStorageに保存。

```tsx
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation();
  return <h1>{t('common.appName')}</h1>;
}
```

### 言語切り替え

```tsx
import { useLanguage } from './hooks/useLanguage';

function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();
  return (
    <select value={language} onChange={(e) => changeLanguage(e.target.value)}>
      <option value="ja">日本語</option>
      <option value="en">English</option>
    </select>
  );
}
```

## 🔐 認証

JWT認証。トークンはlocalStorageに保存。

```tsx
import { useAuth } from './hooks/useAuth';

function Component() {
  const { user, login, logout, isAuthenticated, isAdmin } = useAuth();
  // ...
}
```

## 🛣️ ルーティング

React Routerを使用。

- `/` - ホーム（勤怠ページ）
- `/login` - ログイン
- `/register` - 登録
- `/attendance` - 勤怠
- `/admin/users` - ユーザー管理（管理者のみ）
- `/admin/employees` - 従業員管理（管理者のみ）
- `/admin/attendance` - 勤怠管理（管理者のみ）

## 📡 API通信

Axiosベースのカスタムクライアント。

```tsx
import { apiClient } from './services/api';

const data = await apiClient.get<User[]>('/users');
```

## 🌍 環境変数

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## 📚 技術スタック

- React 18
- TypeScript 5
- Vite
- React Router 6
- Tailwind CSS
- i18next
- Axios
- TanStack Query

## 🧪 テスト

Vitestを使用。

```bash
npm test
```

## 📦 ビルド

```bash
npm run build
```

ビルド成果物は`dist/`に出力。

## 🚀 デプロイ

AWS S3 + CloudFrontにデプロイ。詳細は[デプロイガイド](../../docs/DEPLOYMENT.md)を参照。

## 🎯 パフォーマンス

- コード分割（React.lazy）
- 画像最適化
- メモ化（React.memo, useMemo, useCallback）
- バンドルサイズ最適化

## ♿ アクセシビリティ

- セマンティックHTML
- ARIAラベル
- キーボードナビゲーション
- カラーコントラスト準拠

## 📱 レスポンシブ

- 最小サイズ: 1280x1024px
- 推奨サイズ: 1920x1080px以上
- モバイル対応（タブレット、スマートフォン）
