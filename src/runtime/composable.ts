import type { YandexMetrikaModuleOptions } from '../types';
import type { YandexMetrikaApi } from '../yandex-metrika';
import { useRuntimeConfig } from '#app';

import { useHead, useScriptTriggerIdleTimeout } from '#imports';
import { useRegistryScript } from '#nuxt-scripts/utils';
import { metrika } from '../yandex-metrika';
import { YandexMetrikaSchemeOptions } from './scheme';

export function useYandexMetrikaScript<T extends YandexMetrikaApi>() {
	return useRegistryScript<T, typeof YandexMetrikaSchemeOptions>(
		'yandex-metrika',
		(config) => {
			const { id, cdn, delay, debug, verification, options = {} } = config;
			const api = metrika(id, debug);
			if (import.meta.dev) {
				useHead({
					script: [
						{
							innerHTML:
								'window.ym=window.ym||function(){(window.ym.a=window.ym.a||[]).push(arguments)};window.ym.l=(new Date).getTime();'
						}
					]
				});
			} else {
				useHead({
					noscript: [
						{
							innerHTML: `<div><img src="https://mc.yandex.ru/watch/${id}" style="position:absolute; left:-9999px;" alt="" />`
						}
					]
				});
			}

			if (verification) {
				useHead({
					meta: [{ name: 'yandex-verification', content: verification }]
				});
			}

			return {
				scriptInput: {
					src: cdn ? 'https://cdn.jsdelivr.net/npm/yandex-metrica-watch/tag.js' : 'https://mc.yandex.ru/metrika/tag.js'
				},
				schema: YandexMetrikaSchemeOptions,
				scriptOptions: {
					key: 'yandex-metrika',
					bundle: false,
					tagDuplicateStrategy: 'replace',
					trigger: delay ? useScriptTriggerIdleTimeout({ timeout: delay }) : undefined,
					use() {
						return api;
					}
				},
				clientInit: import.meta.server
					? undefined
					: () => {
							api.init(options);
						}
			};
		},
		useRuntimeConfig().public.yandexMetrika as YandexMetrikaModuleOptions
	);
}

export function useYandexMetrika() {
	return useYandexMetrikaScript().proxy as YandexMetrikaApi;
}
