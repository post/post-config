import path from 'path';
import test from 'ava';
import postConfig from '../src/index.js';

process.chdir(path.resolve(process.cwd() + '/test'));

test('should retrun object', t => {
	t.true(typeof postConfig() === 'object');
	t.false(Array.isArray(postConfig()));
});

test('should retrun Error: config extends must not be an Array', t => {
	const error = t.throws(() => {
		postConfig([[]]);
	}, TypeError);

	t.is(error.message, 'config extends must not be an Array');
});

test('should return default config postcss from package', t => {
	const {postcss} = postConfig();
	const expected = {
		postcss: {
			from: 'test',
			to: './',
			plugins: {
				'postcss-modules': {
					generateScopedName: '[name]__[local]___[hash:base64:5]'
				},
				autoprefixer: {},
				'postcss-at-rules-variables': {
					atRule: ['@media']
				},
				'postcss-attribute-selector-prefix': {},
				'postcss-banner': {},
				'postcss-browser-reporter': {},
				'postcss-calc': {},
				'postcss-class-prefix': {},
				'postcss-clearfix': {},
				'postcss-conditionals': {},
				'postcss-csso': {},
				'postcss-custom-properties': {},
				'postcss-devtools': {},
				'postcss-each': {},
				'postcss-easy-import': {},
				'postcss-extend': {},
				'postcss-for': {},
				'postcss-initial': {},
				'postcss-mixins': {},
				'postcss-nested': {},
				'postcss-sorting': {},
				cssnano: {},
				perfectionist: {},
				'postcss-discard-comments': {}
			}
		}
	};

	t.deepEqual(expected.postcss, postcss);
});

test('should return default config posthtml from package', t => {
	const {posthtml} = postConfig();
	const expected = {
		posthtml: {
			sync: true,
			plugins: {
				'posthtml-bem': {
					elemPrefix: '__',
					modPrefix: '--',
					modDlmtr: '-'
				},
				'posthtml-style-to-file': {
					path: './dist/styleToFile.css'
				},
				'posthtml-modules': {
					root: './src/'
				},
				'posthtml-inline-assets': {
					from: 'dev/index.html'
				},
				'posthtml-remove-tags': {
					tags: 'style'
				},
				'posthtml-css-modules': {},
				'posthtml-each': {},
				'posthtml-include': {},
				'posthtml-beautify': {},
				'posthtml-inline-css': {},
				'posthtml-remove-attributes': 'class'
			}
		}
	};

	t.deepEqual(expected.posthtml, posthtml);
});

test('should return default config posthtml with extends config', t => {
	const extend = {
		posthtml: {
			sync: false,
			plugins: {
				'posthtml-remove-tags': {
					tags: 'a'
				},
				beautify: {
					rules: {
						indent: 4
					}
				}
			}
		},
		postcss: {
			from: 'src/',
			plugins: {
				'postcss-calc': {
					precision: 2
				}
			}
		},
		styleToFile: {
			path: './*.css'
		},
		plugins: {
			atRulesVariables: {
				atRule: ['@test']
			}
		}
	};
	const {posthtml} = postConfig(extend);
	const expected = {
		posthtml: {
			sync: false,
			plugins: {
				'posthtml-bem': {
					elemPrefix: '__',
					modPrefix: '--',
					modDlmtr: '-'
				},
				'posthtml-style-to-file': {
					path: './*.css'
				},
				'posthtml-modules': {
					root: './src/'
				},
				'posthtml-inline-assets': {
					from: 'dev/index.html'
				},
				'posthtml-remove-tags': {
					tags: 'a'
				},
				'posthtml-css-modules': {},
				'posthtml-each': {},
				'posthtml-include': {},
				'posthtml-beautify': {
					rules: {
						indent: 4
					}
				},
				'posthtml-inline-css': {},
				'posthtml-remove-attributes': 'class'
			}
		}
	};

	t.deepEqual(expected.posthtml, posthtml);
});

test('should return default config postcss with extends config', t => {
	const extend = {
		posthtml: {
			sync: false,
			plugins: {
				'posthtml-remove-tags': {
					tags: 'a'
				},
				beautify: {
					rules: {
						indent: 4
					}
				}
			}
		},
		postcss: {
			from: 'src/',
			plugins: {
				autoprefixer: {
					browsers: ['last 2 versions']
				},
				'postcss-calc': {
					precision: 2
				}
			}
		},
		styleToFile: {
			path: './*.css'
		},
		plugins: {
			atRulesVariables: {
				atRule: ['@test']
			}
		}
	};
	const {postcss} = postConfig(extend);
	const expected = {
		postcss: {
			from: 'src/',
			to: './',
			plugins: {
				'postcss-modules': {
					generateScopedName: '[name]__[local]___[hash:base64:5]'
				},
				autoprefixer: {
					browsers: ['last 2 versions']
				},
				'postcss-at-rules-variables': {
					atRule: ['@test', '@media']
				},
				'postcss-attribute-selector-prefix': {},
				'postcss-banner': {},
				'postcss-browser-reporter': {},
				'postcss-calc': {
					precision: 2
				},
				'postcss-class-prefix': {},
				'postcss-clearfix': {},
				'postcss-conditionals': {},
				'postcss-csso': {},
				'postcss-custom-properties': {},
				'postcss-devtools': {},
				'postcss-each': {},
				'postcss-easy-import': {},
				'postcss-extend': {},
				'postcss-for': {},
				'postcss-initial': {},
				'postcss-mixins': {},
				'postcss-nested': {},
				'postcss-sorting': {},
				cssnano: {},
				perfectionist: {},
				'postcss-discard-comments': {}
			}
		}
	};

	t.deepEqual(expected.postcss, postcss);
});

test('should return default config postcss with extends config from file', t => {
	const {postcss} = postConfig('fixtures/postcss-config-extends.json');
	const expected = {
		postcss: {
			from: 'src/',
			to: './',
			plugins: {
				'postcss-modules': {
					generateScopedName: '[name]__[local]___[hash:base64:5]'
				},
				autoprefixer: {
					browsers: ['last 2 versions']
				},
				'postcss-at-rules-variables': {
					atRule: ['@test', '@media']
				},
				'postcss-attribute-selector-prefix': {},
				'postcss-banner': {},
				'postcss-browser-reporter': {},
				'postcss-calc': {
					precision: 2
				},
				'postcss-class-prefix': {},
				'postcss-clearfix': {},
				'postcss-conditionals': {},
				'postcss-csso': {},
				'postcss-custom-properties': {},
				'postcss-devtools': {},
				'postcss-each': {},
				'postcss-easy-import': {},
				'postcss-extend': {},
				'postcss-for': {},
				'postcss-initial': {},
				'postcss-mixins': {},
				'postcss-nested': {},
				'postcss-sorting': {},
				cssnano: {},
				perfectionist: {},
				'postcss-discard-comments': {}
			}
		}
	};

	t.deepEqual(expected.postcss, postcss);
});
