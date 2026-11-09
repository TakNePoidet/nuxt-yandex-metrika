import { defineNuxtPlugin, useHead, useRouter, useRuntimeConfig } from '#app';

export default defineNuxtPlugin({
	name: 'yandex-metrika',
	parallel: true,
	async setup(nuxtApp) {
		// 1. Базовый конфиг из nuxt.config.ts
		const baseConfig = useRuntimeConfig().public.yandexMetrika as any;

		// 2. Даём хуку переопределить настройки (как vuetify:before-create)
		let finalConfig = { ...baseConfig };

		await nuxtApp.callHook('yandexMetrika:before-init', {
			options: finalConfig,
			setOptions(partial: any) {
				finalConfig = {
					...finalConfig,
					...partial,
					options: { ...finalConfig.options, ...partial.options }
				};
			}
		});

		const { id, enabled, debug, cdn, options = {}, verification, position = 'head' } = finalConfig;

		// 3. Если id не задан — выходим, ничего не вставляем
		if (!enabled || !id || id === 'xxx') {
			if (debug) {
				console.warn('[yandex-metrika] disabled or no id, skip');
			}
			return {
				provide: {
					yandexMetrika: {
						init: () => {},
						hit: () => {},
						reachGoal: () => {}
						// ... остальные методы no-op
					}
				}
			};
		}

		// 4. Вставляем скрипт tag.js
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
			useHead({ meta: [{ name: 'yandex-verification', content: verification }] });
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

		// 5. Загружаем tag.js (на клиенте)
		if (import.meta.client) {
			const src = cdn
				? 'https://cdn.jsdelivr.net/npm/yandex-metrica-watch/tag.js'
				: 'https://mc.yandex.ru/metrika/tag.js';

			await new Promise<void>((resolve) => {
				const existing = document.querySelector(`script[src="${src}"]`);
				if (existing) {
					resolve();
					return;
				}
				const script = document.createElement('script');
				script.src = src;
				script.async = true;
				script.onload = () => resolve();
				script.onerror = () => resolve(); // не блокируем приложение
				document.head.appendChild(script);
			});

			// 6. Инициализируем счётчик
			(window as any).ym(id, 'init', options);
		}

		// 7. Создаём api для приложения
		const api = {
			init: (opts: any = options) => (window as any).ym?.(id, 'init', opts),
			hit: (url: string, opts: any = {}) => (window as any).ym?.(id, 'hit', url, opts),
			reachGoal: (target: string, params?: any, cb?: any, ctx?: any) =>
				(window as any).ym?.(id, 'reachGoal', target, params, cb, ctx),
			params: (p: any) => (window as any).ym?.(id, 'params', p),
			userParams: (p: any) => (window as any).ym?.(id, 'userParams', p),
			setUserID: (uid: string) => (window as any).ym?.(id, 'setUserID', uid),
			notBounce: (opts: any) => (window as any).ym?.(id, 'notBounce', opts),
			extLink: (url: string, opts: any) => (window as any).ym?.(id, 'extLink', url, opts),
			file: (url: string, opts: any) => (window as any).ym?.(id, 'file', url, opts),
			firstPartyParams: (p: any) => (window as any).ym?.(id, 'firstPartyParams', p),
			firstPartyParamsHashed: (p: any) => (window as any).ym?.(id, 'firstPartyParamsHashed', p),
			getClientID: (cb: (id: number) => void) => (window as any).ym?.(id, 'getClientID', cb)
		};

		// 8. Хиты при навигации
		if (import.meta.client) {
			const router = useRouter();
			let pending: { url: string; referer: string } | null = null;

			router.afterEach((to, from, failure) => {
				if (failure || from.matched.length === 0 || to.fullPath === from.fullPath)
					return;
				if (pending)
					api.hit(pending.url, { referer: pending.referer, title: document.title });
				pending = { url: to.fullPath, referer: from.fullPath };
			});

			nuxtApp.hooks.hook('page:finish', () => {
				if (pending) {
					api.hit(pending.url, { referer: pending.referer, title: document.title });
					pending = null;
				}
			});
		}

		return {
			provide: {
				yandexMetrika: api
			}
		};
	}
});
