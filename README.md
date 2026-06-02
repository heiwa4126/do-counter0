# do-counter0

Cloudflare Durable Objects を使った
"アクセスカウンタ" みたいなもの。

- DO と普通 workers のセット
- 永続化は SQL でも KV でもなく [DurableObjectState::storage](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/#access-storage) を使っている(小規模だから)
- とりあえず HTML と、ちょっとの JS+CSS つきで、すぐ試せる (API にするとき消す)

## 開発 & デプロイ

```sh
pnpm i
pnpm dev
```

これで <http://localhost:8787> で動作確認。

コード構成を変更したら
```sh
pnpm run cf-typegen
```
で `worker-configuration.d.ts` を作り直すのを忘れないこと。

そこそこできたら

```sh
pnpm run deploy
```

認可は自分は TOKEN を使ってますが `pnpm exec wrangler login` でもいいです。
