import { defineNuxtPlugin } from '#app';
import { useRouter } from '#imports';
import { useYandexMetrikaScript } from './composable';

export default defineNuxtPlugin({
	parallel: true,
	setup() {
		const { proxy } = useYandexMetrikaScript();
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
				proxy.hit(to.fullPath, {
					referer: from.fullPath
				});
			});
		}
	}
});
