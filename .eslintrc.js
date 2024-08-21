module.exports = {
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'prettier', 'import', 'html'],
	extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'plugin:prettier/recommended'],
	overrides: [],
	rules: {
		'prettier/prettier': 'error',
		'no-unexpected-multiline': 'off',
		'import/order': ['error', { alphabetize: { order: 'asc' } }],
	},
};
