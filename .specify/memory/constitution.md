<!--
============================================================================
SYNC IMPACT REPORT
============================================================================
Constitution Amendment Report - Generated: 2025-12-22

Version Change: 1.0.0 → 1.1.0 (Japanese Language Priority amendment)

Modified Principles:
- NEW: VI. Japanese Language Priority

Added Sections:
- Core Principles (Principle VI added)

Removed Sections:
- None

Template Consistency Check:
✅ plan-template.md - Constitution Check section present and aligned
✅ spec-template.md - User story independence requirements aligned
✅ tasks-template.md - User story-based task organization aligned
✅ checklist-template.md - Template structure maintained in Japanese
✅ agent-file-template.md - References constitution structure
⚠️  Command prompt files - Generic, no constitution-specific references needed
⚠️  Templates translated to Japanese per new Principle VI

Follow-up TODOs:
- Constitution translated to Japanese per Principle VI ✅

Notes:
- Amendment adds Japanese language priority as core principle
- Constitution content translated to Japanese
- Follows amendment process with minor version increment
============================================================================
-->

# Speckit Constitution

## Core Principles

### I. Specification-First Development

すべての機能は、実装前に仕様書ドキュメント (`spec.md`) から開始しなければなりません：
- 仕様書には、Given-When-Then形式の受け入れ基準を含むユーザーシナリオを含めなければなりません
- 仕様書には、機能要件 (FR-XXX) と成功基準 (SC-XXX) を定義しなければなりません
- 仕様書は計画フェーズに進む前に承認されなければなりません
- 承認された仕様書なしにコード実装をしてはいけません

**根拠**: スコープクリープを防ぎ、共有理解を確保し、下流の成果物を駆動するテスト可能な要件を提供します。

### II. User Story Independence

ユーザーストーリーは独立して実装可能、テスト可能、配信可能でなければなりません：
- 各ユーザーストーリーには優先度 (P1, P2, P3...) を割り当てなければなりません
- 各ユーザーストーリーは他のストーリーに依存せずに完了可能でなければなりません
- 各ユーザーストーリーは独立した価値を提供しなければなりません
- タスクはユーザーストーリーごとに整理し、インクリメンタル配信を可能にしなければなりません

**根拠**: 並行開発、反復配信、明確な進捗追跡を可能にします。必要に応じてどのストーリーもMVPとして機能できます。

### III. Template-Driven Consistency

すべてのワークフロー成果物は `.specify/templates/` から標準化されたテンプレートを使用しなければなりません：
- 機能仕様は `spec-template.md` を使用
- 実装計画は `plan-template.md` を使用
- タスクリストは `tasks-template.md` を使用
- チェックリストは `checklist-template.md` を使用
- テンプレートは拡張可能ですが、必須セクションを削除してはいけません

**根拠**: 予測可能な構造を確保し、ツール自動化を可能にし、機能全体の認知負荷を軽減します。

### IV. Phase-Gate Discipline

開発は定義されたフェーズシーケンスと明示的なゲートに従わなければなりません：
- **Phase 0**: 仕様 (`/speckit.specify`) → GATE: 仕様承認
- **Phase 1**: 計画 (`/speckit.plan`) → GATE: 憲法チェック合格
- **Phase 2**: タスク生成 (`/speckit.tasks`) → GATE: 計画レビュー完了
- **Phase 3**: 実装 (`/speckit.implement`) → GATE: タスク定義完了
- 次のフェーズに進む前にゲートを通過しなければなりません
- フェーズ成果物は前のフェーズの出力を参照しなければなりません

**根拠**: 時期尚早な実装を防ぎ、適切な設計を確保し、開発ライフサイクル全体のトレーサビリティを維持します。

### V. Explicit Over Implicit

すべての要件、決定、制約は明示的に文書化されなければなりません：
- 未定義の要件には "NEEDS CLARIFICATION" マーカーを使用
- 決定が何であるかだけでなく、なぜその決定をしたかを文書化
- 複雑さ違反はComplexity Trackingセクションで正当化しなければなりません
- 要件の明確さのために RFC 2119 の MUST/SHOULD/MAY キーワードを使用
- "should probably" や "might need" のような曖昧な表現を避ける

**根拠**: 曖昧さを減らし、情報に基づいた意思決定を可能にし、将来のメンテナーのための明確な監査証跡を作成します。

### VI. Japanese Language Priority

すべてのAIエージェントのやり取り、プロンプト、テンプレート、ドキュメントは日本語で行わなければなりません：
- AIエージェントのコマンドと応答は日本語言語を排他的に使用しなければなりません
- AIエージェントに提供されるすべてのプロンプトは日本語で書かれなければなりません
- `.specify/templates/` のテンプレートは日本語で作成・維持されなければなりません
- ドキュメント成果物は日本語で生成・レビューされなければなりません
- 例外は憲法チェックで明示的な正当化がある場合のみ許可されます

**根拠**: コミュニケーションの一貫性を確保し、プロジェクトのローカライズ目標に沿い、AI支援開発活動のすべての主要運用言語として日本語を義務付けます。

## Workflow Phases

すべての機能で以下のフェーズ構造が必須です：

1. **Specify** (`/speckit.specify`): ユーザーストーリー、要件、成功基準を含む `spec.md` を作成
2. **Plan** (`/speckit.plan`): `plan.md`、`research.md`、`data-model.md`、`quickstart.md`、`contracts/` を生成
3. **Tasks** (`/speckit.tasks`): ユーザーストーリーごとに整理された明示的な依存関係を持つ `tasks.md` を生成
4. **Implement** (`/speckit.implement`): 憲法準拠の優先順位でタスクを実行

コマンドは実行前に前のフェーズの前提条件を検証しなければなりません。

## Quality Standards

### Documentation Requirements

- ユーザーストーリーには独立したテスト説明を含めなければなりません
- 実装計画は憲法チェック結果を文書化しなければなりません
- タスクリストは正確なファイルパスを説明に含めなければなりません
- すべてのテンプレートはプレースホルダーセクションの必須アクションコメントを含めなければなりません
- クイックスタートガイドはステップバイステップの検証手順を提供しなければなりません

### Testing Requirements (When Requested)

- テストは仕様で明示的に要求されない限りオプションです
- テストが要求された場合: 実装前にテストを書かなければなりません
- テストタスクには "⚠️" 警告をマークしなければなりません
- コントラクトテストはすべての定義されたAPIエンドポイントをカバーしなければなりません
- 統合テストは重要なユーザー体験をカバーしなければなりません

## Governance

この憲法はspeckitの他のすべての開発プラクティスとガイドラインに優先します。

### Amendment Process

1. 修正はセマンティックバージョニングに従って `CONSTITUTION_VERSION` をインクリメントしなければなりません：
   - **MAJOR**: 原則やガバナンスの破壊的変更 (例: 原則の削除)
   - **MINOR**: 新しい原則や重要な拡張 (例: 追加された原則)
   - **PATCH**: 明確化、表現の改善、タイポ修正
2. 修正は `LAST_AMENDED_DATE` を修正日に更新しなければなりません
3. 修正はファイル上部にHTMLコメントとしてSync Impact Reportを含めなければなりません
4. 修正はすべてのテンプレートの整合性レビューをトリガーしなければなりません

### Compliance

- 生成されたすべての計画はゲート検証を含む憲法チェックセクションを含めなければなりません
- 複雑さ違反は考慮された代替案とともに明示的に正当化されなければなりません
- テンプレート変更をマージする前に憲法整合性を検証しなければなりません
- この憲法はspeckitの開発ガバナンスとワークフロー要件を定義します

**Version**: 1.1.0 | **Ratified**: 2025-12-22 | **Last Amended**: 2025-12-22


