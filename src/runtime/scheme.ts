import type { GenericSchema } from 'valibot';
import type { InitParameters } from './yandex-metrika';
import { any, array, boolean, looseObject, nullish, number, object, optional, string, union } from 'valibot';

const options = object({
	accurateTrackBounce: optional(union([number(), boolean()])),
	childIframe: optional(boolean()),
	clickmap: optional(boolean()),
	ecommerce: optional(union([string(), boolean(), array(any())])),
	params: optional(
		union([
			array(
				looseObject({
					order_price: optional(number()),
					currency: optional(string())
				})
			),
			looseObject({
				order_price: optional(number()),
				currency: optional(string())
			})
		])
	),
	userParams: optional(
		looseObject({
			UserID: optional(number())
		})
	),
	trackHash: optional(boolean()),
	trackLinks: optional(boolean()),
	trustedDomain: optional(array(string())),
	type: optional(number()),
	webvisor: optional(boolean()),
	triggerEvent: optional(boolean()),
	sendTitle: optional(boolean())
}) satisfies GenericSchema<InitParameters>;

export const YandexMetrikaSchemeOptions = object({
	id: string(),
	debug: boolean(),
	delay: number(),
	cdn: boolean(),
	verification: nullish(string()),
	options: optional(options)
});
