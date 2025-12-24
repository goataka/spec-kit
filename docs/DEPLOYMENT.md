# デプロイガイド

勤怠管理システムのデプロイ手順

## 🏗️ アーキテクチャ

### 本番環境

- **フロントエンド**: AWS S3 + CloudFront
- **ウェブサイト**: AWS S3 + CloudFront
- **バックエンド**: AWS Lambda + API Gateway
- **データベース**: Amazon DynamoDB
- **キャッシュ**: Amazon ElastiCache for Valkey
- **認証**: Cognito User Pools（オプション）
- **IaC**: AWS CDK

### 環境

- **dev**: 開発環境
- **staging**: ステージング環境
- **prod**: 本番環境

## 📋 前提条件

1. **AWS CLIインストール**

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

2. **AWS認証情報設定**

```bash
aws configure
# AWS Access Key ID: your-key
# AWS Secret Access Key: your-secret
# Default region name: ap-northeast-1
# Default output format: json
```

3. **AWS CDKインストール**

```bash
npm install -g aws-cdk
```

4. **CDKブートストラップ**

```bash
cd infrastructure/cdk
cdk bootstrap aws://ACCOUNT-ID/ap-northeast-1
```

## 🚀 デプロイ手順

### 1. 環境変数の設定

各環境の環境変数を設定：

```bash
# dev環境
cp apps/backend/.env.example apps/backend/.env.dev
cp apps/frontend/.env.example apps/frontend/.env.dev

# staging環境
cp apps/backend/.env.example apps/backend/.env.staging
cp apps/frontend/.env.example apps/frontend/.env.staging

# prod環境
cp apps/backend/.env.example apps/backend/.env.prod
cp apps/frontend/.env.example apps/frontend/.env.prod
```

### 2. ビルド

```bash
# すべてのアプリをビルド
npm run build
```

### 3. インフラストラクチャのデプロイ

```bash
cd infrastructure/cdk

# dev環境
npm run deploy:dev

# staging環境
npm run deploy:staging

# prod環境
npm run deploy:prod
```

または、デプロイスクリプトを使用：

```bash
# dev環境
./infrastructure/scripts/deploy-dev.sh

# staging環境
./infrastructure/scripts/deploy-staging.sh

# prod環境
./infrastructure/scripts/deploy-prod.sh
```

### 4. DynamoDBテーブルの作成

```bash
# dev環境
NODE_ENV=dev npm run create-tables --workspace=database

# staging環境
NODE_ENV=staging npm run create-tables --workspace=database

# prod環境
NODE_ENV=prod npm run create-tables --workspace=database
```

### 5. 初期データの投入（オプション）

```bash
# dev環境のみ
NODE_ENV=dev npm run seed-data --workspace=database
```

## 📦 CDKスタック構成

### DynamoDBスタック

```typescript
// infrastructure/cdk/lib/dev/dynamodb-stack.ts
export class DynamoDBStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    // Usersテーブル
    const usersTable = new Table(this, 'Users', {
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
    
    // Clocksテーブル
    const clocksTable = new Table(this, 'Clocks', {
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      sortKey: { name: 'timestamp', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
  }
}
```

### Lambda + API Gatewayスタック

```typescript
// infrastructure/cdk/lib/dev/apigateway-stack.ts
export class ApiGatewayStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    // Lambda関数
    const apiFunction = new Function(this, 'ApiFunction', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'main.handler',
      code: Code.fromAsset('../../apps/backend/dist'),
      environment: {
        DYNAMODB_USERS_TABLE: 'Users-dev',
        DYNAMODB_CLOCKS_TABLE: 'Clocks-dev',
      },
    });
    
    // API Gateway
    const api = new RestApi(this, 'Api', {
      restApiName: 'Attendance API',
    });
    
    api.root.addProxy({
      defaultIntegration: new LambdaIntegration(apiFunction),
    });
  }
}
```

### S3 + CloudFrontスタック

```typescript
// infrastructure/cdk/lib/dev/frontend-stack.ts
export class FrontendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    // S3バケット
    const bucket = new Bucket(this, 'FrontendBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
    });
    
    // CloudFront
    const distribution = new CloudFrontWebDistribution(this, 'Distribution', {
      originConfigs: [{
        s3OriginSource: {
          s3BucketSource: bucket,
        },
        behaviors: [{ isDefaultBehavior: true }],
      }],
    });
    
    // デプロイ
    new BucketDeployment(this, 'DeployWebsite', {
      sources: [Source.asset('../../apps/frontend/dist')],
      destinationBucket: bucket,
      distribution,
    });
  }
}
```

## 🔍 デプロイ後の確認

### 1. ヘルスチェック

```bash
# APIヘルスチェック
curl https://your-api-url/api/v1/health

# フロントエンド
curl https://your-cloudfront-url
```

### 2. 動作確認

1. ユーザー登録
2. ログイン
3. 打刻機能
4. 管理者機能

### 3. ログ確認

```bash
# Lambda logs
aws logs tail /aws/lambda/attendance-api-dev --follow

# CloudFrontログ
aws s3 ls s3://your-cloudfront-logs-bucket/
```

## 🔄 ロールバック

### CDKスタックのロールバック

```bash
# 前のバージョンに戻す
cdk deploy --rollback
```

### Lambda関数のロールバック

```bash
# 前のバージョンに戻す
aws lambda update-function-code \
  --function-name attendance-api-dev \
  --s3-bucket your-lambda-bucket \
  --s3-key previous-version.zip
```

## 🛠️ トラブルシューティング

### デプロイ失敗時

1. **エラーログを確認**

```bash
cdk deploy --verbose
```

2. **スタックイベントを確認**

```bash
aws cloudformation describe-stack-events \
  --stack-name YourStackName
```

3. **リソース制限を確認**

```bash
aws service-quotas list-service-quotas \
  --service-code lambda
```

### 接続エラー

1. **VPC設定を確認**
2. **セキュリティグループを確認**
3. **IAMロールの権限を確認**

## 🔒 セキュリティ

### 環境変数の管理

AWS Systems Manager Parameter Storeを使用：

```bash
# パラメータを保存
aws ssm put-parameter \
  --name /attendance-system/dev/jwt-secret \
  --value "your-secret" \
  --type SecureString

# Lambda環境変数で参照
Environment:
  Variables:
    JWT_SECRET: '{{resolve:ssm:/attendance-system/dev/jwt-secret}}'
```

### IAMポリシー

最小権限の原則に従う：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:Query"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/Users-*"
    }
  ]
}
```

## 📊 モニタリング

### CloudWatch アラーム

```bash
# Lambda エラー率
aws cloudwatch put-metric-alarm \
  --alarm-name lambda-error-rate \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold

# API Gateway レイテンシー
aws cloudwatch put-metric-alarm \
  --alarm-name api-latency \
  --metric-name Latency \
  --namespace AWS/ApiGateway \
  --statistic Average \
  --period 60 \
  --threshold 1000 \
  --comparison-operator GreaterThanThreshold
```

### X-Ray トレーシング

Lambda関数でX-Rayを有効化：

```typescript
const apiFunction = new Function(this, 'ApiFunction', {
  tracing: Tracing.ACTIVE,
  // ...
});
```

## 💰 コスト最適化

1. **DynamoDB**: オンデマンドモードを使用
2. **Lambda**: 適切なメモリサイズを設定
3. **CloudFront**: キャッシュTTLを最適化
4. **S3**: ライフサイクルポリシーを設定

## 📝 チェックリスト

デプロイ前:
- [ ] 環境変数を設定
- [ ] ビルドが成功
- [ ] ユニットテストが成功
- [ ] セキュリティスキャン実施

デプロイ後:
- [ ] ヘルスチェック成功
- [ ] 動作確認完了
- [ ] ログ監視開始
- [ ] アラーム設定完了

## 🆘 サポート

問題が発生した場合は、以下を確認：

1. CloudWatchログ
2. X-Rayトレース
3. CloudFormationイベント
4. AWS Healthダッシュボード

詳細なサポートが必要な場合は、開発チームに連絡してください。
