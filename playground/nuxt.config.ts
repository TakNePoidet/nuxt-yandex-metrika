export default defineNuxtConfig({
	modules: ['../src/module'],
	yandexMetrika: {
		id: import.meta.env.YANDEX_METRIKA_ID,
		delay: 0,
		verification: 'dfdsfdfsfsd',
		debug: true,
		options: {
			clickmap: false,
			trackLinks: true,
			accurateTrackBounce: true,
			webvisor: false
		}
	},
	devtools: { enabled: true }
});
