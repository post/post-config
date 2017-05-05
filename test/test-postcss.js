import path from 'path';
import test from 'ava';
import postConfig from '../src/index.js';

process.chdir(path.resolve(process.cwd() + '/test'));

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

test('should return default config postcss with extends config', t => {
	const extend = {
		extends: {
			config: {
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
	const {postcss} = postConfig({extends: {config: require(path.resolve('postcss-extends-config/extends.json'))}});
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
