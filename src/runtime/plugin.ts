import { defineNuxtPlugin } from '#app';
import { nextTick, useRouter } from '#imports';
import { useYandexMetrikaScript } from './composable';

/**
 * Хиты при переходах внутри приложения. Просмотр первой страницы отправляет init.
 *
 * - Переход на тот же адрес — не новый просмотр. Nuxt при старте повторяет
 *   начальную навигацию (router.replace с force), и раньше загруженная страница
 *   получала второй хит.
 * - Хит уходит, когда новая страница отрисована (page:finish) и Nuxt обновил
 *   <head>, — иначе Метрика записывала заголовок предыдущей страницы. Если
 *   page:finish не пришёл (компонент страницы не менялся, в приложении нет
 *   <NuxtPage>), хит уходит по таймауту.
 */
const PAGE_FINISH_TIMEOUT = 1000;

export default defineNuxtPlugin({
	parallel: true,
	setup(nuxtApp) {
		const { proxy } = useYandexMetrikaScript();

		if (!import.meta.client) {
			return;
		}

		const router = useRouter();
		let pending: { url: string; referer: string } | null = null;
		let timer: ReturnType<typeof setTimeout> | undefined;

		function send() {
			clearTimeout(timer);

			if (!pending) {
				return;
			}

			const { url, referer } = pending;
			pending = null;
			proxy.hit(url, { referer, title: document.title });
		}

		router.afterEach((to, from, failure) => {
			// Начальная навигация (from без маршрута), отменённая или на тот же адрес.
			if (failure || from.matched.length === 0 || to.fullPath === from.fullPath) {
				return;
			}

			// Переход до того, как отрисовалась предыдущая страница, — её хит не теряем.
			send();
			pending = { url: to.fullPath, referer: from.fullPath };
			timer = setTimeout(send, PAGE_FINISH_TIMEOUT);
		});

		nuxtApp.hooks.hook('page:finish', async () => {
			if (!pending) {
				return;
			}

			// Nuxt обновляет <head> на том же page:finish — даём ему отработать.
			await nextTick();
			setTimeout(send, 0);
		});
	}
});
