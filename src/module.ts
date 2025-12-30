import type { YandexMetrikaModuleOptions } from './types';
import { addImports, addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit';
import { defu } from 'defu';

export default defineNuxtModule<YandexMetrikaModuleOptions>({
	meta: {
		name: 'nuxt-yandex-metrika',
		configKey: 'yandexMetrika',
		compatibility: {
			nuxt: '>=4.0.0'
		}
	},
	moduleDependencies() {
		return {
			'@nuxt/scripts': {}
		};
	},
	defaults: {
		id: 'xxx',
		debug: import.meta.env.NODE_ENV !== 'production',
		delay: 0,
		cdn: false,
		verification: null,
		options: {
			accurateTrackBounce: true,
			childIframe: true,
			clickmap: true,
			ecommerce: false,
			trackHash: false,
			trackLinks: true,
			webvisor: false,
			triggerEvent: false,
			sendTitle: true
		}
	},
	async setup(options, nuxt) {
		nuxt.options.runtimeConfig.public.yandexMetrika = defu(
			nuxt.options.runtimeConfig.public.yandexMetrika ?? {},
			options,
			{
				id: 'xxx',
				debug: import.meta.env.NODE_ENV !== 'production',
				delay: 0,
				cdn: false,
				verification: null,
				options: {
					accurateTrackBounce: true,
					childIframe: true,
					clickmap: true,
					defer: false,
					ecommerce: false,
					trackHash: false,
					trackLinks: true,
					webvisor: false,
					triggerEvent: false,
					sendTitle: true
				}
			}
		);
		const resolver = createResolver(import.meta.url);
		addPlugin({
			mode: 'all',
			src: resolver.resolve('./runtime/plugin')
		});

		addImports({
			name: 'useYandexMetrika',
			as: 'useYandexMetrika',
			from: resolver.resolve('runtime/composable')
		});
	}
});
