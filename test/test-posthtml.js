import path from 'path';
import test from 'ava';
import postConfig from '../src/index.js';

process.chdir(path.resolve(process.cwd() + '/test'));

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
