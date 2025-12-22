# 実装計画: 勤怠管理システム

**ブランチ**: `001-attendance-system` | **日付**: 2025-12-22 | **仕様**: spec.md
**入力**: spec.md からの機能仕様

**注意**: このテンプレートは `/speckit.plan` コマンドによって入力されます。実行ワークフローについては `.specify/templates/commands/plan.md` を参照してください。

## 概要

勤怠管理システムの開発：従業員の出勤・退勤記録、勤務時間計算、管理者向け勤怠管理機能、製品サイトとサポート機能を1つのモノレポで構築。日本語・英語対応、レスポンシブデザイン、AWSサーバレス構成で費用削減を実現。

## 技術的文脈

**言語/バージョン**: Node.js 18+, TypeScript 5.0, React 18  
**主要依存関係**: NestJS, React, Vite, AWS SDK, DynamoDB, Tailwind CSS, Passport  
**ストレージ**: Amazon DynamoDB (勤怠データ、ユーザー情報), Amazon ElastiCache for Valkey (セッション管理, AWS環境), Redis (セッション管理, ローカル/CI環境)  
**テスト**: Vitest (Unit), Cucumber + Playwright (E2E)  
**対象プラットフォーム**: Webブラウザ (Chrome, Firefox, Safari, Edge), レスポンシブデザイン  
**プロジェクトタイプ**: Webアプリケーション (モノレポ、フロントエンド・バックエンド分離)  
**パフォーマンス目標**: APIレスポンス <500ms, ページロード <3秒  
**制約**: 最低画面サイズ 1280x1024px, 推奨 1920x1080px以上, プライマリカラー #007CC0, AWSサーバレス構成, 3環境 (dev/staging/prod)  
**規模/範囲**: MVPとして基本機能のみ (勤怠記録、管理、製品サイト), 初期10ユーザー規模  

## 憲法チェック

*ゲート: Phase 0 調査前に合格する必要あり。Phase 1 設計後に再確認。*

✅ **Specification-First Development**: spec.mdが作成され、ユーザーストーリーと要件が定義済み  
✅ **User Story Independence**: 各ストーリーが独立して実装・テスト可能  
✅ **Template-Driven Consistency**: 標準テンプレートを使用  
✅ **Phase-Gate Discipline**: Specifyフェーズ完了、Planフェーズ開始  
✅ **Explicit Over Implicit**: すべての要件が明示的に定義  
✅ **Japanese Language Priority**: ドキュメントと実装が日本語優先  
✅ **Technical Constraints**: AWSサーバレス、NestJS + React SPA、DynamoDB、レスポンシブデザイン要件を遵守  

## プロジェクト構造

### ドキュメント (この機能)

```text
specs/20251222-114347794740791/
├── plan.md              # このファイル (/speckit.plan コマンド出力)
├── research.md          # Phase 0 出力 (/speckit.plan コマンド)
├── data-model.md        # Phase 1 出力 (/speckit.plan コマンド)
├── quickstart.md        # Phase 1 出力 (/speckit.plan コマンド)
├── contracts/           # Phase 1 出力 (/speckit.plan コマンド)
└── tasks.md             # Phase 2 出力 (/speckit.tasks コマンド - /speckit.plan では作成されません)
```

### ソースコード (リポジトリルート)

```text
apps/
├── backend/             # NestJS APIサーバー (AWS Lambda)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── attendance/
│   │   │   ├── users/
│   │   │   └── support/
│   │   ├── common/
│   │   └── config/
│   ├── test/
│   ├── serverless.yml
│   └── package.json
├── frontend/            # React SPA (AWS S3 + CloudFront)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   ├── public/
│   ├── tests/
│   │   ├── e2e/
│   │   └── unit/
│   └── package.json
└── website/             # 製品サイト・サポートサイト (静的サイト生成、AWS S3 + CloudFront)
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   │   ├── product/     # 製品紹介ページ (静的)
    │   │   ├── support/     # サポートページ (静的)
    │   │   └── releases/    # リリースノート (静的)
    │   ├── services/
    │   └── utils/
    ├── public/
    ├── tests/
    │   ├── e2e/
    │   └── unit/
    └── package.json

packages/
├── shared/              # 共有型定義とユーティリティ
│   ├── src/
│   │   ├── types/
│   │   ├── constants/
│   │   └── utils/
│   ├── tests/
│   └── package.json
├── database/            # DynamoDB設定とマイグレーション
│   ├── src/
│   ├── scripts/
│   └── package.json
└── config/              # AWS設定と環境変数
    ├── src/
    ├── scripts/
    └── package.json

tools/
├── docker/              # ローカル開発用Docker設定
│   ├── docker-compose.yml
│   └── Dockerfile
├── scripts/             # ビルド・デプロイスクリプト
└── ci/                  # CI/CD設定
    └── scripts/
        ├── build.sh
        └── deploy.sh

.github/
└── workflows/           # GitHub Actionsワークフロー
    └── ci.yml
        ├── test.sh
        └── deploy.sh
    └── package.json

infrastructure/
├── cdk/                 # AWS CDK for IaC
│   ├── lib/
│   │   ├── dev/         # 開発環境設定
│   │   ├── staging/     # ステージング環境設定
│   │   └── prod/        # 本番環境設定
│   ├── bin/
│   ├── test/
│   └── cdk.json
└── scripts/             # デプロイスクリプト
    ├── deploy-dev.sh
    ├── deploy-staging.sh
    └── deploy-prod.sh

docs/                    # プロジェクトドキュメント
```

**構造決定**: AWSサーバレス構成を採用し、NestJSバックエンドをLambdaで、React + ViteフロントエンドをS3+CloudFrontで、製品サイトもReact + Viteを使用。モノレポで管理し、費用削減のためサーバレスアーキテクチャを選択。

## MVP範囲の明確化

### 実装対象 (MVP)
- 基本的な勤怠記録機能 (出勤/退勤)
- 管理者向け勤怠閲覧
- 製品サイト (機能紹介) - 静的サイト
- サポートサイト (FAQ、問い合わせフォーム、ドキュメント) - 静的サイト
- リリースノートページ - 静的サイト
- 日本語/英語対応
- レスポンシブデザイン

## 複雑さ追跡

> **憲法チェックに違反がある場合のみ入力**

なし - すべての要件が憲法に準拠。ただし、AWSサーバレス構成の採用により、従来のモノリシック構成からマイクロサービス指向に変更し、費用削減を実現。

## ローカル開発環境

### Docker Compose構成
ローカル開発では以下のサービスを使用：
- **LocalStack**: AWSサービス (DynamoDB, Lambda, API Gateway, Cognito) のローカルエミュレーション
- **Redis**: セッション管理とキャッシュ (ローカル/CI環境用)

```yaml
# tools/docker/docker-compose.yml
version: '3.8'
services:
  localstack:
    image: localstack/localstack:3.0
    ports:
      - "4566:4566"
    environment:
      - SERVICES=dynamodb,lambda,apigateway,iam,cognito-idp
      - DEBUG=1
      - DYNAMODB_SHARE_DB=1
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

### ローカル実行手順
```bash
# 依存関係インストール
npm install

# ローカルインフラ起動
docker-compose -f tools/docker/docker-compose.yml up -d

# バックエンド開発サーバー
npm run dev:backend

# フロントエンド開発サーバー
npm run dev:frontend

# 製品サイト開発サーバー
npm run dev:website
```

## CI/CD構成

### GitHub Actionsワークフロー
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:e2e

  deploy-dev:
    needs: test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4
      - run: npm run build
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID_DEV }}:role/GitHubActionsRole
          aws-region: ap-northeast-1
      - run: npm run deploy:dev

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/main' && contains(github.event.head_commit.message, 'staging')
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4
      - run: npm run build
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID_STAGING }}:role/GitHubActionsRole
          aws-region: ap-northeast-1
      - run: npm run deploy:staging

  deploy-prod:
    needs: deploy-staging
    if: github.ref == 'refs/heads/main' && contains(github.event.head_commit.message, 'production')
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - run: npm run deploy:prod
```

### インフラ構成

#### AWS IAMロール設定 (OIDC認証)
```typescript
// lib/aws-cdk/infrastructure-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // OIDCプロバイダー
    const githubOidcProvider = new iam.OpenIdConnectProvider(this, 'GitHubOIDCProvider', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
      thumbprints: ['6938fd4d98bab03faadb97b34396831e3780aea1'],
    });

    // GitHub Actions用IAMロール
    const githubActionsRole = new iam.Role(this, 'GitHubActionsRole', {
      assumedBy: new iam.WebIdentityPrincipal(githubOidcProvider.openIdConnectProviderArn, {
        StringEquals: {
          'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          'token.actions.githubusercontent.com:sub': `repo:${process.env.GITHUB_REPOSITORY}:ref:refs/heads/main`,
        },
      }),
      roleName: 'GitHubActionsRole',
    });

    // 必要な権限を付与
    githubActionsRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')
    );

    // Valkey for session management in AWS
    const valkeyCluster = new elasticache.CfnCacheCluster(this, 'ValkeyCluster', {
      cacheNodeType: 'cache.t3.micro',
      engine: 'valkey',
      numCacheNodes: 1,
      clusterName: 'attendance-valkey',
    });
  }
}
```

#### AWS CDKデプロイスクリプト
```bash
# tools/scripts/deploy-infrastructure.sh
#!/bin/bash

ENVIRONMENT=$1
ACCOUNT_ID_VAR="AWS_ACCOUNT_ID_${ENVIRONMENT^^}"

if [ -z "$ENVIRONMENT" ]; then
  echo "Usage: $0 <environment>"
  echo "Environments: dev, staging, prod"
  exit 1
fi

cd lib/aws-cdk
npm ci
npm run build

# OIDC認証でデプロイ
npx cdk deploy --require-approval never --profile ${ENVIRONMENT}
```

### テスト構成
- **Unit Tests**: Vitestで各モジュールの単体テスト
- **API Tests**: SupertestでNestJS APIテスト
- **Component Tests**: React Testing LibraryでReactコンポーネントテスト
- **Integration Tests**: API統合テスト
- **E2E Tests**: Cucumber + Playwrightでユーザーシナリオテスト

```bash
# テスト実行
npm run test:unit      # 単体テスト
npm run test:api       # APIテスト
npm run test:components # コンポーネントテスト
npm run test:integration  # 統合テスト
npm run test:e2e       # E2Eテスト (Cucumber + Playwright)
```