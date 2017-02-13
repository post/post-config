import path from 'path';
import test from 'ava';
import postConfig from '../src/index.js';

process.chdir(path.resolve(process.cwd() + '/test'));

test('should return default config for reshape', t => {
	const {reshape} = postConfig();
	const expected = {
		reshape: {
			plugins: {
				'custom-elements': {
					defaultTag: 'span'
				}
			}
		}
	};

	t.deepEqual(expected.reshape, reshape);
});
