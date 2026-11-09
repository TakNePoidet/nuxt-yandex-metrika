import { defineNuxtPlugin } from '#app';
import consola from 'consola';

export default defineNuxtPlugin({
	name: 'ym-set',
	enforce: 'pre', // ← выполнится раньше обычных плагинов
	setup(nuxtApp) {
		nuxtApp.hook('yandexMetrika:before-init', ({ setOptions }) => {
			const id = '123123';
			consola.log('[playground] yandexMetrika:before-init → подставляем id:', id);
			setOptions({ id, enabled: true, options: { webvisor: true, clickmap: true } });
		});
	}
});
