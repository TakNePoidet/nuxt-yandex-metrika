import {
	defineNuxtPlugin,
	useHead,
	useRouter,
	useRuntimeConfig,
} from "#imports";
import { type YandexMetrikaModuleOptions } from "../types";
import { Methods, YandexMetrika } from "./yandex-metrika";

export default defineNuxtPlugin({
	parallel: true,
	setup() {
		const config = useRuntimeConfig().public
			.yandexMetrika as YandexMetrikaModuleOptions;
		const {
			id,
			cdn = false,
			delay = 0,
			debug,
			verification = null,
			options = {},
		} = config;

		if (!debug) {
			useHead({
				noscript: [
					{
						innerHTML: `<div><img src="https://mc.yandex.ru/watch/${id}" style="position:absolute; left:-9999px;" alt="" />`,
					},
				],
			});
		}

		if (debug || delay) {
			useHead({
				script: [
					{
						innerHTML: `window.ym=window.ym||function(){(window.ym.a=window.ym.a||[]).push(arguments)};window.ym.l=(new Date).getTime();`,
					},
					{
						innerHTML: `ym("${id}","${Methods.Init}", ${JSON.stringify(
							options,
						)});`,
					},
				],
			});
		} else {
			useHead({
				script: [
					{
						innerHTML: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)}; m[i].l=1*new Date(); for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }} k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)}) (window, document, "script", "${YandexMetrika.src(
							cdn,
						)}", "ym");`,
					},
				],
			});
		}
		if (!debug && delay && process.client) {
			setTimeout(() => {
				const script = document.createElement('script')
				script.defer = true
				script.src = YandexMetrika.src(cdn)
				document.head.append(script)
			}, delay);
		}

		const yandexMetrika = new YandexMetrika(id);
		yandexMetrika.debug = debug;
		yandexMetrika.verification = verification;

		if (process.client) {
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
					referer: from.fullPath,
				});
			});
		}
		return {
			provide: {
				yandexMetrika: new Proxy(yandexMetrika, {
					get(target, name) {
						if (typeof target[name] === "function") {
							return target[name].bind(target);
						}
						return target[name];
					},
				}),
			},
		};
	},
});
