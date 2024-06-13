export default defineNuxtConfig({
	modules: ['../src/module'],
	yandexMetrika: {
		id: import.meta.env.YANDEX_METRIKA_ID,
		delay: 1000,
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
