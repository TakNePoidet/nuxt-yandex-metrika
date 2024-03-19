import { useNuxtApp } from '#app';

import type { YandexMetrika } from '../yandex-metrika';

export function useYandexMetrika(): YandexMetrika {
	const { $yandexMetrika } = useNuxtApp();
	return $yandexMetrika;
}
