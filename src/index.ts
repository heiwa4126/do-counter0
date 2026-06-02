// DO クラスを re-export
export { CounterDurableObject } from "./counter_do";

type CounterWorkerEnv = Env & {
	COUNTER_DURABLE_OBJECT: DurableObjectNamespace<import("./counter_do").CounterDurableObject>;
};

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
	async fetch(request, env: CounterWorkerEnv, _ctx): Promise<Response> {
		const url = new URL(request.url);

		switch (url.pathname) {
			case "/message":
				const stub = env.COUNTER_DURABLE_OBJECT.getByName("bar");
				const nextCount = await stub.increment();
				return new Response(`Counter 'bar' count: ${nextCount}`);
			case "/value": {
				const stub = env.COUNTER_DURABLE_OBJECT.getByName("bar");
				const value = await stub.getValue();
				return Response.json({ value });
			}
			case "/reset": {
				const stub = env.COUNTER_DURABLE_OBJECT.getByName("bar");
				const value = await stub.reset();
				return Response.json({ value });
			}
			default:
				return new Response("Not Found", { status: 404 });
		}
	},
} satisfies ExportedHandler<Env>;
