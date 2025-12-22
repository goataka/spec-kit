# API契約書: 勤怠管理システム

**バージョン**: 1.0.0  
**日付**: 2025-12-22  
**ベースURL**: `/api/v1`  
**デプロイ**: AWS API Gateway + Lambda (NestJS)  

## 認証API

### POST /auth/login
従業員/管理者ログイン

**認証**: AWS Cognito JWT  
**リクエスト**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**レスポンス (200)**:
```json
{
  "user": {
    "userId": "user_123",
    "email": "user@example.com",
    "name": "山田太郎",
    "role": "EMPLOYEE"
  },
  "accessToken": "jwt_token_here",
  "refreshToken": "refresh_token_here"
}
```

**エラー (401)**:
```json
{
  "error": "Invalid credentials",
  "code": "AUTH_INVALID_CREDENTIALS"
}
```

## 勤怠記録API

### POST /attendance/check-in
出勤記録

**認証**: 必須 (Bearer Token)  
**リクエスト**:
```json
{
  "notes": "オフィス勤務"
}
```

**レスポンス (201)**:
```json
{
  "clock": {
    "userId": "user_123",
    "type": "check_in",
    "timestamp": "2025-12-22T09:00:00Z",
    "notes": "オフィス勤務",
    "createdAt": "2025-12-22T09:00:00Z"
  }
}
```

### POST /attendance/check-out
退勤記録

**認証**: 必須  
**リクエスト**:
```json
{
  "notes": "定時退勤"
}
```

**レスポンス (200)**:
```json
{
  "clock": {
    "userId": "user_123",
    "type": "check_out",
    "timestamp": "2025-12-22T18:00:00Z",
    "notes": "定時退勤",
    "createdAt": "2025-12-22T18:00:00Z"
  }
}
```

### GET /attendance/clocks
打刻記録一覧取得 (管理者専用)

**認証**: 必須 (管理者権限)  
**クエリパラメータ**:
- `userId` (従業員ID)
- `startDate`, `endDate` (ISO 8601)
- `limit` (デフォルト: 20, 最大: 100)
- `lastEvaluatedKey` (ページネーション用)

**レスポンス (200)**:
```json
{
  "clocks": [
    {
      "userId": "user_123",
      "type": "check_in",
      "timestamp": "2025-12-22T09:00:00Z",
      "notes": "オフィス勤務"
    },
    {
      "userId": "user_123",
      "type": "check_out",
      "timestamp": "2025-12-22T18:00:00Z",
      "notes": "定時退勤"
    }
  ],
  "lastEvaluatedKey": "pagination_token",
  "count": 20
}
```

## 共通仕様

### HTTPステータスコード

- `200`: 成功
- `201`: 作成成功
- `400`: リクエストエラー
- `401`: 認証エラー
- `403`: 権限エラー
- `404`: リソース未発見
- `429`: レート制限超過
- `500`: サーバーエラー

### エラーレスポンス形式

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {},
  "requestId": "aws_request_id"
}
```

### ページネーション

DynamoDBの制限により、LastEvaluatedKeyを使用したページネーションを実装。

### 認証ヘッダー

```
Authorization: Bearer <cognito_jwt_token>
```

### レート制限

- **API Gatewayレベル**: リージョン別 10,000 req/s
- **Cognitoレベル**: ユーザー別適切な制限
- **DynamoDBレベル**: テーブル別読み書きユニット制限

### データ形式

- 日時: ISO 8601形式 (例: "2025-12-22T09:00:00Z")
- 日付: YYYY-MM-DD形式 (例: "2025-12-22")
- 通貨: JPY (日本円)
- 言語: 日本語優先、英語対応

### CORS設定

API Gatewayで以下のオリジンを許可:
- 開発: `http://localhost:3000`
- 本番: `https://your-domain.com`

### タイムアウト

- API Gateway: 30秒
- Lambda: 25秒 (API Gateway制限に準拠)

## AWS固有仕様

### Lambda関数

- **ランタイム**: Node.js 18.x
- **メモリ**: 256MB (MVP)、必要に応じて増加
- **環境変数**: 各Lambda関数に個別設定

### API Gateway

- **タイプ**: REST API
- **認証**: Cognito User Pools
- **CORS**: 有効
- **ステージ**: dev, staging, prod

### DynamoDB

- **課金モード**: PAY_PER_REQUEST
- **暗号化**: AWS管理の暗号化キー
- **バックアップ**: ポイントインタイムリカバリ有効

### CloudWatch

- **ログ**: すべてのLambda関数で有効
- **メトリクス**: API GatewayとLambdaの標準メトリクス
- **アラーム**: エラー率、レイテンシー監視