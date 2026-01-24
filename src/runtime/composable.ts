import type { YandexMetrikaModuleOptions } from '../types';
import type { YandexMetrikaApi } from './yandex-metrika';
import { useRuntimeConfig } from '#app';

import { useHead, useScriptTriggerIdleTimeout } from '#imports';
import { useRegistryScript } from '#nuxt-scripts/utils';
import { createSharedComposable } from '@vueuse/core';
import { YandexMetrikaSchemeOptions } from './scheme';
import { metrika } from './yandex-metrika';

function _useYandexMetrikaScript<T extends YandexMetrikaApi>() {
	return useRegistryScript<T, typeof YandexMetrikaSchemeOptions>(
		'yandex-metrika',
		(config) => {
			const { id, cdn, delay, debug, verification, options = {}, position = 'head' } = config;
			const api = metrika(id, debug);
			useHead({
				script: [
					{
						tagPosition: position,
						innerHTML:
							'window.ym=window.ym||function(){(window.ym.a=window.ym.a||[]).push(arguments)};window.ym.l=(new Date).getTime();'
					}
				]
			});

			if (verification) {
				useHead({
					meta: [{ name: 'yandex-verification', content: verification }]
				});
			}

			if (!import.meta.dev) {
				useHead({
					noscript: [
						{
							innerHTML: `<div><img src="https://mc.yandex.ru/watch/${id}" style="position:absolute; left:-9999px;" alt=""></div>`,
							tagPosition: position
						}
					]
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
					trigger: delay ? useScriptTriggerIdleTimeout({ timeout: delay }) : undefined,
					use() {
						return api;
					}
				},
				async clientInit() {
					api.init(options);
				}
			};
		},
		useRuntimeConfig().public.yandexMetrika as YandexMetrikaModuleOptions
	);
}

export const useYandexMetrikaScript = createSharedComposable(_useYandexMetrikaScript);

function _useYandexMetrika() {
	return useYandexMetrikaScript().proxy as YandexMetrikaApi;
}

export const useYandexMetrika = createSharedComposable(_useYandexMetrika);
