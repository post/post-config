import path from 'path';
import test from 'ava';
import postConfig from '../src/index.js';

process.chdir(path.resolve(process.cwd() + '/test'));

test('should return default config for reshape', t => {
	const ext = {
		reshape: {
			plugins: {
				'custom-elements': {
					defaultTag: 'span'
				}
			}
		}
	};
	const {reshape} = postConfig(ext);
	const expected = {
		reshape: {
			plugins: {
				'reshape-custom-elements': {
					defaultTag: 'span'
				}
			}
		}
	};

	t.deepEqual(expected.reshape, reshape);
});
