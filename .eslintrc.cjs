module.exports = {
	root: true,
	extends: ['@nuxt/eslint-config', 'prettier'],
	plugins: ['prettier'],
	rules: {
		'max-len': 0,
		'prettier/prettier': 'error',
		'vue/no-multiple-template-root': 0
	}
};
