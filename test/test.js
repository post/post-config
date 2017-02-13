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