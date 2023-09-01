import { InitParameters } from "./runtime/yandex-metrika";

export type YandexMetrikaModuleOptions = {
	id: string;
	debug: boolean;
	cdn: boolean;
	delay: number;
	options: Partial<InitParameters>;
};
