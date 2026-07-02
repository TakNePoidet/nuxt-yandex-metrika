import type { YandexMetrikaApi } from './types';
import { consola } from 'consola';
import { Methods } from './types';

export * from './types';

type MethodName = (typeof Methods)[keyof typeof Methods];

export function metrika(id: string, debug: boolean = false, enabled: boolean = true): YandexMetrikaApi {
	const api = {} as Record<MethodName, (...args: unknown[]) => void>;

	for (const method of Object.values(Methods)) {
		api[method] = (...args: unknown[]) => {
			if (debug) {
				consola.info(`[yandex-metrika] ${method}`, ...args);
			}
			if (enabled) {
				window.ym(id, method, ...args);
			}
		};
	}

	return api as YandexMetrikaApi;
}
