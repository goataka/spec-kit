# ファイル階層構造 (File Hierarchy)

このドキュメントは、spec-kitリポジトリのファイル階層構造を説明します。

## ディレクトリ構造 (Directory Structure)

```
spec-kit/
├── .github/                    # GitHub関連の設定とエージェント定義
│   ├── agents/                # カスタムエージェント定義ファイル
│   │   ├── speckit.analyze.agent.md
│   │   ├── speckit.checklist.agent.md
│   │   ├── speckit.clarify.agent.md
│   │   ├── speckit.constitution.agent.md
│   │   ├── speckit.implement.agent.md
│   │   ├── speckit.plan.agent.md
│   │   ├── speckit.specify.agent.md
│   │   ├── speckit.tasks.agent.md
│   │   └── speckit.taskstoissues.agent.md
│   └── prompts/               # エージェント用プロンプト定義
│       ├── speckit.analyze.prompt.md
│       ├── speckit.checklist.prompt.md
│       ├── speckit.clarify.prompt.md
│       ├── speckit.constitution.prompt.md
│       ├── speckit.implement.prompt.md
│       ├── speckit.plan.prompt.md
│       ├── speckit.specify.prompt.md
│       ├── speckit.tasks.prompt.md
│       └── speckit.taskstoissues.prompt.md
├── .specify/                  # Spec Kit設定とツール
│   ├── config/               # 設定ファイル
│   │   └── language.yaml     # 言語設定
│   ├── memory/               # プロジェクトメモリ
│   │   └── constitution.md   # プロジェクト憲章
│   ├── scripts/              # 自動化スクリプト
│   │   └── bash/
│   │       ├── check-prerequisites.sh    # 前提条件チェック
│   │       ├── common.sh                 # 共通関数
│   │       ├── create-new-feature.sh     # 新機能作成
│   │       ├── setup-plan.sh             # プラン設定
│   │       └── update-agent-context.sh   # エージェントコンテキスト更新
│   └── templates/            # テンプレートファイル
│       ├── agent-file-template.md
│       ├── checklist-template.md
│       ├── plan-template.md
│       ├── spec-template.md
│       └── tasks-template.md
├── .vscode/                   # VS Code設定
│   └── settings.json
├── specs/                     # 仕様ドキュメント
│   └── 20251222-114347794740791/  # タイムスタンプ付き仕様ディレクトリ
│       ├── contracts/         # API契約定義
│       │   └── api-contracts.md
│       ├── data-model.md      # データモデル定義
│       ├── plan.md            # 実装計画
│       ├── quickstart.md      # クイックスタートガイド
│       ├── research.md        # 調査資料
│       ├── spec.md            # 機能仕様
│       └── tasks.md           # タスク一覧
├── LICENSE                    # ライセンスファイル
└── README.md                  # プロジェクト概要
```

## 主要ディレクトリの説明

### .github/
GitHub関連の設定ファイルとカスタムエージェント定義を格納しています。

- **agents/**: Spec Kit用のカスタムエージェント定義ファイル（9種類）
  - `speckit.analyze`: 仕様の一貫性・品質分析
  - `speckit.checklist`: カスタムチェックリスト生成
  - `speckit.clarify`: 仕様の不明瞭な部分の明確化
  - `speckit.constitution`: プロジェクト憲章の作成・更新
  - `speckit.implement`: 実装計画の実行
  - `speckit.plan`: 実装計画ワークフローの実行
  - `speckit.specify`: 機能仕様の作成・更新
  - `speckit.tasks`: タスク一覧の生成
  - `speckit.taskstoissues`: タスクをGitHub Issuesに変換

- **prompts/**: 各エージェントに対応するプロンプト定義ファイル

### .specify/
Spec Kitの設定、スクリプト、テンプレートを格納しています。

- **config/**: プロジェクト設定ファイル
  - `language.yaml`: 言語設定（日本語・英語対応）

- **memory/**: プロジェクトの記憶・コンテキスト情報
  - `constitution.md`: プロジェクトの原則や方針

- **scripts/bash/**: 自動化スクリプト
  - `check-prerequisites.sh`: 必要なツールの確認
  - `common.sh`: 共通関数定義
  - `create-new-feature.sh`: 新機能の仕様作成
  - `setup-plan.sh`: 計画段階のセットアップ
  - `update-agent-context.sh`: エージェントのコンテキスト更新

- **templates/**: 各種ドキュメントのテンプレート
  - `agent-file-template.md`: エージェントファイルのテンプレート
  - `checklist-template.md`: チェックリストのテンプレート
  - `plan-template.md`: 計画書のテンプレート
  - `spec-template.md`: 仕様書のテンプレート
  - `tasks-template.md`: タスク一覧のテンプレート

### .vscode/
Visual Studio Code用の設定ファイルを格納しています。

### specs/
機能仕様ドキュメントを格納しています。各機能はタイムスタンプ付きのディレクトリで管理されます。

各仕様ディレクトリには以下のファイルが含まれます：
- **contracts/**: API契約定義
- **data-model.md**: データモデルの定義
- **plan.md**: 実装計画
- **quickstart.md**: クイックスタートガイド
- **research.md**: 技術調査・検討資料
- **spec.md**: 機能仕様書
- **tasks.md**: 実装タスク一覧

## ファイル数

- **ディレクトリ数**: 14
- **ファイル数**: 40（.gitディレクトリを除く）

## 更新日時

このドキュメントは 2025-12-22 に作成されました。
