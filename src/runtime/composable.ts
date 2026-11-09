import type { YandexMetrikaApi } from './yandex-metrika';
import { useNuxtApp } from '#app';

export function useYandexMetrika(): YandexMetrikaApi {
	const nuxtApp = useNuxtApp();
	return (nuxtApp as any).$yandexMetrika as YandexMetrikaApi;
}
