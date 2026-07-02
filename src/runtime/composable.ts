import type { YandexMetrikaModuleOptions } from '../types';
import type { YandexMetrikaApi } from './yandex-metrika';
import { useNuxtApp, useRuntimeConfig } from '#app';

import { useHead, useScriptTriggerIdleTimeout } from '#imports';
import { useRegistryScript } from '#nuxt-scripts/utils';
import { YandexMetrikaSchemeOptions } from './scheme';
import { metrika } from './yandex-metrika';

function _useYandexMetrikaScript() {
	return useRegistryScript<YandexMetrikaApi, typeof YandexMetrikaSchemeOptions>(
		'yandex-metrika',
		(config) => {
			const { id, cdn, delay, debug, enabled = true, verification, options = {}, position = 'head' } = config;
			const api = metrika(id, debug, enabled);

			if (enabled) {
				useHead({
					script: [
						{
							tagPosition: position,
							innerHTML:
								'window.ym=window.ym||function(){(window.ym.a=window.ym.a||[]).push(arguments)};window.ym.l=Date.now();'
						}
					],
					...(verification && {
						meta: [{ name: 'yandex-verification', content: verification }]
					}),
					...(!import.meta.dev && {
						noscript: [
							{
								innerHTML: `<div><img src="https://mc.yandex.ru/watch/${id}" style="position:absolute; left:-9999px;" alt=""></div>`,
								tagPosition: position
							}
						]
					})
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
					tagPosition: position,
					trigger: enabled ? (delay ? useScriptTriggerIdleTimeout({ timeout: delay }) : undefined) : 'manual',
					use() {
						return api;
					}
				},
				async clientInit() {
					if (enabled) {
						api.init(options);
					}
				}
			};
		},
		useRuntimeConfig().public.yandexMetrika as YandexMetrikaModuleOptions
	);
}

type YandexMetrikaScript = ReturnType<typeof _useYandexMetrikaScript>;

export function useYandexMetrikaScript(): YandexMetrikaScript {
	const nuxtApp = useNuxtApp() as ReturnType<typeof useNuxtApp> & { _yandexMetrikaScript?: YandexMetrikaScript };

	nuxtApp._yandexMetrikaScript ??= _useYandexMetrikaScript();
	return nuxtApp._yandexMetrikaScript;
}

export function useYandexMetrika(): YandexMetrikaApi {
	return useYandexMetrikaScript().proxy as YandexMetrikaApi;
}
