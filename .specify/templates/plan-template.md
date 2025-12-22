# 実装計画: [FEATURE]

**ブランチ**: `[###-feature-name]` | **日付**: [DATE] | **仕様**: [link]
**入力**: `/specs/[###-feature-name]/spec.md` からの機能仕様

**注意**: このテンプレートは `/speckit.plan` コマンドによって入力されます。実行ワークフローについては `.specify/templates/commands/plan.md` を参照してください。

## 概要

[機能仕様から抽出: 主な要件 + 調査からの技術的アプローチ]

## 技術的文脈

<!--
  必須アクション: このセクションの内容をプロジェクトの技術的詳細に置き換えてください。
  構造は反復プロセスをガイドするための参考として提示されています。
-->

**言語/バージョン**: [例: Python 3.11, Swift 5.9, Rust 1.75 または 要明確化]  
**主要依存関係**: [例: FastAPI, UIKit, LLVM または 要明確化]  
**ストレージ**: [該当する場合、例: PostgreSQL, CoreData, files または N/A]  
**テスト**: [例: pytest, XCTest, cargo test または 要明確化]  
**対象プラットフォーム**: [例: Linux server, iOS 15+, WASM または 要明確化]
**プロジェクトタイプ**: [single/web/mobile - ソース構造を決定]  
**パフォーマンス目標**: [ドメイン固有、例: 1000 req/s, 10k lines/sec, 60 fps または 要明確化]  
**制約**: [ドメイン固有、例: <200ms p95, <100MB memory, offline-capable または 要明確化]  
**規模/範囲**: [ドメイン固有、例: 10k users, 1M LOC, 50 screens または 要明確化]

## 憲法チェック

*ゲート: Phase 0 調査前に合格する必要あり。Phase 1 設計後に再確認。*

[憲法ファイルに基づいて決定されるゲート]

## プロジェクト構造

### ドキュメント (この機能)

```text
specs/[###-feature]/
├── plan.md              # このファイル (/speckit.plan コマンド出力)
├── research.md          # Phase 0 出力 (/speckit.plan コマンド)
├── data-model.md        # Phase 1 出力 (/speckit.plan コマンド)
├── quickstart.md        # Phase 1 出力 (/speckit.plan コマンド)
├── contracts/           # Phase 1 出力 (/speckit.plan コマンド)
└── tasks.md             # Phase 2 出力 (/speckit.tasks コマンド - /speckit.plan では作成されません)
```

### ソースコード (リポジトリルート)
<!--
  必須アクション: 下記のプレースホルダーツリーをこの機能の具体的なレイアウトに置き換えてください。
  未使用のオプションを削除し、選択した構造を実際のパスで展開してください
  (例: apps/admin, packages/something)。提供される計画にはOptionラベルを含めないでください。
-->

```text
# [未使用の場合削除] オプション1: 単一プロジェクト (デフォルト)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [未使用の場合削除] オプション2: Webアプリケーション (「frontend」+「backend」が検出された場合)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [未使用の場合削除] オプション3: Mobile + API (「iOS/Android」が検出された場合)
api/
└── [backendと同じ]

ios/ または android/
└── [プラットフォーム固有構造: feature modules, UI flows, platform tests]
```

**構造決定**: [選択した構造を文書化し、上記で取得した実際のディレクトリを参照]

## 複雑さ追跡

> **憲法チェックに違反がある場合のみ入力**

| 違反 | 必要理由 | 却下された単純な代替案の理由 |
|------|----------|-----------------------------|
| [例: 4番目のプロジェクト] | [現在の必要性] | [3つのプロジェクトが不十分な理由] |
| [例: Repositoryパターン] | [具体的な問題] | [直接DBアクセスが不十分な理由] |
