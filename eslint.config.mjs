import { createConfigForNuxt } from '@nuxt/eslint-config/flat';

export default createConfigForNuxt().append({
	rules: {
		'@typescript-eslint/no-explicit-any': 0
	}
});
