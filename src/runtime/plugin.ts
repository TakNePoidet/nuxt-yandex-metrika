import { defineNuxtPlugin } from "#app";
import { useRouter } from "#imports";
import { useYandexMetrikaScript } from "./composable";

export default defineNuxtPlugin({
	parallel: true,
	setup() {
		const { proxy, status } = useYandexMetrikaScript();
		if (import.meta.client) {
			const router = useRouter();

			router.afterEach((to, from) => {
				if (status.value !== "loaded") {
					return;
				}
				proxy.hit(to.fullPath, {
					referer: from.fullPath,
				});
			});
		}
	},
});
