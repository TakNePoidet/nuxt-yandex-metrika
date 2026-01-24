/* eslint-disable unused-imports/no-unused-vars, prefer-rest-params */
import type { ValueOf } from '@prleasing/utility';
import type { HitOptions, InitParameters, People, UserParameters, VisitParameters, YandexMetrikaApi } from './types';
import { consola } from 'consola';
import { Methods } from './types';

export * from './types';

export function metrika(id: string, debug: boolean = false): YandexMetrikaApi {
	function call(type: ValueOf<typeof Methods>, ...args: unknown[]) {
		if (debug) {
			consola.info(`[yandex-metrika] ${type}`, ...args);
		}
		window.ym(id, type, ...args);
	}

	return {
		init(options: Partial<InitParameters> = {}) {
			call(Methods.Init, ...arguments);
		},

		addFileExtension(extensions?: string | string[]) {
			call(Methods.AddFileExtension, ...arguments);
		},

		extLink<CTX>(url: string, options: Omit<HitOptions<CTX>, 'referer'> = {}) {
			call(Methods.ExtLink, ...arguments);
		},

		file<CTX>(url: string, options?: HitOptions<CTX>) {
			call(Methods.File, ...arguments);
		},

		firstPartyParams(people: People) {
			call(Methods.FirstPartyParams, ...arguments);
		},

		firstPartyParamsHashed(people: People) {
			call(Methods.FirstPartyParamsHashed, ...arguments);
		},

		getClientID(cb: (clientID: number) => void) {
			call(Methods.GetClientID, ...arguments);
		},

		hit<CTX>(url = '', options?: HitOptions<CTX>) {
			call(Methods.Hit, ...arguments);
		},

		notBounce<CTX>(options: Pick<HitOptions<CTX>, 'ctx' | 'callback'> = {}) {
			call(Methods.NotBounce, ...arguments);
		},

		params(params: VisitParameters = {}) {
			call(Methods.Params, ...arguments);
		},

		reachGoal<CTX>(target: string, params: VisitParameters, callback?: (this: CTX) => void, ctx?: CTX): void {
			call(Methods.ReachGoal, ...arguments);
		},

		setUserID(userId: string) {
			call(Methods.SetUserID, ...arguments);
		},

		userParams(params: UserParameters = {}) {
			call(Methods.UserParams, ...arguments);
		}
	};
}
