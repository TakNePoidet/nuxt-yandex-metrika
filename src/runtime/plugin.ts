import { defineNuxtPlugin, useRouter, useRuntimeConfig } from '#app';
import { useHead } from '#imports';

import { type YandexMetrikaModuleOptions } from '../types';
import { Methods, YandexMetrika } from './yandex-metrika';

export default defineNuxtPlugin({
	parallel: true,
	setup() {
		const config = useRuntimeConfig().public.yandexMetrika as YandexMetrikaModuleOptions;
		const { id, cdn = false, delay = 0, debug, verification = null, options = {} } = config;

		if (import.meta.dev) {
			useHead({
				script: [
					{
						key: 'yandex-metrika-ym',
						innerHTML: `window.ym=window.ym||function(){(window.ym.a=window.ym.a||[]).push(arguments)};window.ym.l=(new Date).getTime();`
					},
					{
						key: 'yandex-metrika-init',
						innerHTML: `ym("${id}","${Methods.Init}", ${JSON.stringify(options)});`
					}
				]
			});
		} else {
			useHead({
				noscript: [
					{
						key: 'yandex-metrika-noscript',
						innerHTML: `<div><img src="https://mc.yandex.ru/watch/${id}" style="position:absolute; left:-9999px;" alt="" />`
					}
				]
			});

			if (delay && delay > 0) {
				if (import.meta.client) {
					setTimeout(() => {
						const script = document.createElement('script');
						script.defer = true;
						script.src = YandexMetrika.src(cdn);
						document.head.append(script);
					}, delay);
				}
			} else {
				useHead({
					script: [
						{
							key: 'yandex-metrika',
							innerHTML: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)}; m[i].l=1*new Date(); for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }} k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)}) (window, document, "script", "${YandexMetrika.src(
								cdn
							)}", "ym");`
						}
					]
				});
			}
		}

		const yandexMetrika = new YandexMetrika(id);
		yandexMetrika.debug = debug;
		yandexMetrika.verification = verification;

		if (import.meta.client) {
			let ready = false;
			const router = useRouter();

			void router.isReady().then(() => {
				ready = true;
			});

			router.afterEach((to, from) => {
				if (!ready) {
					return;
				}
				yandexMetrika.hit(to.fullPath, {
					referer: from.fullPath
				});
			});
		}
		return {
			provide: {
				yandexMetrika: new Proxy(yandexMetrika, {
					get(target, name) {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-expect-error
						if (typeof target[name] === 'function') {
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-expect-error
							return target[name].bind(target);
						}
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-expect-error
						return target[name];
					}
				})
			}
		};
	}
});
