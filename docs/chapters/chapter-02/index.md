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

- 検索クエリの記録（付録: [調査ログテンプレ](../../appendices/templates/research-log/)）
- 採用した情報源と採用理由（一次情報優先）

## 本文

検索は「答えを探す」作業ではなく、「検証すべき候補（一次情報への導線）を集める」作業として扱う。検索結果そのものを根拠として採用しない。

### 手順（最小）

1. 目的と対象バージョン（可能なら最小再現環境）を先に固定する
2. 固有名詞/エラーメッセージ/用語を核に、クエリを組み立てる
3. 一般検索で一次情報（公式/仕様/リリースノート）に寄せる（`site:` とバージョン固定）
4. GitHub 検索で実装/Issue/PR に寄せる（`repo:` `path:` 等）
5. 採用したクエリ・採用しなかったクエリも調査ログに残す（再検索性を担保する）

### クエリ設計の観点

- 固有名詞（ライブラリ名/機能名）
- エラーメッセージ（完全一致）
- 除外条件（例: `-windows` `-site:stackoverflow.com`）
- site指定（例: `site:github.com` `site:docs.example.com`）
- version指定（例: `"v2.3"` `">=1.10"` `"2025"`）

除外条件はノイズ低減に有効だが、有用情報も落ちる。一次情報への導線が十分にある場合に限定して使う。

### 検索先の違い（一般検索 / GitHub検索）

同じ見た目のクエリでも、検索先によって「有効な検索演算子」「ヒットする対象」が異なる。クエリ例には「適用先（一般検索/GitHub検索）」を明示する。

- Google 検索: 完全一致の `"..."`、除外の `-keyword`、サイト指定の `site:` は
  [Google 検索ヘルプ「ウェブ検索の結果を絞り込む」](https://support.google.com/websearch/answer/2466433?co=GENIE.Platform%3DDesktop&hl=ja&rd=1)
  で確認する。演算子と検索語の間には空白を入れない。
- Bing 検索: `site:` は
  [Microsoft Support「Advanced search keywords」](https://support.microsoft.com/en-US/bing/advanced-search-keywords)、
  完全一致の `"..."`、除外の `-keyword`、論理和の `OR` は
  [Microsoft Support「Advanced search options」](https://support.microsoft.com/en-US/bing/advanced-search-options)
  で確認する。`OR` と `NOT` は大文字で記述し、`site:` のコロンの後には空白を入れない。
- GitHub コード検索: `repo:` `path:` `language:` `symbol:` は
  [GitHub Docs「Understanding GitHub Code Search syntax」](https://docs.github.com/en/search-github/github-code-search/understanding-github-code-search-syntax)
  で確認する。
- GitHub Issue/PR 検索: `repo:` `is:issue` `is:pr` は
  [GitHub Docs「Filtering and searching issues and pull requests」](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/filtering-and-searching-issues-and-pull-requests)
  で確認する。コード検索の構文資料とは参照先が異なる。

注意: 上記は 2026-07-21 JST に確認した情報である。検索演算子の仕様や提供地域は変更される可能性があるため、利用時点の各提供者の公式ドキュメントを正本とする。

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
次善策（一般検索/Bing）: site:github.com libraryX "timeout" "default" (issue OR pull)
結果: 公式ドキュメント + 該当コミット + 再現ログまで到達し、前提/例外をメモした
```

## チェックリスト

- [ ] エラーメッセージや用語をクエリに含めた
- [ ] 除外条件/サイト指定でノイズを減らした
- [ ] 英語検索を併用した
- [ ] 採用前に対象バージョンと前提を確認した

## まとめ

- クエリは「用語/エラー/除外/サイト指定/バージョン固定」を組み合わせて設計する
- 検索結果は仮説候補として扱い、一次情報と対象バージョンで裏取りする

## 次章への接続

- 次章: [第3章](../chapter-03/)
