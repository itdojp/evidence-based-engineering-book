---
title: "仕様読解メモテンプレ"
layout: book
order: 902
---

# 仕様読解メモテンプレ

## Source（参照URL/版/日付）

- タイトル:
- URL（通常）:
- Permalink（固定URL）:
- 参照日:
- 対象バージョン（またはコミット/リリース）:
- 該当箇所（節/見出し）:

## 前提

- 対象バージョン:
- 対象範囲:

## 用語

- （記入）

## 例外

- （記入）

## 互換性

- （記入）

## 未解決事項

- （記入）

## 記入例（抜粋）

- Source: LibraryX Docs（v2.3）/ "Timeout" 節 / 参照日 YYYY-MM-DD
- 前提: v2.3 以降に適用、HTTP client 部分のみ
- 用語: "Timeout" は接続確立+読み取りの合計上限
- 例外: DNS失敗時は即時にエラー、リトライは最大3回
- 互換性: v1系の `TIMEOUT` 設定キーは廃止、v2系は `CLIENT_TIMEOUT` に統一
