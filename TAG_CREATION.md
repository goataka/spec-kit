# Qiita Tag Creation

## Summary
このドキュメントは、mainブランチを元に「qiita」というタグを作成するための手順を説明します。

## 現状
- mainブランチの最新コミット: `3f97437778200c975f7a668093a57381627f040e` ("fix spec")
- ローカルでタグ「qiita」は作成済みです
- リモートへのプッシュには認証が必要です

## 次のステップ
リポジトリの管理者権限を持つユーザーが以下のコマンドを実行してください：

```bash
# リポジトリをクローン（既にクローン済みの場合はスキップ）
git clone https://github.com/goataka/speckit.git
cd speckit

# mainブランチの最新を取得
git fetch origin main

# qiitaタグを作成（mainブランチの最新コミットを指定）
git tag qiita 3f97437778200c975f7a668093a57381627f040e

# タグをリモートにプッシュ
git push origin qiita
```

## 確認方法
タグが正しく作成されたことを確認するには：

```bash
# タグが存在することを確認
git tag -l qiita

# タグが指しているコミットを確認
git show qiita --no-patch
```

または、GitHubのWebインターフェースで確認：
https://github.com/goataka/speckit/tags

## 代替方法：GitHub Web UIを使用
1. https://github.com/goataka/speckit/releases/new にアクセス
2. "Choose a tag" で新しいタグ名 "qiita" を入力
3. Target を "main" ブランチに設定
4. 必要に応じてリリースノートを追加
5. "Publish release" をクリック
