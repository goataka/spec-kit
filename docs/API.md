# API仕様書

勤怠管理システムのRESTful API仕様

## 基本情報

- **ベースURL**: `https://api.example.com/api/v1`
- **認証**: Bearer Token (JWT)
- **レスポンス形式**: JSON
- **文字コード**: UTF-8

## 認証

### ユーザー登録

新しいユーザーを登録します。最初のユーザーは自動的に管理者権限が付与されます。

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "山田太郎"
}
```

**レスポンス**:

```json
{
  "user": {
    "userId": "uuid-1234",
    "email": "user@example.com",
    "name": "山田太郎",
    "role": "ADMIN"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh-token-here"
}
```

### ログイン

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**レスポンス**:

```json
{
  "user": {
    "userId": "uuid-1234",
    "email": "user@example.com",
    "name": "山田太郎",
    "role": "ADMIN"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh-token-here"
}
```

## ユーザー管理（管理者のみ）

### ユーザー一覧取得

```http
GET /users
Authorization: Bearer {token}
```

**レスポンス**:

```json
[
  {
    "userId": "uuid-1234",
    "email": "user@example.com",
    "name": "山田太郎",
    "role": "ADMIN",
    "department": "開発部",
    "position": "マネージャー",
    "employeeId": "EMP001",
    "createdAt": "2025-12-24T00:00:00.000Z",
    "updatedAt": "2025-12-24T00:00:00.000Z"
  }
]
```

### ユーザー詳細取得

```http
GET /users/:userId
Authorization: Bearer {token}
```

**レスポンス**:

```json
{
  "userId": "uuid-1234",
  "email": "user@example.com",
  "name": "山田太郎",
  "role": "ADMIN",
  "department": "開発部",
  "position": "マネージャー",
  "employeeId": "EMP001",
  "createdAt": "2025-12-24T00:00:00.000Z",
  "updatedAt": "2025-12-24T00:00:00.000Z",
  "createdBy": "system",
  "updatedBy": "uuid-1234"
}
```

### ユーザー更新

```http
PUT /users/:userId
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "山田太郎",
  "department": "開発部",
  "position": "シニアマネージャー",
  "role": "ADMIN"
}
```

**レスポンス**:

```json
{
  "userId": "uuid-1234",
  "email": "user@example.com",
  "name": "山田太郎",
  "role": "ADMIN",
  "department": "開発部",
  "position": "シニアマネージャー",
  "updatedAt": "2025-12-24T01:00:00.000Z"
}
```

## 従業員管理（管理者のみ）

### 従業員一覧取得

```http
GET /employees
Authorization: Bearer {token}
```

**レスポンス**:

```json
[
  {
    "userId": "uuid-1234",
    "employeeNumber": "EMP001",
    "name": "山田太郎",
    "email": "user@example.com",
    "department": "開発部",
    "position": "マネージャー",
    "hireDate": "2025-01-01",
    "status": "ACTIVE",
    "createdAt": "2025-12-24T00:00:00.000Z",
    "updatedAt": "2025-12-24T00:00:00.000Z"
  }
]
```

### 従業員詳細取得

```http
GET /employees/:userId
Authorization: Bearer {token}
```

**レスポンス**:

```json
{
  "userId": "uuid-1234",
  "employeeNumber": "EMP001",
  "name": "山田太郎",
  "email": "user@example.com",
  "department": "開発部",
  "position": "マネージャー",
  "hireDate": "2025-01-01",
  "status": "ACTIVE",
  "phoneNumber": "090-1234-5678",
  "address": "東京都渋谷区...",
  "createdAt": "2025-12-24T00:00:00.000Z",
  "updatedAt": "2025-12-24T00:00:00.000Z",
  "createdBy": "system",
  "updatedBy": "uuid-admin"
}
```

### 従業員作成

```http
POST /employees
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "uuid-5678",
  "name": "佐藤花子",
  "email": "sato@example.com",
  "department": "営業部",
  "position": "営業担当",
  "hireDate": "2025-12-01"
}
```

**レスポンス**:

```json
{
  "userId": "uuid-5678",
  "employeeNumber": "EMP002",
  "name": "佐藤花子",
  "email": "sato@example.com",
  "department": "営業部",
  "position": "営業担当",
  "hireDate": "2025-12-01",
  "status": "ACTIVE",
  "createdAt": "2025-12-24T02:00:00.000Z"
}
```

## 勤怠管理

### 出勤打刻

```http
POST /attendance/check-in
Authorization: Bearer {token}
Content-Type: application/json

{
  "notes": "定時出勤"
}
```

**レスポンス**:

```json
{
  "clockId": "clock-uuid-1234",
  "userId": "uuid-1234",
  "type": "CHECK_IN",
  "timestamp": "2025-12-24T09:00:00.000Z",
  "date": "2025-12-24",
  "checkInTime": "2025-12-24T09:00:00.000Z",
  "notes": "定時出勤",
  "createdAt": "2025-12-24T09:00:00.000Z",
  "createdBy": "uuid-1234"
}
```

### 退勤打刻

```http
POST /attendance/check-out
Authorization: Bearer {token}
Content-Type: application/json

{
  "notes": "定時退勤"
}
```

**レスポンス**:

```json
{
  "clockId": "clock-uuid-5678",
  "userId": "uuid-1234",
  "type": "CHECK_OUT",
  "timestamp": "2025-12-24T18:00:00.000Z",
  "date": "2025-12-24",
  "checkOutTime": "2025-12-24T18:00:00.000Z",
  "notes": "定時退勤",
  "createdAt": "2025-12-24T18:00:00.000Z",
  "createdBy": "uuid-1234"
}
```

### 自分の打刻記録取得

```http
GET /attendance/clocks?startDate=2025-12-01&endDate=2025-12-31
Authorization: Bearer {token}
```

**クエリパラメータ**:
- `startDate`: 開始日（YYYY-MM-DD）
- `endDate`: 終了日（YYYY-MM-DD）
- `type`: 打刻タイプ（CHECK_IN | CHECK_OUT）

**レスポンス**:

```json
{
  "clocks": [
    {
      "clockId": "clock-uuid-1234",
      "userId": "uuid-1234",
      "type": "CHECK_IN",
      "timestamp": "2025-12-24T09:00:00.000Z",
      "date": "2025-12-24",
      "checkInTime": "2025-12-24T09:00:00.000Z",
      "notes": "定時出勤"
    },
    {
      "clockId": "clock-uuid-5678",
      "userId": "uuid-1234",
      "type": "CHECK_OUT",
      "timestamp": "2025-12-24T18:00:00.000Z",
      "date": "2025-12-24",
      "checkOutTime": "2025-12-24T18:00:00.000Z",
      "notes": "定時退勤"
    }
  ],
  "count": 2
}
```

### 今日の打刻記録取得

```http
GET /attendance/clocks/today
Authorization: Bearer {token}
```

**レスポンス**:

```json
{
  "clocks": [
    {
      "clockId": "clock-uuid-1234",
      "userId": "uuid-1234",
      "type": "CHECK_IN",
      "timestamp": "2025-12-24T09:00:00.000Z",
      "date": "2025-12-24",
      "checkInTime": "2025-12-24T09:00:00.000Z"
    }
  ],
  "count": 1
}
```

### 全従業員の打刻記録取得（管理者のみ）

```http
GET /attendance/clocks/admin?userId=uuid-1234&startDate=2025-12-01&endDate=2025-12-31
Authorization: Bearer {token}
```

**クエリパラメータ**:
- `userId`: ユーザーID（オプション）
- `startDate`: 開始日（YYYY-MM-DD）
- `endDate`: 終了日（YYYY-MM-DD）
- `type`: 打刻タイプ（CHECK_IN | CHECK_OUT）

**レスポンス**:

```json
{
  "clocks": [
    {
      "clockId": "clock-uuid-1234",
      "userId": "uuid-1234",
      "userName": "山田太郎",
      "employeeNumber": "EMP001",
      "type": "CHECK_IN",
      "timestamp": "2025-12-24T09:00:00.000Z",
      "date": "2025-12-24",
      "checkInTime": "2025-12-24T09:00:00.000Z",
      "notes": "定時出勤"
    }
  ],
  "count": 1
}
```

## エラーレスポンス

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "バリデーションエラー",
  "errors": [
    {
      "field": "email",
      "message": "有効なメールアドレスを入力してください"
    }
  ]
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "認証されていません"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "アクセス権限がありません"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "リソースが見つかりません"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "サーバーエラーが発生しました"
}
```

## レート制限

- 認証エンドポイント: 10リクエスト/分
- その他のエンドポイント: 100リクエスト/分

レート制限を超えた場合:

```json
{
  "statusCode": 429,
  "message": "リクエスト制限を超えました",
  "retryAfter": 60
}
```

## ページネーション

リスト取得APIでは、ページネーションがサポートされています。

**クエリパラメータ**:
- `limit`: 取得件数（デフォルト: 20、最大: 100）
- `offset`: オフセット（デフォルト: 0）

**レスポンス**:

```json
{
  "data": [...],
  "pagination": {
    "total": 50,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

## 監査フィールド

全てのリソースには以下の監査フィールドが含まれます:

- `createdAt`: 作成日時（ISO 8601形式）
- `updatedAt`: 更新日時（ISO 8601形式）
- `createdBy`: 作成者のユーザーID
- `updatedBy`: 更新者のユーザーID

## 多言語対応

APIは`Accept-Language`ヘッダーに基づいてエラーメッセージの言語を切り替えます。

```http
Accept-Language: ja
Accept-Language: en
```

サポート言語:
- `ja`: 日本語
- `en`: 英語

## バージョニング

APIバージョンはURLに含まれます: `/api/v1/...`

メジャーバージョン変更時は新しいバージョンが追加され、旧バージョンは少なくとも6ヶ月間維持されます。

## セキュリティ

- すべての通信はHTTPS経由
- パスワードはbcryptでハッシュ化
- JWTトークンは7日間有効
- APIキーとシークレットは環境変数で管理

## サンプルコード

### JavaScript (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ログイン
const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', response.data.accessToken);
  return response.data;
};

// 出勤打刻
const checkIn = async () => {
  const token = localStorage.getItem('token');
  const response = await api.post(
    '/attendance/check-in',
    { notes: '出勤' },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
```

### cURL

```bash
# ログイン
curl -X POST https://api.example.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# 出勤打刻
curl -X POST https://api.example.com/api/v1/attendance/check-in \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"notes":"出勤"}'
```
