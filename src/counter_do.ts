import { DurableObject } from "cloudflare:workers";

type CounterEnv = Env & {
	COUNTER_KV: KVNamespace;
};

/** A Durable Object's behavior is defined in an exported Javascript class */
export class CounterDurableObject extends DurableObject {
	private static readonly COUNTER_KEY = "counter:bar";
	private readonly appEnv: CounterEnv;
	private readonly ready: Promise<void>;
	private count = 0;

	/**
	 * The constructor is invoked once upon creation of the Durable Object, i.e. the first call to
	 * 	`DurableObjectStub::get` for a given identifier (no-op constructors can be omitted)
	 *
	 * @param ctx - The interface for interacting with Durable Object state
	 * @param env - The interface to reference bindings declared in wrangler.jsonc
	 */
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		this.appEnv = env as CounterEnv;
		this.ready = this.ctx.blockConcurrencyWhile(async () => {
			this.count = await this.readCountFromKv();
		});
	}

	async getValue(): Promise<number> {
		await this.ready;
		return this.count;
	}

	async increment(step = 1): Promise<number> {
		await this.ready;
		const next = this.count + step;
		if (next !== this.count) {
			this.count = next;
			await this.writeCountToKv(next);
		}
		return next;
	}

	async decrement(step = 1): Promise<number> {
		await this.ready;
		const next = this.count - step;
		if (next !== this.count) {
			this.count = next;
			await this.writeCountToKv(next);
		}
		return next;
	}

	async reset(): Promise<number> {
		await this.ready;
		if (this.count !== 0) {
			this.count = 0;
			await this.writeCountToKv(0);
		}
		return 0;
	}

	private async readCountFromKv(): Promise<number> {
		const stored = await this.appEnv.COUNTER_KV.get(CounterDurableObject.COUNTER_KEY);
		if (stored === null) {
			return 0;
		}

		const parsed = Number.parseInt(stored, 10);
		return Number.isNaN(parsed) ? 0 : parsed;
	}

	private async writeCountToKv(value: number): Promise<void> {
		await this.appEnv.COUNTER_KV.put(CounterDurableObject.COUNTER_KEY, String(value));
	}
}
