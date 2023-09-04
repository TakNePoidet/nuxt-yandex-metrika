import { useNuxtApp } from '#imports';
import { YandexMetrika } from '../yandex-metrika';

export function useYandexMetrika(): YandexMetrika {
	const { $yandexMetrika } = useNuxtApp();
	return $yandexMetrika;
}
