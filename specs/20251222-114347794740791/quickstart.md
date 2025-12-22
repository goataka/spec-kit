# クイックスタート: 勤怠管理システム

**機能**: 勤怠管理システム  
**日付**: 2025-12-22  
**対象者**: 開発者  

## 概要

勤怠管理システムのローカル開発環境セットアップと基本的な使用方法。AWSサーバレス構成 (NestJS + Lambda, React + S3, DynamoDB)。

## 前提条件

- Node.js 18.0 以上
- npm または yarn
- AWS CLI設定済み
- AWS CDK CLI
- Git

## 環境セットアップ

### 1. リポジトリクローン

```bash
git clone <repository-url>
cd attendance-system
```

### 2. 依存関係インストール

```bash
# ルートディレクトリで
npm install

# または yarn を使用する場合
yarn install
```

### 3. AWS設定 (ローカル開発用)

ローカル開発ではAWS CLI v2の`aws login`コマンドを使用します。Classmethodの記事で説明されているように、SSOなしでIAMユーザー認証を設定します。

```bash
# AWS CLI v2がインストールされていることを確認
aws --version

# プロファイル設定 (SSOなし)
aws configure --profile attendance-dev
aws configure --profile attendance-staging
aws configure --profile attendance-prod

# aws loginで認証 (各プロファイルで実行)
aws login --profile attendance-dev
aws login --profile attendance-staging
aws login --profile attendance-prod
```

#### aws loginの設定方法 (SSOなし)

Classmethodの記事で説明されているように、以下の手順でSSOなしの設定を行います:

1. **プロファイル設定**: `aws configure`で基本設定を行う
2. **認証実行**: `aws login --profile [プロファイル名]`で認証
3. **MFA対応**: 多要素認証が必要な場合は自動的に処理

#### 設定項目
各プロファイルで以下の情報を入力:
- **AWS Access Key ID**: IAMユーザーから取得したアクセスキー
- **AWS Secret Access Key**: IAMユーザーから取得したシークレットキー
- **Default region name**: ap-northeast-1
- **Default output format**: json

#### 認証方法の特徴

1. **インタラクティブ認証**: `aws login`コマンドで対話的に認証
2. **MFAサポート**: 多要素認証を自動的に処理
3. **セッション管理**: 認証情報を安全に管理
4. **プロファイル分離**: 環境ごとに別々の認証情報を使用

#### CDKブートストラップ

```bash
# CDKブートストラップ (各環境で初回のみ)
cd infrastructure/cdk
npx cdk bootstrap --profile attendance-dev
npx cdk bootstrap --profile attendance-staging
npx cdk bootstrap --profile attendance-prod
```

#### GitHub OIDCプロバイダー設定

各AWSアカウントでGitHub OIDCプロバイダーを設定する必要があります：

1. AWS IAMコンソールで「Identity providers」を選択
2. 「Add provider」をクリック
3. Provider type: OpenID Connect
4. Provider URL: `https://token.actions.githubusercontent.com`
5. Audience: `sts.amazonaws.com`
6. Thumbprint: `6938fd4d98bab03faadb97b34396831e3780aea1`

#### IAMロール設定

各環境でGitHub Actions用のIAMロールを作成：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT-ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:OWNER/REPO:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

ロール名: `GitHubActionsRole`

### 4. 環境変数設定

`.env.local` ファイルを作成:

```env
# AWS (IAMユーザー認証プロファイルを使用)
AWS_REGION=ap-northeast-1
AWS_PROFILE=attendance-dev

# Cognito
COGNITO_USER_POOL_ID=your-user-pool-id
COGNITO_CLIENT_ID=your-client-id

# DynamoDB
DYNAMODB_TABLE_PREFIX=dev-

# App
VITE_API_BASE_URL=http://localhost:3001
```

### 5. インフラデプロイ (各環境)

```bash
# 開発環境デプロイ
cd infrastructure/cdk
npx cdk deploy --profile attendance-dev --context environment=dev

# ステージング環境デプロイ
npx cdk deploy --profile attendance-staging --context environment=staging

# 本番環境デプロイ
npx cdk deploy --profile attendance-prod --context environment=prod
```

### 5.1 GitHub Secrets設定 (OIDC認証用)

GitHubリポジトリのSettings > Secrets and variables > Actionsで以下のシークレットを設定：

- `AWS_ACCOUNT_ID_DEV`: 開発環境AWSアカウントID
- `AWS_ACCOUNT_ID_STAGING`: ステージング環境AWSアカウントID  
- `AWS_ACCOUNT_ID_PROD`: 本番環境AWSアカウントID

### 6. データベース初期化

```bash
# DynamoDB Localテーブル作成
cd packages/database
npm run create-tables-local

# 初期データ投入 (テストユーザーなど)
npm run seed-local
```

### 7. 開発サーバー起動

```bash
# バックエンド (NestJS + Lambda local)
npm run dev:backend

# フロントエンド (React + Vite)
npm run dev:frontend

# 製品サイト (React静的サイト)
npm run dev:website
```

アプリケーションが以下のURLで起動:
- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:3001
- 製品サイト: http://localhost:3002

## 基本的な使用方法

### Cognitoユーザー作成

```bash
# AWS CLIでテストユーザー作成
aws cognito-idp admin-create-user \
  --user-pool-id YOUR_USER_POOL_ID \
  --username admin@example.com \
  --temporary-password TempPass123! \
  --profile attendance-dev
```

### 管理者としてログイン

1. http://localhost:3000/admin にアクセス
2. Cognito認証でログイン
3. 初期パスワード変更後、管理者ダッシュボードにアクセス

### 従業員としてログイン

1. http://localhost:3000/employee にアクセス
2. Cognito認証でログイン

### 勤怠記録

1. 従業員ダッシュボードで「出勤」ボタンをクリック
2. 勤務終了時に「退勤」ボタンをクリック

### 管理者機能

1. 管理者画面で全従業員の打刻記録を確認

## テスト実行

### ユニットテスト

```bash
# 全ユニットテスト実行
npm test

# 特定のアプリのテスト
npm test:backend
npm test:frontend
npm test:website
```

### E2Eテスト (Cucumber + Playwright)

```bash
# E2Eテスト実行
npm run test:e2e

# 特定のシナリオ実行
npm run test:e2e -- --tags @attendance
```

### テストシナリオ例

```gherkin
# features/attendance.feature
Feature: 勤怠記録機能

  @attendance
  Scenario: 従業員が出勤・退勤を記録できる
    Given 従業員がログインしている
    When 出勤ボタンをクリックする
    Then 出勤時間が記録される
    When 退勤ボタンをクリックする
    Then 退勤時間が記録され勤務時間が計算される
```

## デプロイ

### 開発環境デプロイ

```bash
# CDKでインフラ更新
cd infrastructure/cdk
npx cdk deploy --profile attendance-dev

# アプリケーション更新
npm run build
npm run deploy:dev
```

### 本番環境デプロイ

```bash
# 本番プロファイルでデプロイ
cd infrastructure/cdk
npx cdk deploy --profile attendance-prod

# アプリケーション本番ビルド
npm run build:prod
npm run deploy:prod
```

## AWSサービス概要

### Lambda関数
- **attendance-api**: 勤怠関連API (NestJS)
- **auth-api**: 認証関連API (NestJS)

### API Gateway
- REST APIエンドポイント: `/api/v1/*`
- CORS有効
- Cognitoオーソライザー設定

### DynamoDBテーブル
- **Users**: ユーザー情報
- **Clocks**: 打刻記録

### S3 + CloudFront
- 静的アセットホスティング
- SPAルーティング対応

## トラブルシューティング

### よくある問題

**Cognito認証エラー**
- User Pool IDとClient IDを確認
- AWSリージョン設定を確認

**DynamoDB接続エラー**
- AWS認証情報が正しいか確認
- テーブル名とリージョンが一致するか確認

**Lambdaコールドスタート**
- 開発時はProvisioned Concurrencyを設定
- 本番では適切なメモリ割り当て

**CORSエラー**
- API GatewayのCORS設定を確認
- ローカル開発時はViteのproxy設定を確認

### ログ確認

```bash
# CloudWatch Logs
aws logs tail /aws/lambda/attendance-api --profile attendance-dev

# DynamoDBストリーム
aws logs tail /aws/lambda/dynamodb-stream-processor --profile attendance-dev
```

### ローカル開発のヒント

- **Lambda Local**: `serverless offline` でローカルLambda実行
- **DynamoDB Local**: ローカルDynamoDBコンテナ使用
- **Cognito Local**: 開発時はモック認証を使用

## 次のステップ

1. **機能拡張**: MVP範囲内の機能を実装完了
2. **パフォーマンス監視**: CloudWatchダッシュボード設定
3. **セキュリティ強化**: AWS WAF設定、監査ログ有効化
4. **CI/CD改善**: GitHub Actions最適化
5. **コスト最適化**: 使用状況に応じたリソース調整

## サポート

- **ドキュメント**: `/docs` ディレクトリ参照
- **AWSドキュメント**: 各サービスの公式ドキュメント
- **Issues**: GitHub Issues で報告
- **Discussions**: GitHub Discussions で質問