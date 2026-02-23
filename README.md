# エビデンスベースド・エンジニアリング（仮）

## 概要

一次情報・検索・仕様読解・検証・根拠の残し方・AI利用ガードレールなど、根拠ベースの進め方を扱う。

## オンライン版（公開URL）

- GitHub Pages: `https://itdojp.github.io/evidence-based-engineering-book/`（想定）
- 入口: `docs/index.md`

## 開発（ローカル）

### 前提

- Node.js（`npm`）
- （推奨）Podman または Docker（Ruby が無い環境でも `npm start` / `npm run build` を実行可能）
- Ruby + Bundler（導入済みの場合はそれを利用）

### 手順

```bash
npm install

# Ruby/Bundler が無い場合は Podman/Docker を利用します（初回は image pull + bundle install が走ります）

# プレビュー
npm start

# ビルド
npm run build

# テスト（markdown lint / link check）
npm test
```

## ライセンス

本書は **CC BY-NC-SA 4.0** で提供します。詳細は `LICENSE.md` を参照してください。
