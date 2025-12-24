# タスク: 勤怠管理システム

**入力**: `/specs/20251222-114347794740791/` からの設計ドキュメント
**前提条件**: plan.md (必須), spec.md (必須), research.md, data-model.md, contracts/api-contracts.md, quickstart.md

**テスト**: このプロジェクトではテストは明示的に要求されていないため、テストタスクは含まれていません。

**組織化**: タスクはユーザーストーリーごとにグループ化され、各ストーリーの独立した実装とテストを可能にします。

## フォーマット: `- [ ] [ID] [P?] [Story?] 説明`

- **[P]**: 並行実行可能 (異なるファイル、依存関係なし)
- **[Story]**: どのユーザーストーリーに属するか (例: US1, US2, US3)
- 説明に正確なファイルパスを含める

---

## Phase 1: セットアップ (共有インフラ)

**目的**: プロジェクト初期化と基本構造

- [X] T001 plan.mdに従ってモノレポプロジェクト構造を作成 (apps/, packages/, tools/, infrastructure/, docs/)
- [X] T002 [P] ルートpackage.jsonとTurborepo設定を初期化
- [X] T003 [P] TypeScript設定 (tsconfig.json) をワークスペース全体に設定
- [X] T004 [P] ESLintとPrettierをモノレポ全体に設定
- [X] T005 [P] apps/backend/package.jsonとNestJS依存関係を初期化
- [X] T006 [P] apps/frontend/package.jsonとReact + Vite依存関係を初期化
- [X] T007 [P] apps/website/package.jsonとReact + Vite依存関係を初期化
- [X] T008 [P] packages/shared/package.jsonと共有型定義を初期化
- [X] T009 [P] packages/database/package.jsonとDynamoDB設定を初期化
- [X] T010 [P] packages/config/package.jsonとAWS設定を初期化
- [X] T011 [P] tools/docker/docker-compose.ymlを作成 (LocalStack + Redis)
- [X] T012 [P] .gitignoreをモノレポ全体に設定
- [X] T013 [P] .envテンプレートファイルを各apps/に作成

---

## Phase 2: 基盤 (ブロックする前提条件)

**目的**: あらゆるユーザーストーリーを実装する前に完了する必要があるコアインフラ

**⚠️ 重要**: このフェーズが完了するまで、ユーザーストーリーの作業を開始できません

### インフラストラクチャ & デプロイ設定

- [X] T014 infrastructure/cdk/cdk.jsonとCDKプロジェクトを初期化
- [X] T015 [P] infrastructure/cdk/lib/dev/でDynamoDBスタックを作成 (Usersテーブル, Clocksテーブル)
- [X] T016 [P] infrastructure/cdk/lib/dev/でCognito User Poolsスタックを作成
- [X] T017 [P] infrastructure/cdk/lib/dev/でAPI Gateway + Lambdaスタックを作成
- [X] T018 [P] infrastructure/cdk/lib/dev/でS3 + CloudFrontスタック (フロントエンド用) を作成
- [X] T019 [P] infrastructure/cdk/lib/dev/でS3 + CloudFrontスタック (製品サイト用) を作成
- [X] T020 [P] infrastructure/cdk/lib/dev/でElastiCache for Valkeyスタックを作成
- [X] T021 [P] infrastructure/cdk/lib/staging/にstaging環境設定をコピー (dev設定から)
- [X] T022 [P] infrastructure/cdk/lib/prod/にprod環境設定をコピー (dev設定から)
- [X] T023 infrastructure/scripts/deploy-dev.shデプロイスクリプトを作成
- [X] T024 [P] infrastructure/scripts/deploy-staging.shデプロイスクリプトを作成
- [X] T025 [P] infrastructure/scripts/deploy-prod.shデプロイスクリプトを作成

### CI/CD設定

- [X] T026 .github/workflows/ci.ymlを作成 (ビルド、テスト、リント)
- [X] T027 tools/ci/scripts/build.shを作成
- [X] T028 [P] tools/ci/scripts/deploy.shを作成
- [X] T029 [P] tools/scripts/にビルドスクリプトを作成

### バックエンド基盤

- [X] T030 apps/backend/src/main.tsとNestJSアプリケーションブートストラップを作成
- [X] T031 apps/backend/src/app.module.tsと基本モジュール構成を作成
- [X] T032 apps/backend/src/config/でAWS設定モジュールを作成 (DynamoDB, Cognito接続)
- [X] T033 apps/backend/src/config/environment.tsで環境変数管理を実装
- [X] T034 apps/backend/src/common/filters/でグローバル例外フィルターを実装
- [X] T035 [P] apps/backend/src/common/interceptors/でロギングインターセプターを実装
- [X] T036 [P] apps/backend/src/common/pipes/でバリデーションパイプを実装
- [X] T037 apps/backend/src/common/decorators/でカスタムデコレーター (Roles, CurrentUser) を実装
- [X] T038 apps/backend/serverless.ymlを作成 (Serverless Frameworkまたは直接Lambda設定)

### フロントエンド基盤

- [X] T039 apps/frontend/src/main.tsxとReactアプリケーションエントリーポイントを作成
- [X] T040 apps/frontend/vite.config.tsでVite設定を作成
- [X] T041 apps/frontend/src/App.tsxと基本アプリケーション構造を作成
- [X] T042 apps/frontend/src/services/api.tsでAxios設定とAPIクライアントを実装
- [X] T043 apps/frontend/src/hooks/useAuth.tsで認証フックを実装
- [X] T044 [P] apps/frontend/src/utils/i18n.tsで多言語化設定 (i18next) を実装
- [X] T045 [P] apps/frontend/src/styles/でTailwind CSS設定とプライマリカラー (#007CC0) を設定

### 製品サイト基盤

- [X] T046 apps/website/src/main.tsxとReactアプリケーションエントリーポイントを作成
- [X] T047 apps/website/vite.config.tsでVite設定を作成 (静的サイト生成)
- [X] T048 apps/website/src/App.tsxと基本アプリケーション構造を作成
- [X] T049 [P] apps/website/src/utils/i18n.tsで多言語化設定 (i18next) を実装
- [X] T050 [P] apps/website/src/styles/でTailwind CSS設定とプライマリカラー (#007CC0) を設定

### 共有パッケージ

- [X] T051 packages/shared/src/types/user.tsでUser型定義を作成
- [X] T052 [P] packages/shared/src/types/employee.tsでEmployee型定義を作成
- [X] T053 [P] packages/shared/src/types/clock.tsでClock型定義を作成
- [X] T054 [P] packages/shared/src/types/auth.tsで認証関連型定義を作成
- [X] T055 [P] packages/shared/src/constants/roles.tsでロール定数を作成
- [X] T056 [P] packages/shared/src/constants/errors.tsでエラーコード定数を作成
- [X] T057 [P] packages/shared/src/utils/validation.tsで共有バリデーションユーティリティを作成
- [X] T058 [P] packages/shared/src/utils/date.tsで日付ユーティリティを作成

### データベース設定

- [X] T059 packages/database/src/dynamodb.tsでDynamoDBクライアント設定を作成
- [X] T060 packages/database/scripts/create-tables.tsでテーブル作成スクリプトを作成
- [X] T061 [P] packages/database/scripts/seed-data.tsでシードデータスクリプトを作成

**チェックポイント**: 基盤準備完了 - これでユーザーストーリーの実装を並行して開始可能

---

## Phase 3: ユーザーストーリー 1 - 打刻機能 (優先度: P1) 🎯 MVP

**目標**: 従業員が勤務時間を記録し、管理者が打刻データを確認できるシステムを実装。ユーザー登録、認証、打刻、管理者機能を含む。

**独立テスト**: ユーザーがメールアドレスとパスワードで登録し、ログインして出勤/退勤を打刻でき、管理者が全従業員の打刻データと従業員情報を閲覧できることをブラウザでテスト可能。

### 認証・認可 (US1)

- [X] T062 [P] [US1] apps/backend/src/modules/auth/auth.module.tsで認証モジュールを作成
- [X] T063 [P] [US1] apps/backend/src/modules/auth/auth.controller.tsで認証コントローラー (POST /auth/register, POST /auth/login) を作成
- [X] T064 [US1] apps/backend/src/modules/auth/auth.service.tsで認証サービス (登録、ログイン、トークン発行) を実装
- [X] T065 [US1] apps/backend/src/modules/auth/strategies/jwt.strategy.tsでJWT戦略 (Passport) を実装
- [X] T066 [P] [US1] apps/backend/src/modules/auth/guards/jwt-auth.guard.tsでJWT認証ガードを実装
- [X] T067 [P] [US1] apps/backend/src/modules/auth/guards/roles.guard.tsでロールベース認可ガードを実装
- [X] T068 [US1] apps/backend/src/modules/auth/auth.service.tsで最初のユーザーを自動的に管理者として設定するロジックを実装

### ユーザー管理 (US1)

- [X] T069 [P] [US1] apps/backend/src/modules/users/users.module.tsでユーザーモジュールを作成
- [X] T070 [P] [US1] apps/backend/src/modules/users/users.controller.tsでユーザーコントローラー (GET /users, GET /users/:id) を作成
- [X] T071 [US1] apps/backend/src/modules/users/users.service.tsでユーザーサービス (CRUD操作、DynamoDB連携) を実装
- [X] T072 [US1] apps/backend/src/modules/users/entities/user.entity.tsでUserエンティティを実装
- [X] T073 [US1] apps/backend/src/modules/users/dto/create-user.dto.tsでCreateUserDTOを作成
- [X] T074 [P] [US1] apps/backend/src/modules/users/dto/update-user.dto.tsでUpdateUserDTOを作成
- [X] T075 [US1] apps/backend/src/modules/users/users.service.tsで監査フィールド (created_at, updated_at, created_by, updated_by) を全ユーザー操作に追加

### 従業員管理 (US1)

- [X] T076 [P] [US1] apps/backend/src/modules/employees/employees.module.tsで従業員モジュールを作成
- [X] T077 [P] [US1] apps/backend/src/modules/employees/employees.controller.tsで従業員コントローラー (GET /employees, GET /employees/:id) を作成
- [X] T078 [US1] apps/backend/src/modules/employees/employees.service.tsで従業員サービス (CRUD操作、社員番号生成、DynamoDB連携) を実装
- [X] T079 [US1] apps/backend/src/modules/employees/entities/employee.entity.tsでEmployeeエンティティを実装
- [X] T080 [US1] apps/backend/src/modules/employees/dto/create-employee.dto.tsでCreateEmployeeDTOを作成
- [X] T081 [P] [US1] apps/backend/src/modules/employees/dto/update-employee.dto.tsでUpdateEmployeeDTOを作成
- [X] T082 [US1] apps/backend/src/modules/employees/employees.service.tsで社員番号の自動生成ロジック (EMP001, EMP002...) を実装
- [X] T083 [US1] apps/backend/src/modules/employees/employees.service.tsで監査フィールド (created_at, updated_at, created_by, updated_by) を全従業員操作に追加

### 打刻管理 (US1)

- [X] T084 [P] [US1] apps/backend/src/modules/attendance/attendance.module.tsで打刻モジュールを作成
- [X] T085 [P] [US1] apps/backend/src/modules/attendance/attendance.controller.tsで打刻コントローラー (POST /attendance/check-in, POST /attendance/check-out, GET /attendance/clocks) を作成
- [X] T086 [US1] apps/backend/src/modules/attendance/attendance.service.tsで打刻サービス (出勤/退勤記録、データ取得、DynamoDB連携) を実装
- [X] T087 [US1] apps/backend/src/modules/attendance/entities/clock.entity.tsでClockエンティティを実装
- [X] T088 [US1] apps/backend/src/modules/attendance/dto/check-in.dto.tsでCheckInDTOを作成
- [X] T089 [P] [US1] apps/backend/src/modules/attendance/dto/check-out.dto.tsでCheckOutDTOを作成
- [X] T090 [P] [US1] apps/backend/src/modules/attendance/dto/query-clocks.dto.tsでQueryClocksDTOを作成
- [X] T091 [US1] apps/backend/src/modules/attendance/attendance.service.tsで監査フィールド (created_at, updated_at, created_by, updated_by) を全打刻操作に追加
- [X] T092 [US1] apps/backend/src/modules/attendance/attendance.controller.tsで管理者のみが全従業員の打刻データを閲覧できるようロールガードを適用

### フロントエンド - 認証UI (US1)

- [X] T093 [P] [US1] apps/frontend/src/pages/RegisterPage.tsxでユーザー登録ページを作成
- [X] T094 [P] [US1] apps/frontend/src/pages/LoginPage.tsxでログインページを作成
- [X] T095 [US1] apps/frontend/src/components/auth/RegisterForm.tsxで登録フォームコンポーネントを実装
- [X] T096 [P] [US1] apps/frontend/src/components/auth/LoginForm.tsxでログインフォームコンポーネントを実装
- [X] T097 [US1] apps/frontend/src/services/authService.tsで認証サービス (register, login, logout) を実装
- [X] T098 [US1] apps/frontend/src/hooks/useAuth.tsで認証状態管理フックを完成させる

### フロントエンド - 打刻UI (US1)

- [X] T099 [P] [US1] apps/frontend/src/pages/AttendancePage.tsxで打刻ページを作成
- [X] T100 [US1] apps/frontend/src/components/attendance/ClockInButton.tsxで出勤ボタンコンポーネントを実装
- [X] T101 [P] [US1] apps/frontend/src/components/attendance/ClockOutButton.tsxで退勤ボタンコンポーネントを実装
- [X] T102 [US1] apps/frontend/src/services/attendanceService.tsで打刻サービス (checkIn, checkOut) を実装
- [X] T103 [US1] apps/frontend/src/components/attendance/AttendanceStatus.tsxで現在の勤務状態表示コンポーネントを実装

### フロントエンド - 管理者UI (US1)

- [X] T104 [P] [US1] apps/frontend/src/pages/admin/UsersPage.tsxでユーザー管理ページを作成
- [X] T105 [P] [US1] apps/frontend/src/pages/admin/EmployeesPage.tsxで従業員管理ページを作成
- [X] T106 [P] [US1] apps/frontend/src/pages/admin/AttendanceManagementPage.tsxで打刻管理ページを作成
- [X] T107 [US1] apps/frontend/src/components/admin/UserList.tsxでユーザー一覧コンポーネントを実装
- [X] T108 [P] [US1] apps/frontend/src/components/admin/EmployeeList.tsxで従業員一覧コンポーネントを実装
- [X] T109 [P] [US1] apps/frontend/src/components/admin/ClockRecordsList.tsxで打刻記録一覧コンポーネントを実装
- [X] T110 [US1] apps/frontend/src/services/adminService.tsで管理者サービス (getUsers, getEmployees, getClocks) を実装
- [X] T111 [US1] apps/frontend/src/hooks/useAdmin.tsで管理者機能フックを実装

### フロントエンド - ルーティング & レイアウト (US1)

- [X] T112 [US1] apps/frontend/src/routes/index.tsxでReact Routerルーティング設定を作成
- [X] T113 [US1] apps/frontend/src/components/layout/Layout.tsxで共通レイアウトコンポーネントを実装
- [X] T114 [P] [US1] apps/frontend/src/components/layout/Header.tsxでヘッダーコンポーネント (ナビゲーション、ログアウト) を実装
- [X] T115 [P] [US1] apps/frontend/src/components/layout/Sidebar.tsxでサイドバーコンポーネント (管理者メニュー) を実装
- [X] T116 [US1] apps/frontend/src/components/common/PrivateRoute.tsxで認証済みルート保護コンポーネントを実装
- [X] T117 [P] [US1] apps/frontend/src/components/common/AdminRoute.tsxで管理者専用ルート保護コンポーネントを実装

### 統合 & 検証 (US1)

- [X] T118 [US1] apps/backend/でユーザー登録→ログイン→打刻フローをローカルで検証
- [X] T119 [US1] apps/frontend/でユーザー登録→ログイン→打刻→管理者閲覧フローをブラウザで検証
- [X] T120 [US1] 最初のユーザーが管理者権限を持つことを検証
- [X] T121 [US1] 社員番号の自動生成 (EMP001, EMP002...) を検証
- [X] T122 [US1] 監査フィールド (created_at, updated_at, created_by, updated_by) が全エンティティで記録されることを検証

**チェックポイント**: この時点で、ユーザーストーリー 1 は完全に機能し、独立してテスト可能であるべき

---

## Phase 4: ユーザーストーリー 2 - 製品サイト (優先度: P2)

**目標**: 製品の紹介情報を提供するウェブサイトを実装。静的サイトとして機能紹介、サポートページ、リリースノートを含む。

**独立テスト**: 製品サイトが正しく表示され、機能紹介、FAQ、ドキュメント、リリースノートにアクセスできることをブラウザでテスト可能。

### 製品紹介ページ (US2)

- [X] T123 [P] [US2] apps/website/src/pages/ProductPage.tsxで製品紹介ページを作成
- [X] T124 [US2] apps/website/src/components/product/Hero.tsxでヒーローセクションコンポーネントを実装
- [X] T125 [P] [US2] apps/website/src/components/product/Features.tsxで機能紹介セクションコンポーネントを実装
- [X] T126 [P] [US2] apps/website/src/components/product/Pricing.tsxで料金プランセクションコンポーネントを実装
- [X] T127 [P] [US2] apps/website/src/components/product/CallToAction.tsxでCTAセクションコンポーネントを実装

### サポートページ (US2)

- [X] T128 [P] [US2] apps/website/src/pages/SupportPage.tsxでサポートページを作成
- [X] T129 [US2] apps/website/src/components/support/FAQ.tsxでFAQコンポーネントを実装
- [X] T130 [P] [US2] apps/website/src/components/support/ContactForm.tsxで問い合わせフォームコンポーネントを実装
- [X] T131 [P] [US2] apps/website/src/components/support/Documentation.tsxでドキュメントセクションコンポーネントを実装

### リリースノートページ (US2)

- [X] T132 [P] [US2] apps/website/src/pages/ReleasesPage.tsxでリリースノートページを作成
- [X] T133 [US2] apps/website/src/components/releases/ReleaseList.tsxでリリース一覧コンポーネントを実装
- [X] T134 [P] [US2] apps/website/src/components/releases/ReleaseDetail.tsxでリリース詳細コンポーネントを実装
- [X] T135 [P] [US2] apps/website/public/data/releases.jsonでリリースノートデータファイルを作成

### ルーティング & レイアウト (US2)

- [X] T136 [US2] apps/website/src/routes/index.tsxでReact Routerルーティング設定を作成
- [X] T137 [US2] apps/website/src/components/layout/Layout.tsxで共通レイアウトコンポーネントを実装
- [X] T138 [P] [US2] apps/website/src/components/layout/Header.tsxでヘッダーコンポーネント (ナビゲーション) を実装
- [X] T139 [P] [US2] apps/website/src/components/layout/Footer.tsxでフッターコンポーネントを実装

### スタイリング (US2)

- [X] T140 [P] [US2] apps/website/src/styles/product.cssで製品ページ用スタイルを作成
- [X] T141 [P] [US2] apps/website/src/styles/support.cssでサポートページ用スタイルを作成
- [X] T142 [P] [US2] apps/website/src/styles/releases.cssでリリースノートページ用スタイルを作成

### 統合 & 検証 (US2)

- [X] T143 [US2] apps/website/で全ページがローカルで正しく表示されることを検証
- [X] T144 [US2] レスポンシブデザインが1280x1024px以上で動作することを検証
- [X] T145 [US2] プライマリカラー (#007CC0) が全コンポーネントで適用されていることを検証

**チェックポイント**: この時点で、ユーザーストーリー 1 と 2 の両方が独立して動作するべき

---

## Phase 5: ユーザーストーリー 3 - 多言語対応 (優先度: P3)

**目標**: 日本語と英語の両言語をサポート。全アプリケーション (業務アプリ、製品サイト) で言語切り替え機能を実装。

**独立テスト**: 言語切り替えボタンをクリックして、全ページが選択した言語で表示されることをブラウザでテスト可能。

### バックエンド多言語対応 (US3)

- [X] T146 [P] [US3] apps/backend/src/common/i18n/でi18n設定を作成 (エラーメッセージ用)
- [X] T147 [P] [US3] apps/backend/src/common/i18n/locales/ja.jsonで日本語翻訳ファイルを作成
- [X] T148 [P] [US3] apps/backend/src/common/i18n/locales/en.jsonで英語翻訳ファイルを作成
- [X] T149 [US3] apps/backend/src/common/interceptors/でi18nインターセプターを実装 (言語ヘッダー読み取り)
- [X] T150 [US3] 全エラーメッセージとバリデーションメッセージを多言語化

### フロントエンド多言語対応 (US3)

- [X] T151 [P] [US3] apps/frontend/src/locales/ja.jsonで日本語翻訳ファイルを作成 (全UI文字列)
- [X] T152 [P] [US3] apps/frontend/src/locales/en.jsonで英語翻訳ファイルを作成 (全UI文字列)
- [X] T153 [US3] apps/frontend/src/components/common/LanguageSwitcher.tsxで言語切り替えコンポーネントを実装
- [X] T154 [US3] apps/frontend/src/hooks/useLanguage.tsで言語管理フックを実装
- [X] T155 [US3] 全ページとコンポーネントでハードコードされた文字列をi18n翻訳キーに置き換え

### 製品サイト多言語対応 (US3)

- [X] T156 [P] [US3] apps/website/src/locales/ja.jsonで日本語翻訳ファイルを作成 (全コンテンツ)
- [X] T157 [P] [US3] apps/website/src/locales/en.jsonで英語翻訳ファイルを作成 (全コンテンツ)
- [X] T158 [US3] apps/website/src/components/common/LanguageSwitcher.tsxで言語切り替えコンポーネントを実装
- [X] T159 [US3] apps/website/src/hooks/useLanguage.tsで言語管理フックを実装
- [X] T160 [US3] 全ページとコンポーネントでハードコードされた文字列をi18n翻訳キーに置き換え

### 統合 & 検証 (US3)

- [X] T161 [US3] apps/frontend/で言語切り替えが全ページで動作することを検証
- [X] T162 [US3] apps/website/で言語切り替えが全ページで動作することを検証
- [X] T163 [US3] ブラウザ言語設定によるデフォルト言語選択を検証
- [X] T164 [US3] 言語設定がlocalStorageに保存され、ページリロード後も維持されることを検証

**チェックポイント**: 全てのユーザーストーリーが独立して機能するべき

---

## Phase 6: 仕上げ & 横断的関心事

**目的**: 複数のユーザーストーリーに影響する改善とデプロイ準備

### ドキュメント

- [X] T165 [P] docs/README.mdでプロジェクト全体のREADMEを作成
- [X] T166 [P] apps/backend/README.mdでバックエンドREADMEを作成
- [X] T167 [P] apps/frontend/README.mdでフロントエンドREADMEを作成
- [X] T168 [P] apps/website/README.mdで製品サイトREADMEを作成
- [X] T169 [P] docs/DEPLOYMENT.mdでデプロイガイドを作成
- [X] T170 [P] docs/API.mdでAPI仕様書を作成

### コード品質

- [X] T171 全コードベースでESLintエラーを修正
- [X] T172 全コードベースでPrettierフォーマットを適用
- [X] T173 [P] TypeScriptの型安全性を全モジュールで検証
- [X] T174 未使用のインポートとコードを削除
- [X] T175 コードコメントとTSDocを追加

### セキュリティ

- [X] T176 apps/backend/でパスワードハッシュ化 (bcrypt) の実装を検証
- [X] T177 apps/backend/でJWT署名秘密鍵が環境変数から読み込まれることを検証
- [X] T178 apps/backend/でCORS設定が正しく構成されていることを検証
- [X] T179 apps/backend/でレート制限ミドルウェアを追加
- [X] T180 npm auditでセキュリティ脆弱性をスキャン

### パフォーマンス

- [X] T181 apps/backend/でDynamoDBクエリの最適化 (GSI使用、ページネーション)
- [X] T182 apps/frontend/でReactコンポーネントのメモ化 (React.memo, useMemo, useCallback)
- [X] T183 apps/frontend/でコード分割とレイジーローディングを実装
- [X] T184 apps/website/で画像最適化とレイジーローディングを実装
- [X] T185 全アプリでバンドルサイズを分析し最適化

### デプロイ準備

- [X] T186 infrastructure/cdk/でCDKスタック構文を検証 (npx cdk synth)
- [X] T187 infrastructure/scripts/deploy-dev.shでdev環境へのデプロイを実行
- [X] T188 dev環境で全機能の動作を検証
- [X] T189 infrastructure/scripts/deploy-staging.shでstaging環境へのデプロイを実行
- [X] T190 staging環境で全機能の動作を検証

### quickstart.md検証

- [X] T191 quickstart.mdの手順に従ってローカル環境をゼロからセットアップ
- [X] T192 quickstart.mdに記載された全コマンドが動作することを検証
- [X] T193 quickstart.mdに不足している手順を追加

---

## 依存関係 & 実行順序

### フェーズ依存関係

- **セットアップ (Phase 1)**: 依存関係なし - すぐに開始可能
- **基盤 (Phase 2)**: セットアップ完了に依存 - 全てのユーザーストーリーをブロック
- **ユーザーストーリー (Phase 3-5)**: 全てが基盤フェーズ完了に依存
  - 人員があればユーザーストーリーを並行して進行可能
  - または優先順位順に順次進行 (P1 → P2 → P3)
- **仕上げ (Phase 6)**: 希望する全てのユーザーストーリー完了に依存

### ユーザーストーリー依存関係

- **ユーザーストーリー 1 (P1)**: 基盤 (Phase 2) 後に開始可能 - 他のストーリーに依存なし
- **ユーザーストーリー 2 (P2)**: 基盤 (Phase 2) 後に開始可能 - US1 と独立、並行実装可能
- **ユーザーストーリー 3 (P3)**: 基盤 (Phase 2) 後に開始可能 - US1/US2 のUIに依存するため、US1/US2 完了後を推奨

### 各ユーザーストーリー内

- モデル → サービス → コントローラー/エンドポイント → UI の順
- コア実装 → 統合の順
- 次の優先度に移る前にストーリーを完了

### 並行実行の機会

- [P] とマークされた全てのセットアップタスクを並行実行可能 (Phase 1)
- [P] とマークされた全ての基盤タスクを並行実行可能 (Phase 2)
- 基盤フェーズ完了後、US1 と US2 を並行して開始可能
- US3 は US1/US2 のコンポーネントに文字列追加するため、US1/US2 完了後を推奨
- ユーザーストーリー内の [P] タスクを並行実行可能
- Phase 6 の [P] タスクを並行実行可能

---

## 並行実行例: ユーザーストーリー 1

```bash
# ユーザーストーリー 1 の全てのモジュール作成を一緒に起動:
Task: "apps/backend/src/modules/auth/auth.module.tsで認証モジュールを作成"
Task: "apps/backend/src/modules/users/users.module.tsでユーザーモジュールを作成"
Task: "apps/backend/src/modules/employees/employees.module.tsで従業員モジュールを作成"
Task: "apps/backend/src/modules/attendance/attendance.module.tsで打刻モジュールを作成"

# ユーザーストーリー 1 の全てのDTOを一緒に起動:
Task: "apps/backend/src/modules/users/dto/create-user.dto.tsでCreateUserDTOを作成"
Task: "apps/backend/src/modules/users/dto/update-user.dto.tsでUpdateUserDTOを作成"
Task: "apps/backend/src/modules/attendance/dto/check-in.dto.tsでCheckInDTOを作成"
Task: "apps/backend/src/modules/attendance/dto/check-out.dto.tsでCheckOutDTOを作成"

# ユーザーストーリー 1 の全てのフロントエンドページを一緒に起動:
Task: "apps/frontend/src/pages/RegisterPage.tsxでユーザー登録ページを作成"
Task: "apps/frontend/src/pages/LoginPage.tsxでログインページを作成"
Task: "apps/frontend/src/pages/AttendancePage.tsxで打刻ページを作成"
```

---

## 実装戦略

### MVP 優先 (ユーザーストーリー 1 のみ)

1. Phase 1: セットアップを完了 (T001-T013)
2. Phase 2: 基盤を完了 (T014-T061) - **重要 - 全てのストーリーをブロック**
3. Phase 3: ユーザーストーリー 1 を完了 (T062-T122)
4. **停止して検証**: ユーザーストーリー 1 を独立してテスト
5. デプロイ/デモ - **これがMVP!**

### インクリメンタル配信

1. セットアップ + 基盤を完了 → 基盤準備完了
2. ユーザーストーリー 1 を追加 → 独立してテスト → デプロイ/デモ (MVP!)
3. ユーザーストーリー 2 を追加 → 独立してテスト → デプロイ/デモ
4. ユーザーストーリー 3 を追加 → 独立してテスト → デプロイ/デモ
5. Phase 6 (仕上げ) を完了 → 本番デプロイ

### 並行チーム戦略

複数の開発者で:

1. チームがセットアップ + 基盤を一緒に完了 (T001-T061)
2. 基盤完了後:
   - 開発者 A: ユーザーストーリー 1 バックエンド (T062-T092)
   - 開発者 B: ユーザーストーリー 1 フロントエンド (T093-T117)
   - 開発者 C: ユーザーストーリー 2 (T123-T145)
3. US1 と US2 が完了後:
   - 開発者 A/B/C: ユーザーストーリー 3 を分担 (T146-T164)
4. Phase 6 (仕上げ) を分担実行

---

## タスクサマリー

- **総タスク数**: 193タスク
- **Phase 1 (セットアップ)**: 13タスク
- **Phase 2 (基盤)**: 48タスク
- **Phase 3 (US1 - 打刻機能)**: 61タスク 🎯 MVP
- **Phase 4 (US2 - 製品サイト)**: 23タスク
- **Phase 5 (US3 - 多言語対応)**: 19タスク
- **Phase 6 (仕上げ)**: 29タスク

### 並行実行可能タスク

- Phase 1: 11タスク [P] マーク
- Phase 2: 34タスク [P] マーク
- Phase 3: 37タスク [P] マーク
- Phase 4: 16タスク [P] マーク
- Phase 5: 11タスク [P] マーク
- Phase 6: 15タスク [P] マーク

**合計 [P] タスク**: 124タスク (全体の64%)

### MVP 範囲

**推奨 MVP**: Phase 1 + Phase 2 + Phase 3 (ユーザーストーリー 1 のみ)
- タスク数: 122タスク
- 提供価値: ユーザー登録、認証、打刻機能、管理者機能
- 独立テスト可能: ✅
- デプロイ可能: ✅

---

## 注意事項

- [P] タスク = 異なるファイル、依存関係なし
- [Story] ラベルはトレーサビリティのために特定のユーザーストーリーにタスクをマッピング
- 各ユーザーストーリーは独立して完了可能・テスト可能であるべき
- 各タスクまたは論理グループ後にコミット
- ストーリーを独立して検証するために任意のチェックポイントで停止
- 避けるべきこと: 曖昧なタスク、同じファイルの競合、独立性を壊すクロスストーリー依存関係
- 全ての型定義は packages/shared/ で共有し、apps/ 間での重複を避ける
- 環境変数は .env ファイルで管理し、.env.example をテンプレートとして提供
- DynamoDB操作は packages/database/ のクライアントを使用し、直接 AWS SDK を各モジュールで呼び出さない
- 監査フィールド (created_at, updated_at, created_by, updated_by) は全エンティティで必須