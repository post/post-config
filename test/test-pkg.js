import path from 'path';
import test from 'ava';
import postConfig from '../src/index.js';

process.chdir(path.resolve(process.cwd() + '/test'));

test('should retrun object', t => {
	t.true(typeof postConfig() === 'object');
	t.false(Array.isArray(postConfig()));
});

test('should retrun config if has config and not namespace', t => {
	const {testconfig} = postConfig();

	t.true(typeof testconfig === 'object');
});

test('should retrun config with plugins only', t => {
	const {testconfig} = postConfig({
		extends: {
			config: {
				testconfig: {
					'custome-plugin': {},
					'plugin-name-one': {}
				}
			},
			modules: ['testconfig-plugin-name-one']
		}
	});

	const expected = {
		testconfig: {
			plugins: {
				'custome-plugin': {},
				'testconfig-plugin-name': {},
				'testconfig-plugin-name-one': {}
			}
		}
	};

	t.deepEqual(expected.testconfig, testconfig);
});

test('should return default config with plugin from whitelist', t => {
	const {postcss, posthtml} = postConfig({
		root: 'pkg-with-whitelist-plugins',
		extends: {
			configs: {
				input: 'html/**/*.html',
				output: 'public'
			}
		}

	});
	const expected = {
		postcss: {
			plugins: {
				cssnano: {},
				'postcss-cssnext': {}
			}
		},
		posthtml: {
			plugins: {
				htmlnano: {}
			}
		}
	};
	t.deepEqual(expected.postcss, postcss);
	t.deepEqual(expected.posthtml, posthtml);
});
