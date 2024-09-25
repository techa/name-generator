module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
	],
	plugins: ['@typescript-eslint'],
	ignorePatterns: ['*.cjs', '*.html'],
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser',
			},
		},
	],
	rules: {
		'@typescript-eslint/no-empty-interface': [
			'error',
			{
				allowSingleExtends: true,
			},
		],
		'@typescript-eslint/no-explicit-any': [
			'warn',
			{ ignoreRestArgs: true },
		],
		'@typescript-eslint/no-redeclare': [
			'error',
			{ ignoreDeclarationMerge: true },
		],
		'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		project: './tsconfig.json',
		extraFileExtensions: ['.svelte'],
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
};
