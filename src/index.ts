// DO クラスを re-export
export { CounterDurableObject } from "./counter_do";
export { MyDurableObject } from "./my_do";

// ヘルパー関数: テキストプレーンのレスポンスを生成
function textPlainResponse(value: string | number, status = 200): Response {
	const body = String(value);
	const contentLength = new TextEncoder().encode(body).length.toString();

	return new Response(body, {
		status,
		headers: {
			"content-type": "text/plain; charset=utf-8",
			"content-length": contentLength,
		},
	});
}

/**
 * Welcome to Cloudflare Workers! This is your first Durable Objects application.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your Durable Object in action
 * - Run `npm run deploy` to publish your application
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/durable-objects
 */

export default {
	/**
	 * This is the standard fetch handler for a Cloudflare Worker
	 *
	 * @param request - The request submitted to the Worker from the client
	 * @param env - The interface to reference bindings declared in wrangler.jsonc
	 * @param ctx - The execution context of the Worker
	 * @returns The response to be sent back to the client
	 */
	async fetch(request, env, _ctx): Promise<Response> {
		const url = new URL(request.url);
		const COUNTER_NAME = "bar";

		switch (url.pathname) {
			case "/message":
				const stub = env.MY_DURABLE_OBJECT.getByName("foo");
				const greeting = await stub.sayHello("world");
				return textPlainResponse(greeting);
			case "/increment": {
				const stub = env.COUNTER_DURABLE_OBJECT.getByName(COUNTER_NAME);
				const value = await stub.increment();
				return textPlainResponse(value);
			}
			case "/value": {
				const stub = env.COUNTER_DURABLE_OBJECT.getByName(COUNTER_NAME);
				const value = await stub.getValue();
				return textPlainResponse(value);
			}
			case "/reset": {
				const stub = env.COUNTER_DURABLE_OBJECT.getByName(COUNTER_NAME);
				const value = await stub.reset();
				return textPlainResponse(value);
			}
			default:
				return textPlainResponse("Not Found", 404);
		}
	},
} satisfies ExportedHandler<Env>;
