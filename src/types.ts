import { InitParameters } from './runtime/yandex-metrika';

export type YandexMetrikaModuleOptions = {
	id: string;
	debug: boolean;
	cdn: boolean;
	delay: number;
	verification: null | string;
	options: Partial<InitParameters>;
};
