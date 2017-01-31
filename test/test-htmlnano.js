import path from 'path';
import test from 'ava';
import postConfig from '../src/index.js';

process.chdir(path.resolve(process.cwd() + '/test/htmlnano'));

test('should return default config', t => {
	const {postcss, posthtml} = postConfig({input: 'html/**/*.html', output: 'public'});
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
