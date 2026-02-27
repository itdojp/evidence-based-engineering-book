---
title: "第2章：検索戦略（クエリ設計、英語、フィルタ）"
layout: book
order: 20
---

# 第2章：検索戦略（クエリ設計、英語、フィルタ）

## この章で学ぶこと

- クエリを“入力”として設計する（用語/エラーメッセージ/除外条件）
- 日本語→英語への切替で一次情報に近づく
- 検索結果を“仮説の候補”として扱う

## 成果物（または判断基準）

- 検索クエリの記録（調査ログに残す）
- 採用した情報源と採用理由（一次情報優先）

## 本文

検索は“答えを探す”作業ではなく、“検証すべき候補を集める”作業として扱う。

### クエリ設計の観点

- 固有名詞（ライブラリ名/機能名）
- エラーメッセージ（完全一致）
- 除外条件（例: `-windows` `-site:stackoverflow.com`）
- site指定（例: `site:github.com` `site:docs.example.com`）
- version指定（例: `"v2.3"` `">=1.10"` `"2025"`）

除外条件はノイズ低減に有効だが、有用情報も落ちる。一次情報の導線がある場合に限定して使う。

### 検索先の違い（一般検索 / GitHub検索）

同じ見た目のクエリでも、検索先によって「有効な検索演算子」「ヒットする対象」が異なる。クエリ例には「適用先（一般検索/GitHub検索）」を明示する。

- 一般検索（Google/Bing など）: `site:` `-keyword` `OR` `""` などが有効
- GitHub検索（Code/Issue/PR）: `repo:` `path:` `language:` `symbol:` `is:issue` などが有効

### 検索先 × 目的（対応表）

|目的|推奨の検索先|クエリ雛形（例）|
|---|---|---|
|公式ドキュメントの該当節を探す|一般検索 + 公式サイト内検索|`site:docs.example.com <keyword> <version>`|
|標準/RFCで用語の定義を確認する|一般検索|`site:rfc-editor.org <term> RFC`|
|実装のデフォルト値/定数/設定キーを探す|GitHubコード検索|`repo:<org>/<repo> path:<dir> <keyword>`|
|既知バグ/制約/回避策を探す|GitHub Issue/PR検索|`repo:<org>/<repo> is:issue <keyword>`|
|互換性破壊/変更点を探す|リリースノート（一般検索）|`site:github.com <org>/<repo> release <version>`|

### クエリの型（例）

- [一般検索] 日本語→英語: 日本語の用語を英語に置き換える（一次情報に近づきやすい）
- [GitHub検索] 実装へ寄せる: `repo:<org>/<repo> path:<dir> <symbol>` / `repo:<org>/<repo> <keyword>`
- [一般検索] 仕様/標準へ寄せる: `site:rfc-editor.org` / `site:ietf.org` / `spec` / `standard`
- [共通] バージョン固定: `"<keyword>" "<version>"`（「いつの挙動か」を揃える）
- [一般検索] 除外でノイズ低減: `-tutorial` `-blog` `-windows`（前提が違う記事を外す）

### 一次情報に辿り着けない時の次善策

- 公式 Issue/PR（メンテナの判断と前提が残る）
- リリースノート/変更履歴（互換性破壊や既知の制約が書かれやすい）
- 実装（ソースコード）とテスト（期待動作が明文化されやすい）
- 標準（RFC/仕様）やベンダー公式ドキュメント（用語の定義がある）

検索結果を採用する場合は、対象バージョン・前提・例外の記載を確認する。

## 具体例（悪い例→良い例）

### 悪い例

```md
検索語: "動かない"
結果: 上位のQiita記事をそのまま採用
```

### 良い例

```md
検索語（日本語→英語）: "接続が切れる" → "ECONNRESET" "connection reset"
絞り込み（前提固定）: libraryX "v2.3" -windows
一次情報へ（一般検索）: site:docs.example.com timeout / site:github.com libraryX timeout default
一次情報へ（GitHub検索）: repo:org/libraryX path:src timeout default
次善策（一般検索）: site:github.com libraryX "timeout" "default" (issue OR pull)
結果: 公式docs + 該当コミット + 再現ログまで到達し、前提/例外をメモした
```

## チェックリスト

- [ ] エラーメッセージや用語をクエリに含めた
- [ ] 除外条件/サイト指定でノイズを減らした
- [ ] 英語検索を併用した
- [ ] 採用前に対象バージョンと前提を確認した

## まとめ

- 一次情報・検証・記録をセットで運用し、再現性を担保する
- “分かったつもり”を減らすため、前提と例外を明文化する

## 次章への接続

- 次章: [第3章](../chapter-03/)
