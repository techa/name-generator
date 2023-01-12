// https://github.com/avajs/typescript
// https://github.com/avajs/ava/blob/main/docs/recipes/typescript.md
export default {
	// extensions: {
	// 	js: true,
	// 	ts: 'module',
	// },
	// nodeArguments: ['--loader=ts-node/esm'],

	typescript: {
		rewritePaths: {
			// build is tsconfig.outDir
			'src/': '.build/src/',
		},
		compile: 'tsc',
	},
};
