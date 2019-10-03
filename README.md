# アドリブ紙芝居

ニコニコ新市場ゲーム「アドリブ紙芝居」のソースコードです。

アドリブ紙芝居は Akashic Engine を使って書かれています。
Akashic Engine については下記ページを参照してください。

* https://akashic-games.github.io/

## はじめに

リポジトリを clone して、 `adlib-kamishibai` ディレクトリに移動してください。

```
git clone https://github.com/yoshikyoto/adlib-kamishibai.git
cd adlib-kamishibai
```

clone したら下記のコマンドを実行してください

```
npm install
```

この作業は初回のみ必要です。

## 動作確認する

下記コマンドを実行してください。

```
npm run sandbox
```

`please access to http://localhost:3000/game/ by web-browser` と言われるはずなので、 http://localhost:3000/game/ にアクセスしてください。

終了する場合は `Control + c` を押してください。

## 紙芝居を差し替える

`image/paper[1 - 4].jpg` が各紙芝居のページです。
この画像を差し替えることで紙芝居を差し替えることができます。

画像サイズは 640x360である必要があります。

画像を差し替えて動作確認してみてください。

## リリースする

以下のコマンドを実行します。

```sh
npm run build
```

`dist.dip` というファイルが作成されます。
これをRPGアツマールに投稿します。

下記Akashicのドキュメントも参照してください。

* https://akashic-games.github.io/guide/export-atsumaru.html


## ディレクトリ構造など

|ディレクトリ名|説明|
|:--|:--|
|sound_source|aacやoggに変換する前の音声データ|
|introduction_image|アツマールに投稿する際に必要になるゲーム画面|
|stories|派生作品の紙芝居画像たち|
|icon.png|RPGアツマールに投稿する時のアイコンです|
