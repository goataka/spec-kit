# Backend - 勤怠管理システム API

NestJSで構築された勤怠管理システムのRESTful APIサーバー。

## 🏗️ アーキテクチャ

### ディレクトリ構造

```
src/
├── modules/
│   ├── auth/          # 認証・認可
│   ├── users/         # ユーザー管理
│   ├── employees/     # 従業員管理
│   └── attendance/    # 勤怠管理
├── common/
│   ├── decorators/    # カスタムデコレータ
│   ├── filters/       # 例外フィルター
│   ├── interceptors/  # インターセプター
│   └── pipes/         # バリデーションパイプ
└── config/            # 設定モジュール
```

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

# プロダクションモード
npm run build
npm run start:prod
```

### テスト

```bash
# ユニットテスト
npm test

# E2Eテスト
npm run test:e2e

# カバレッジ
npm run test:cov
```

## 📡 API エンドポイント

### 認証

- `POST /api/v1/auth/register` - ユーザー登録
- `POST /api/v1/auth/login` - ログイン
- `POST /api/v1/auth/refresh` - トークンリフレッシュ

### ユーザー管理（管理者のみ）

- `GET /api/v1/users` - ユーザー一覧取得
- `GET /api/v1/users/:id` - ユーザー詳細取得
- `PUT /api/v1/users/:id` - ユーザー更新
- `DELETE /api/v1/users/:id` - ユーザー削除

### 従業員管理（管理者のみ）

- `GET /api/v1/employees` - 従業員一覧取得
- `GET /api/v1/employees/:id` - 従業員詳細取得
- `POST /api/v1/employees` - 従業員作成
- `PUT /api/v1/employees/:id` - 従業員更新

### 勤怠管理

- `POST /api/v1/attendance/check-in` - 出勤打刻
- `POST /api/v1/attendance/check-out` - 退勤打刻
- `GET /api/v1/attendance/clocks` - 自分の打刻記録取得
- `GET /api/v1/attendance/clocks/today` - 今日の打刻記録
- `GET /api/v1/attendance/clocks/admin` - 全打刻記録（管理者のみ）

## 🔐 認証

JWT（JSON Web Token）を使用。アクセストークンは7日間有効。

```bash
Authorization: Bearer <token>
```

## 💾 データベース

Amazon DynamoDBを使用。

### テーブル構造

**Users テーブル**
- PK: userId
- GSI: role-index (role, email)

**Clocks テーブル**
- PK: userId
- SK: timestamp
- GSI: date-timestamp-index (date, timestamp)

## 🌍 環境変数

```env
# AWS
AWS_REGION=ap-northeast-1
DYNAMODB_ENDPOINT=http://localhost:4566

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# API
API_PORT=3000
CORS_ORIGIN=http://localhost:5173
```

## 📚 技術スタック

- NestJS 10
- TypeScript 5
- Passport (JWT, Local)
- AWS SDK (DynamoDB, Cognito)
- bcrypt
- class-validator
- class-transformer

## 🧪 テスト戦略

- ユニットテスト: Jest
- E2Eテスト: Supertest
- カバレッジ目標: 80%以上

## 📝 開発ガイドライン

### コーディング規約

- ESLint + Prettier使用
- クラス名: PascalCase
- メソッド名: camelCase
- ファイル名: kebab-case

### コミット規約

```
feat: 新機能
fix: バグ修正
docs: ドキュメント
style: フォーマット
refactor: リファクタリング
test: テスト
chore: その他
```

## 🐛 デバッグ

```bash
npm run start:debug
```

デバッガーをポート9229で起動します。

## 📦 デプロイ

AWS Lambdaにデプロイされます。詳細は[デプロイガイド](../../docs/DEPLOYMENT.md)を参照。
