import chalk from "chalk";
import {
	Events,
	HitOptions,
	InitParameters,
	Methods,
	People,
	UserParameters,
	VisitParameters,
} from "./types";

export * from "./types";

export class YandexMetrika implements Events {
	readonly #id: string;
	#debug: boolean = false;
	#verification: string = null;

	static src(cdn = false) {
		return cdn
			? "https://cdn.jsdelivr.net/npm/yandex-metrica-watch/tag.js"
			: "https://mc.yandex.ru/metrika/tag.js";
	}

	constructor(id: string) {
		this.#id = id;
	}

	get debug() {
		return this.#debug;
	}

	set debug(value: boolean) {
		this.#debug = value;
	}
	get verification() {
		return this.#verification;
	}

	set verification(value: string | null) {
		this.#verification = value;
	}

	get id() {
		return this.#id;
	}

	init(options: InitParameters = {}) {
		this.#call(Methods.Init, ...arguments);
	}

	addFileExtension(extensions?: string | string[]) {
		this.#call(Methods.AddFileExtension, ...arguments);
	}

	extLink<CTX>(url: string, options: Omit<HitOptions<CTX>, "referer"> = {}) {
		this.#call(Methods.ExtLink, ...arguments);
	}

	file<CTX>(url: string, options?: HitOptions<CTX>) {
		this.#call(Methods.File, ...arguments);
	}

	firstPartyParams(people: People) {
		this.#call(Methods.FirstPartyParams, ...arguments);
	}

	firstPartyParamsHashed(people: People) {
		this.#call(Methods.FirstPartyParamsHashed, ...arguments);
	}

	getClientID(cb: (clientID: number) => void) {
		this.#call(Methods.GetClientID, ...arguments);
	}

	hit<CTX>(url = "", options?: HitOptions<CTX>) {
		this.#call(Methods.Hit, ...arguments);
	}

	notBounce<CTX>(options: Pick<HitOptions<CTX>, "ctx" | "callback"> = {}) {
		this.#call(Methods.NotBounce, ...arguments);
	}

	params(params: VisitParameters = {}) {
		this.#call(Methods.Params, ...arguments);
	}

	reachGoal<CTX>(
		target: string,
		params: VisitParameters,
		callback?: (this: CTX) => void,
		ctx?: CTX,
	): void {
		this.#call(Methods.ReachGoal, ...arguments);
	}

	setUserID(userId: string) {
		this.#call(Methods.SetUserID, ...arguments);
	}

	userParams(params: UserParameters = {}) {
		this.#call(Methods.UserParams, ...arguments);
	}

	#call(type: Methods, ...args: unknown[]) {
		if (this.#debug) {
			console.debug(
				`${chalk.bgGreen(chalk.black("[yandex - metrika]"))} ${chalk.blue(
					type,
				)}`,
				...args,
			);
		}

		if (typeof window !== "undefined") {
			console.log(window.ym);
			window.ym(this.id, type, ...args);
		}
	}
}
