import type { HookResult } from '@nuxt/schema';
import type { YandexMetrikaModuleOptions } from '../types';

declare module '#app' {
	interface RuntimeNuxtHooks {
		'yandexMetrika:before-init': (payload: {
			options: YandexMetrikaModuleOptions;
			setOptions: (options: Partial<YandexMetrikaModuleOptions>) => void;
		}) => HookResult;
	}
}
