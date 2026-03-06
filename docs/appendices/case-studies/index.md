---
title: "ケーススタディ"
layout: book
order: 906
---

# ケーススタディ

初学者は「どの順で何を埋めればよいか」で迷いやすい。本付録では、章を横断する通し例を1本示す。

注意: 本節の `libraryX` と URL は例示（ダミー）。実在の製品/組織に合わせて読み替えること。

## ケーススタディ1: タイムアウトのデフォルト値を特定し、安全に設定変更する

### 背景

- 現象: 外部 API 呼び出しがタイムアウトする（時間帯により頻発）
- 目的: デフォルト値と変更方法を一次情報で確定し、変更の影響を検証して結論を出す

### 成果物（テンプレを埋めた例）

- [調査ログテンプレ](../templates/research-log/)（記入例）
- [仕様読解メモテンプレ](../templates/spec-reading-notes/)（記入例）
- [再現ログテンプレ](../templates/repro-log/)（記入例）
- [検証計画テンプレ](../templates/verification-plan/)（記入例）

以下は「テンプレを実際に埋めた形」の抜粋である（秘密情報は `[REDACTED]`）。

## 調査ログ（記入例）

### 目的

- libraryX（v2.3 系）の HTTP クライアントのデフォルトタイムアウト値（10 秒/30 秒など）を確定する
- 変更方法（設定キー、適用範囲、例外条件）を一次情報で特定する

### 仮説

- 仮説A: デフォルトは 30 秒（過去記事で見た）
- 仮説B: v2 系で仕様が変わり、デフォルトは 10 秒（公式ドキュメントの断片がある）

### 検証（調査の手順）

- 検索（一般検索）:
  - `site:docs.example.com libraryX timeout default v2.3`
  - `site:github.com org/libraryX release v2.3 timeout`
- 検索（GitHub検索）:
  - `repo:org/libraryX path:src timeout default`
  - `repo:org/libraryX is:issue timeout default v2.3`
- 仕様/実装/Issue の一次情報から「設定キー」「デフォルト値」「適用範囲」「例外」を抜く

### 結果

- デフォルトは 10 秒（v2.3）。設定キーは `CLIENT_TIMEOUT`（例）で変更可能
- v1 系の記事の `TIMEOUT` は廃止（v2.3 では無効）

### 根拠（引用/リンク）

#### 出典

- タイトル: LibraryX Documentation / Timeout
- URL（通常）: <https://docs.example.com/libraryx/timeout>
- Permalink（固定URL）: <https://docs.example.com/libraryx/timeout?version=v2.3>
- 参照日: YYYY-MM-DD
- 対象バージョン: v2.3

#### 該当箇所

- 節/見出し: Timeout / Defaults
- ファイル/関数/行: `src/client/timeout.ts` / `DEFAULT_TIMEOUT_SECONDS`（例）

#### 要約

- デフォルトは 10 秒。`CLIENT_TIMEOUT` で変更可能。接続確立前と確立後で扱いが異なる（例外条件があるため、適用範囲を確認する）

#### 結論

- 本番のピーク時間帯のみ `CLIENT_TIMEOUT=30s` を適用（段階リリース + 監視強化）。根拠は上記一次情報と再現ログ

## 仕様読解メモ（記入例）

### Source（参照URL/版/日付）

- タイトル: LibraryX Documentation / Timeout
- URL（通常）: <https://docs.example.com/libraryx/timeout>
- Permalink（固定URL）: <https://docs.example.com/libraryx/timeout?version=v2.3>
- 参照日: YYYY-MM-DD
- 対象バージョン: v2.3
- 該当箇所（節/見出し）: Timeout / Defaults, Configuration

### 前提

- 対象バージョン: v2.3.x
- 対象範囲: HTTP クライアント（外部 API 呼び出し）

### 用語

- Timeout: 接続確立+読み取りの合計上限（例）
- Retry: エラー時の再試行（最大3回、指数バックオフ）

### 例外

- DNS失敗時は即時エラー（タイムアウトではない）
- タイムアウト到達時は `TimeoutError`（例）として扱われる

### 互換性

- v1系の `TIMEOUT` は廃止され、v2系は `CLIENT_TIMEOUT` に統一（例）

### 未解決事項

- streaming API の場合、読み取りの扱いが別節にある（要確認）

## 再現ログ（記入例）

### Source（参照URL/版/日付）

- タイトル: LibraryX Documentation / Timeout
- URL（通常）: <https://docs.example.com/libraryx/timeout>
- Permalink（固定URL）: <https://docs.example.com/libraryx/timeout?version=v2.3>
- 参照日: YYYY-MM-DD
- 対象バージョン: v2.3.1

### 環境

- OS/ランタイム: Ubuntu 24.04 / Runtime 1.2.3
- 依存バージョン: libraryX v2.3.1
- 設定/フラグ: デフォルト（未指定）

### 再現手順

1. 遅延 10 秒のダミー HTTP サーバを起動する
2. libraryX のクライアントで 1 リクエスト送る（リトライ無効）
3. タイムアウト未指定で実行する

### 期待結果

- デフォルト値に到達した時点で失敗する（エラー種別と経過時間が記録される）

### 実測結果（証跡）

```text
start request x-request-id=2f3a8d1c-...
error=TimeoutError elapsed=10.02s
```

### 否定結果（試したが違ったこと）

- `TIMEOUT=30s`（環境変数）を設定しても挙動が変わらない（v2.3では無効）
- 該当記事は v1 系の手順だったため、採用しない（根拠に残す）

## 検証計画（記入例）

### Source（参照URL/版/日付）

- タイトル: LibraryX Documentation / Timeout
- URL（通常）: <https://docs.example.com/libraryx/timeout>
- Permalink（固定URL）: <https://docs.example.com/libraryx/timeout?version=v2.3>
- 参照日: YYYY-MM-DD
- 対象バージョン: v2.3.1

### 環境

- OS/ランタイム: Ubuntu 24.04 / Runtime 1.2.3
- バージョン: libraryX v2.3.1

### 最小構成

- 遅延するダミー HTTP サーバ + クライアント 1 リクエスト（並列/リトライは無効）

### 手順

1. `CLIENT_TIMEOUT` 未指定で実行し、経過時間/例外/ログを記録する
2. `CLIENT_TIMEOUT=30s` を設定して再実行し、差分を比較する
3. 並列・リトライを有効にした場合の副作用（待ち行列、外部 API 負荷）を確認する

### 期待結果

- 未指定: 約 10 秒で失敗
- 指定後: 30 秒まで待機し、失敗タイミングが変わる（または成功する）

### 観測点

- ログ: `x-request-id`、例外種別、経過時間
- メトリクス: 外部 API の成功率、p95 レイテンシ、エラー率

### ロールバック

- 変更は環境変数/機能フラグで切替し、即時に元へ戻せるようにする
- 適用範囲は段階リリース（特定環境→一部トラフィック→全体）とする

## 関連（次に読むと良い）

- issue-driven-work-book（Issue/PR/ADRの型）: <https://itdojp.github.io/issue-driven-work-book/>
- engineering-documentation-book（手順書/Runbook/障害報告）: <https://itdojp.github.io/engineering-documentation-book/>
- incident-response-basics-book（インシデント運用の型）: <https://itdojp.github.io/incident-response-basics-book/>
- security-privacy-literacy-book（証跡/マスキング/隔離）: <https://itdojp.github.io/security-privacy-literacy-book/>
