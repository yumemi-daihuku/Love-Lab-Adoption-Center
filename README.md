# 愛でラボ里親センター

「ゆっくり」をモチーフにしたファンメイド里親募集サイトです。Firebase Realtime Database を使ったプレーンな HTML/CSS/JavaScript（ビルド不要）で作られており、GitHub Pages にそのまま公開できます。

- 一覧・検索・絞り込み（`index.html`）
- 個体紹介ページ（`detail.html`）
- 里親申し込みフォーム（`apply.html`）
- サイト説明・申し込み手順・お問い合わせ（`about.html` / `guide.html` / `contact.html`）
- 運営者ページ（`admin.html`）：データ投入・一覧管理・申込確認

## ディレクトリ構成

```
.
├── index.html
├── detail.html
├── apply.html
├── about.html
├── guide.html
├── contact.html
├── admin.html
├── css/
│   └── style.css
├── js/
│   ├── firebase-init.js   # Firebase設定・初期化
│   ├── app.js             # マスコットSVG生成・お気に入り機能・共通処理
│   └── data.js            # サンプル紹介データ
└── README.md
```

ビルドツールは使っていません。すべて相対パスで参照しているので、リポジトリ直下に置けばそのまま動作します。

## GitHub Pages への公開手順

1. このフォルダの中身をリポジトリのルート（またはお好みのブランチ）にコミット・プッシュします。

   ```bash
   git init
   git add .
   git commit -m "Initial commit: 愛でラボ里親センター"
   git branch -M main
   git remote add origin https://github.com/<ユーザー名>/<リポジトリ名>.git
   git push -u origin main
   ```

2. GitHubのリポジトリページで **Settings → Pages** を開きます。
3. **Source** を `Deploy from a branch` にし、ブランチを `main`、フォルダを `/ (root)` に設定して保存します。
4. 数分待つと `https://<ユーザー名>.github.io/<リポジトリ名>/` で公開されます。

> リポジトリ名にサブディレクトリが含まれる場合（プロジェクトページ運用）でも、本サイトはすべて相対パス（`css/...`, `js/...`）で参照しているため追加の設定は不要です。

## Firebase の設定について

`js/firebase-init.js` に記載されている `firebaseConfig`（apiKey 等）は、Firebaseの仕組み上**公開されても問題ない値**です（Webアプリ用の識別子であり、秘密鍵ではありません）。ただし、この値だけではアクセス制御はできないため、**Realtime Database のセキュリティルールで書き込み・読み取りを制御する**必要があります。

現在はテストモード（誰でも読み書き可能）になっているとのことなので、公開前に少なくとも以下のような設定に変更することを推奨します。

```json
{
  "rules": {
    "yukkuris": {
      ".read": true,
      ".write": false
    },
    "applications": {
      ".read": false,
      ".write": true
    },
    "inquiries": {
      ".read": false,
      ".write": true
    }
  }
}
```

- `yukkuris`（プロフィール一覧）：誰でも閲覧できるが、書き込みは管理者のみに制限したい場合は Firebase Authentication を導入し、ルールを `auth != null` 等に変更してください。
- `applications` / `inquiries`（申し込み・問い合わせ）：一般公開ページから送信（書き込み）はできても、閲覧（読み取り）はできないようにするのが安全です。`admin.html` から一覧を見る場合は、認証を追加した上で管理者にのみ読み取りを許可する形に変更してください。

`admin.html` は現状ログイン機能を持たないページです。公開リポジトリに含めると誰でもデータの追加・削除ができてしまうため、以下のいずれかの対応を検討してください。

- `.gitignore` で `admin.html` を除外し、ローカルでのみ使用する
- Firebase Authentication を実装してログイン必須にする
- GitHub Pages とは別の非公開環境で運用する

## ローカルでの動作確認

`type="module"` の `<script>` を使用しているため、`file://` で直接開くとブラウザにブロックされます。簡易サーバーを立てて確認してください。

```bash
# Python3 がある場合
python3 -m http.server 8000

# Node.js がある場合
npx serve .
```

その後 `http://localhost:8000` にアクセスします。

## サンプルデータの投入

1. `admin.html` を開きます。
2. 「サンプルデータを投入する」ボタンを押すと、`js/data.js` に定義された8件の紹介データが Realtime Database の `/yukkuris` に追加されます。
3. `index.html` で一覧表示・検索・絞り込みを確認できます。

## 免責事項

本サイトは二次創作キャラクター「ゆっくり」をテーマにしたファンメイドの架空コンテンツです。実在の動物保護団体・里親制度・サービスとは一切関係ありません。
