import { addComponentsDir, addImports, addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit';
import { defu } from 'defu';
import type { YandexMetrikaModuleOptions } from './types';

export default defineNuxtModule<YandexMetrikaModuleOptions>({
	meta: {
		name: 'nuxt-yandex-metrika',
		configKey: 'yandexMetrika',
		compatibility: {
			nuxt: '>=3.0.0',
		}
	},
	// Default configuration options of the Nuxt module
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
			defer: false,
			ecommerce: false,
			trackHash: false,
			trackLinks: true,
			webvisor: false,
			triggerEvent: false,
			sendTitle: true
		} as Partial<YandexMetrikaModuleOptions['options']>
	},
	setup(options, nuxt) {
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

		void addComponentsDir({
			path: resolver.resolve('runtime/components')
		});

		addImports({
			name: 'useYandexMetrika',
			as: 'useYandexMetrika',
			from: resolver.resolve('runtime/composables/useYandexMetrika')
		});
	}
});
