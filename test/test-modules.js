import path from 'path';
import test from 'ava';
import modules from '../src/modules.js';

process.chdir(path.resolve(process.cwd() + '/test'));

test('should retrun function', t => {
	t.true(typeof modules === 'function');
});

test('should retrun object if call', t => {
	t.is(typeof modules(), 'object');
	t.false(Array.isArray(modules()));
});

test('should retrun cwd', t => {
	t.is(modules().cwd, path.resolve(process.cwd()));
});

test('should retrun cwd with root option', t => {
	const options = {
		root: 'cwd-with-root'
	};

	t.is(modules({root: '/cwd-with-root'}).cwd, path.resolve(`/${options.root}`));
	t.is(modules({root: '/cwd-with-root/'}).cwd, path.resolve(`/${options.root}/`));
	t.is(modules({root: '../cwd-with-root/'}).cwd, path.resolve(`../${options.root}`));

	t.is(modules({root: 'cwd-with-root/'}).cwd, path.resolve(path.join(process.cwd(), options.root)));
	t.is(modules({root: './cwd-with-root'}).cwd, path.resolve(path.join(process.cwd(), options.root)));
});

test('should retrun pkg', t => {
	t.truthy(modules().pkg);
});

test('pkg should be object', t => {
	t.is(typeof modules().pkg, 'object');
	t.is(modules().pkg.name, 'post-config-test');
});

test('should retrun empty object', t => {
	const options = {
		root: 'pkg-not-exists'
	};

	t.is(typeof modules(options).pkg, 'object');
	t.falsy(Object.keys(modules(options).pkg).length);
});

test('should retrun pkg with extends config', t => {
	const options = {
		root: 'pkg-extends-from-config',
		extends: {
			config: {
				posthtml: {
					plugins: [
						'posthtml-spaceless'
					]
				}
			}
		}
	};

	const expected = {
		dependencies: {
			poshtml: '*',
			eslint: '*'
		},
		posthtml: {
			sync: true,
			plugins: [
				'posthtml-spaceless'
			]
		}
	};

	t.is(typeof modules(options).pkg, 'object');
	t.deepEqual(modules(options).pkg, expected);
});

test('should retrun pkg overwrite with extends config', t => {
	const options = {
		root: 'pkg-extends-from-config',
		extends: {
			config: {
				posthtml: {
					sync: false,
					plugins: [
						'posthtml-spaceless'
					]
				}
			}
		}
	};

	const expected = {
		dependencies: {
			poshtml: '*',
			eslint: '*'
		},
		posthtml: {
			sync: false,
			plugins: [
				'posthtml-spaceless'
			]
		}
	};

	t.is(typeof modules(options).pkg, 'object');
	t.deepEqual(modules(options).pkg, expected);
});

test('should retrun nodeModules array relative cwd() `test/`', t => {
	t.true(Array.isArray(modules().nodeModules));
	t.is(modules().nodeModules.length, 0);
});

test('should retrun nodeModules array relative pwd', t => {
	t.true(Array.isArray(modules({root: '../'}).nodeModules));
	t.true(modules({root: '../'}).nodeModules.length > 0);
});

test('should retrun nodeModules array relative path options `node_modules`', t => {
	t.true(Array.isArray(modules({nodeModules: 'nodeModules-relative-path'}).nodeModules));
	t.is(modules({nodeModules: 'nodeModules-relative-path'}).nodeModules.length, 3);
	t.deepEqual(modules({nodeModules: 'nodeModules-relative-path'}).nodeModules, ['babel', 'postcss', 'posthtml']);
});

test('should retrun nodeModules empty array if set options false', t => {
	t.true(Array.isArray(modules({nodeModules: './'}).nodeModules));
	t.is(modules({nodeModules: './'}).nodeModules.length, 0);
});

test('should retrun list wichout pkg', t => {
	t.true(Array.isArray(modules({root: 'list-wichout-pkg'}).list));
	t.is(modules({root: 'list-wichout-pkg'}).list.length, 2);
	t.deepEqual(modules({root: 'list-wichout-pkg'}).list, ['babel', 'posthtml']);
});

test('should retrun list from pkg only dependencies', t => {
	t.true(Array.isArray(modules({root: 'list-from-pkg-only-dependencies'}).list));
	t.is(modules({root: 'list-from-pkg-only-dependencies'}).list.length, 4);
	t.deepEqual(modules({root: 'list-from-pkg-only-dependencies'}).list, ['babel', 'posthtml', 'postcss', 'eslint']);
});

test('should retrun list from pkg only devDependencies', t => {
	t.true(Array.isArray(modules({root: 'list-from-pkg-only-devDependencies'}).list));
	t.is(modules({root: 'list-from-pkg-only-devDependencies'}).list.length, 3);
	t.deepEqual(modules({root: 'list-from-pkg-only-devDependencies'}).list, ['babel', 'posthtml', 'postcss']);
});

test('should retrun list from pkg', t => {
	t.true(Array.isArray(modules({root: 'list-from-pkg'}).list));
	t.is(modules({root: 'list-from-pkg'}).list.length, 1);
	t.deepEqual(modules({root: 'list-from-pkg'}).list, ['babel']);
});

test('should retrun namespace', t => {
	t.true(Array.isArray(modules({root: 'namespaces'}).namespaces));
	t.is(modules({root: 'namespaces'}).namespaces.length, 7);
	t.deepEqual(modules({root: 'namespaces'}).namespaces, ['babel', 'postcss', 'posthtml', 'core', 'deepmerge', 'to', 'eslint']);
});

test('should retrun namespaces from pkg', t => {
	t.true(Array.isArray(modules({root: 'namespaces-from-pkg'}).namespaces));
	t.is(modules({root: 'namespaces-from-pkg'}).namespaces.length, 4);
	t.deepEqual(modules({root: 'namespaces-from-pkg'}).namespaces, ['core', 'deepmerge', 'to', 'eslint']);
});

test('should retrun namespaces witchout pkg', t => {
	t.true(Array.isArray(modules({root: 'namespaces-witchout-pkg'}).namespaces));
	t.is(modules({root: 'namespaces-witchout-pkg'}).namespaces.length, 3);
	t.deepEqual(modules({root: 'namespaces-witchout-pkg'}).namespaces, ['babel', 'postcss', 'posthtml']);
});

test('should retrun namespace extends from `namespace`', t => {
	const options = {
		root: 'namespaces-extends-from-namespace',
		extends: {
			namespace: ['posthtml', 'reshape']
		}
	};

	t.true(Array.isArray(modules(options).namespaces));
	t.is(modules(options).namespaces.length, 8);
	t.deepEqual(modules(options).namespaces, ['babel', 'postcss', 'posthtml', 'core', 'deepmerge', 'to', 'eslint', 'reshape']);
});

test('should retrun namespace with options `namespace`', t => {
	const options = {
		root: 'namespaces-with-namespace',
		namespace: ['posthtml', 'reshape']
	};

	t.true(Array.isArray(modules(options).namespaces));
	t.is(modules(options).namespaces.length, 1);
	t.deepEqual(modules(options).namespaces, ['posthtml']);
});

test('should retrun namespace with options `namespace` as string', t => {
	const options = {
		root: 'namespaces-with-namespace',
		namespace: 'posthtml'
	};

	t.true(Array.isArray(modules(options).namespaces));
	t.is(modules(options).namespaces.length, 1);
	t.deepEqual(modules(options).namespaces, ['posthtml']);
});

test('should retrun whitelist', t => {
	t.false(Array.isArray(modules().whitelist));
	t.true(Object.prototype.hasOwnProperty.call(modules().whitelist, 'posthtml'));
	t.true(Object.prototype.hasOwnProperty.call(modules().whitelist, 'postcss'));
});

test('should retrun whitelist extends options `whitelist`', t => {
	const options = {
		extends: {
			whitelist: {
				reshape: [],
				posthtml: ['nanohtml']
			}
		}
	};

	t.false(Array.isArray(modules(options).whitelist));
	t.true(Object.prototype.hasOwnProperty.call(modules(options).whitelist, 'reshape'));
	t.is(modules(options).whitelist.reshape.length, 0);
	t.is(modules(options).whitelist.posthtml.length, require('../src/white-list.js').posthtml.length + 1);
});

test('should retrun blacklist', t => {
	t.true(Array.isArray(modules().blacklist));
});

test('should retrun blacklist extends options `blacklist`', t => {
	const options = {
		extends: {
			blacklist: ['nanohtml']
		}
	};

	t.true(Array.isArray(modules(options).blacklist));
	t.true(modules(options).blacklist.includes(options.extends.blacklist[0]));
	t.is(modules(options).blacklist.length, require('../src/black-list.js').length + 1);
});

test('should retrun function `getNamespace`', t => {
	t.is(typeof modules().getNamespace, 'function');
});

test('should function `getNamespace` return postcss namespace', t => {
	t.is(modules().getNamespace('autoprefixer'), 'postcss');
	t.is(modules().getNamespace('postcss'), 'postcss');
	t.is(modules().getNamespace('postcss-cli'), 'postcss');
});

test('should return function `find`', t => {
	t.is(typeof modules().find, 'function');
});

test('should function `find` return undefined', t => {
	t.is(modules().find(), undefined);
	t.is(modules().find(undefined), undefined);
	t.is(modules().find(null), undefined);
	t.is(modules().find(NaN), undefined);
});

test('should function `find` return full module name', t => {
	t.is(modules({root: 'find-module'}).find('spaceless'), 'posthtml-spaceless');
	t.is(modules({root: 'find-module'}).find('atRulesVariables'), 'postcss-at-rules-variables');
});

test('should return function `normalizeConfig`', t => {
	t.is(typeof modules().normalizeConfig, 'function');
});

test('should function `normalizeConfig` return empty object', t => {
	t.deepEqual(modules().normalizeConfig(), {});
});

test('should retrun Error: Extend configs must not be an Array', t => {
	const error = t.throws(() => {
		modules().normalizeConfig([]);
	}, TypeError);

	t.is(error.message, 'Extend configs must be an Object');
});

test('should function `normalizeConfig` return equal object', t => {
	const config = {
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
		}
	};

	t.deepEqual(modules().normalizeConfig(config), config);
});

test('should function `normalizeConfig` return normalize config from `plugins` property', t => {
	const config = {
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
		plugins: {
			atRulesVariables: {
				atRule: ['@test']
			}
		}
	};

	const expected = {
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
			'postcss-at-rules-variables': {
				atRule: ['@test']
			}
		}
	};

	t.deepEqual(modules().normalizeConfig(config), expected);
});

test('should function `normalizeConfig` return normalize config from `plugin` key', t => {
	const config = {
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
		styleToFile: {
			path: './*.css'
		}
	};

	const expected = {
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
			},
			'posthtml-style-to-file': {
				path: './*.css'
			}
		}
	};

	t.deepEqual(modules().normalizeConfig(config), expected);
});
