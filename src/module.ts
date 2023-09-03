import {
	addComponentsDir,
	addImportsDir,
	addPlugin,
	createResolver,
	defineNuxtModule,
} from "@nuxt/kit";
import { defu } from "defu";
import { name, version } from "../package.json";
import { type YandexMetrikaModuleOptions } from "./types";

export default defineNuxtModule<YandexMetrikaModuleOptions>({
	meta: {
		name,
		version,
		configKey: "yandexMetrika",
		compatibility: {
			nuxt: "^3",
		},
	},
	// Default configuration options of the Nuxt module
	defaults: {
		id: "xxx",
		debug: process.env.NODE_ENV !== "production",
		delay: 0,
		cdn: false,
		verification: null,
		options: {},
	},
	setup(options, nuxt) {
		nuxt.options.runtimeConfig.public.yandexMetrika = defu(
			nuxt.options.runtimeConfig.public.yandexMetrika ?? {},
			options,
		);
		const resolver = createResolver(import.meta.url);

		addPlugin({
			mode: "all",
			src: resolver.resolve("./runtime/plugin"),
		});

		void addComponentsDir({
			path: resolver.resolve("runtime/components"),
		});

		addImportsDir(resolver.resolve("runtime/composables"));
	},
});
