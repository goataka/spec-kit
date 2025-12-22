# データモデル: 勤怠管理システム

**機能**: 勤怠管理システム  
**日付**: 2025-12-22  
**設計者**: AI Assistant  

## データモデル概要

勤怠管理システムのエンティティ関係とデータ構造。Amazon DynamoDBを使用。

## DynamoDB設計原則

- **パーティションキー**: ユーザーID (userId)
- **ソートキー**: 日付やタイムスタンプ
- **GSI (Global Secondary Index)**: クエリ要件に応じた追加インデックス
- **データ構造**: ドキュメント指向、柔軟なスキーマ

## エンティティ定義

### User (ユーザー)

**テーブル**: Users

```typescript
interface User {
  // パーティションキー
  userId: string;        // UUID

  // 属性
  email: string;         // ユニーク
  name: string;
  role: 'ADMIN' | 'EMPLOYEE';
  department?: string;
  position?: string;
  employeeId?: string;   // ユニーク
  createdAt: string;     // ISO 8601
  updatedAt: string;     // ISO 8601

  // GSI用属性
  GSI1PK?: string;       // role (管理者検索用)
  GSI1SK?: string;       // email
}
```

**GSI**:
- GSI1: role-index (PK: role, SK: email) - ロール別ユーザー検索

### Clock (打刻記録)

**テーブル**: Clocks

```typescript
interface Clock {
  // パーティションキー
  userId: string;        // ユーザーID

  // ソートキー
  timestamp: string;     // ISO 8601 (打刻時刻)

  // 属性
  type: 'check_in' | 'check_out';
  notes?: string;
  createdAt: string;     // ISO 8601

  // GSI用属性
  GSI1PK?: string;       // date (日付別検索用 YYYY-MM-DD)
  GSI1SK?: string;       // timestamp
}
```

**GSI**:
- GSI1: date-timestamp-index (PK: date, SK: timestamp) - 日付別打刻検索

## DynamoDBテーブル設計

### Users テーブル

```json
{
  "TableName": "Users",
  "KeySchema": [
    {
      "AttributeName": "userId",
      "KeyType": "HASH"
    }
  ],
  "AttributeDefinitions": [
    {
      "AttributeName": "userId",
      "AttributeType": "S"
    },
    {
      "AttributeName": "email",
      "AttributeType": "S"
    },
    {
      "AttributeName": "role",
      "AttributeType": "S"
    }
  ],
  "GlobalSecondaryIndexes": [
    {
      "IndexName": "role-index",
      "KeySchema": [
        {
          "AttributeName": "role",
          "KeyType": "HASH"
        },
        {
          "AttributeName": "email",
          "KeyType": "RANGE"
        }
      ],
      "Projection": {
        "ProjectionType": "ALL"
      }
    }
  ],
  "BillingMode": "PAY_PER_REQUEST"
}
```



### Clocks テーブル

```json
{
  "TableName": "Clocks",
  "KeySchema": [
    {
      "AttributeName": "userId",
      "KeyType": "HASH"
    },
    {
      "AttributeName": "timestamp",
      "KeyType": "RANGE"
    }
  ],
  "AttributeDefinitions": [
    {
      "AttributeName": "userId",
      "AttributeType": "S"
    },
    {
      "AttributeName": "timestamp",
      "AttributeType": "S"
    },
    {
      "AttributeName": "date",
      "AttributeType": "S"
    }
  ],
  "GlobalSecondaryIndexes": [
    {
      "IndexName": "date-timestamp-index",
      "KeySchema": [
        {
          "AttributeName": "date",
          "KeyType": "HASH"
        },
        {
          "AttributeName": "timestamp",
          "KeyType": "RANGE"
        }
      ],
      "Projection": {
        "ProjectionType": "ALL"
      }
    }
  ],
  "BillingMode": "PAY_PER_REQUEST"
}
```

## データ整合性ルール

### ビジネスルール

1. **打刻の一意性**: 1ユーザーにつき1回の打刻は連続して記録可能
2. **勤務時間の計算**: checkOut - checkIn (シンプル計算)
3. **データ保持**: 打刻データは7年間保存

### 制約

- `timestamp` は有効なISO 8601形式
- `type` は 'check_in' または 'check_out'
- `email` は有効なメールアドレス形式

## クエリパターン

### ユーザー関連
- ユーザー情報取得: GetItem (userId)
- 管理者一覧取得: Query (GSI1, role = 'ADMIN')
- メールアドレス重複チェック: Query (GSI1, role = '*', email = target)

### 勤怠関連
- ユーザー別打刻履歴: Query (userId, timestamp range)
- 日付別打刻記録: Query (GSI1, date, timestamp range)

## バックアップ・リカバリ

- **バックアップ頻度**: 毎日自動バックアップ
- **保持期間**: 35日
- **リカバリ時間目標**: 1時間以内
- **暗号化**: AWS KMSによる暗号化

## コスト最適化

- **PAY_PER_REQUEST**: 読み書きオンデマンド課金
- **GSI戦略**: 必要なクエリのみインデックス作成
- **データアーカイブ**: 古いデータをS3に移動

## リレーションシップ図

```
User (1) ──── (多) Clock
```

## データベーススキーマ (Prisma)

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      Role     @default(EMPLOYEE)
  department String?
  position  String?
  employeeId String? @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  clocks Clock[]

  @@map("users")
}

model Clock {
  id        String   @id @default(cuid())
  userId    String
  timestamp DateTime
  type      ClockType
  notes     String?
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("clocks")
}

enum Role {
  ADMIN
  EMPLOYEE
}

enum ClockType {
  check_in
  check_out
}
```

## データ整合性ルール

### ビジネスルール

1. **打刻の一意性**: 1ユーザーにつき1回の打刻は連続して記録可能
2. **勤務時間の計算**: checkOut - checkIn (シンプル計算)
3. **データ保持**: 打刻データは7年間保存

### 制約

- `timestamp` は有効なISO 8601形式
- `type` は 'check_in' または 'check_out'
- `email` は有効なメールアドレス形式

## マイグレーション計画

### 初期マイグレーション
1. 基本テーブル作成 (Users, Clocks)
2. 初期データ投入 (管理者ユーザー)

### 将来の拡張
- 勤務パターンテーブル
- 休明管理テーブル
- 勤怠集計テーブル

## バックアップ・リカバリ

- **バックアップ頻度**: 毎日自動バックアップ
- **保持期間**: 35日
- **リカバリ時間目標**: 1時間以内
- **暗号化**: AWS KMSによる暗号化