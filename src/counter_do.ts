import { DurableObject } from "cloudflare:workers";

/** A Durable Object's behavior is defined in an exported Javascript class */
export class CounterDurableObject extends DurableObject {
	private static readonly COUNTER_KEY = "counter";
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
		this.ctx.blockConcurrencyWhile(async () => {
			this.count = await this.readCountFromStorage();
		});
	}

	async getValue(): Promise<number> {
		return this.count;
	}

	async increment(step = 1): Promise<number> {
		const next = this.count + step;
		this.count = next;
		await this.writeCountToStorage(next);
		return next;
	}

	async decrement(step = 1): Promise<number> {
		const next = this.count - step;
		this.count = next;
		await this.writeCountToStorage(next);
		return next;
	}

	async reset(): Promise<number> {
		this.count = 0;
		await this.writeCountToStorage(0);
		return 0;
	}

	private async readCountFromStorage(): Promise<number> {
		const stored = await this.ctx.storage.get<number>(CounterDurableObject.COUNTER_KEY);
		if (stored === undefined) {
			return 0;
		}
		return stored;
	}

	private async writeCountToStorage(value: number): Promise<void> {
		await this.ctx.storage.put(CounterDurableObject.COUNTER_KEY, value);
	}
}
