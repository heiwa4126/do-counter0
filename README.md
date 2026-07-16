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

そこそこできたら

```sh
pnpm run login
pnpm run deploy
```

## 重要: プレビューURL

> Preview URLs are not generated for Workers that use Durable Objects.  
> (Durable Objects を使用しているWorkerではプレビューURLが生成されません)

<https://developers.cloudflare.com/changelog/post/2025-07-23-workers-preview-urls/#limitations-while-in-beta>

なので、このプロジェクトは 2 本立てに変える予定。
