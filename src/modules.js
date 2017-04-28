import path from 'path';
import {readdirSync, existsSync, readFileSync} from 'fs';
import packageList from './package-list.js';
import toCamelCase from 'to-camel-case';
import deepmerge from 'deepmerge';

/* Modules
readdirSync,
import toCamelCase from 'to-camel-case';
import whiteList from './white-list.js';
import deepmerge from 'deepmerge';

export default options => new class {
	constructor() {
		this.cwd = process.cwd();
		this.pkg = require(path.join(this.cwd, 'package.json'));
		this.nodeModules = existsSync(path.join(this.cwd, 'node_modules')) ? readdirSync(path.join(this.cwd, 'node_modules')) : {};
		this.list = [...new Set([...this.nodeModules, ...Object.keys(this.pkg).filter(property => !packageList.includes(property)), ...Object.keys(Object.assign(this.pkg.dependencies || {}, this.pkg.devDependencies || {}))])];
		this.namespaces = [...new Set(this.list.map(this.getNamespace).filter(namespace => namespace.length))];
	}

	find(property, namespace = '') {
		return this.list.find(module => {
			// Fix, waits resolve issue #30
			if (property === '0' || property === '1') {
				return false;
			}

			return toCamelCase(module).toLowerCase().indexOf(toCamelCase(`${property.indexOf(namespace) === -1 ? namespace : ''}${property}`).toLowerCase()) !== -1;
		});
	}

	getNamespace(module) {
		for (let namespace in whiteList) {
			if (whiteList[namespace].includes(module)) {
				return namespace;
			}
		}

		if (module.indexOf('-') === -1) {
			return module;
		}

		return module.substr(0, module.indexOf('-'));
	}

	extends(configs) {
		if (Array.isArray(configs) === true) {
			throw new TypeError('Extend configs must not be an Array');
		}

		configs.forEach((config = {}) => {
			if (Array.isArray(config)) {
				throw new TypeError('Config extends must not be an Array');
			}

			if (typeof config === 'string' && existsSync(path.resolve(config))) {
				config = require(path.resolve(this.cwd, config));
			}

			this.namespaces
				.filter(namespace => Reflect.has(config, namespace))
				.forEach(namespace => {
					if (!Reflect.has(this.pkg, namespace)) {
						this.pkg[namespace]	= {};
					}

					this.pkg[namespace] = deepmerge(this.pkg[namespace], config[namespace]);
					Reflect.deleteProperty(config, namespace);
				});

			if (Reflect.has(config, 'plugins')) {
				config = deepmerge(config, config.plugins);
				Reflect.deleteProperty(config, 'plugins');
			}

			Object.keys(config).forEach(property => {
				let namespace = this.namespaces.includes(this.getNamespace(property)) ? this.getNamespace(property) : undefined;
				const module = this.find(property, namespace);

				if (
					module === undefined &&
					this.namespaces.includes(namespace) &&
					this.list.includes(property) &&
					whiteList[namespace].includes(property)
				) {
					this.pkg[namespace] = deepmerge(this.pkg[namespace], {[property]: config[property] || {}});
					Reflect.deleteProperty(config, property);
				}

				if (
					this.list.includes(module) &&
					this.namespaces.includes(namespace = this.getNamespace(module))
				) {
					this.pkg[namespace] = deepmerge(this.pkg[namespace], {[property]: config[property] || {}});
					Reflect.deleteProperty(config, property);
				}
			});
		});

		return this;
	}
}(options); */

export default (options = {}) => new class {
	constructor() {
		this.cwd = options.root ? path.resolve(options.root) : process.cwd();

		this.whitelist = require('./white-list.js');

		if (
			Reflect.has(options, 'extends') &&
			Reflect.has(options.extends, 'whitelist') &&
			typeof options.extends.whitelist === 'object'
		) {
			this.whitelist = deepmerge(this.whitelist, options.extends.whitelist);
		}

		this.blacklist = require('./black-list.js');

		if (
			Reflect.has(options, 'extends') &&
			Reflect.has(options.extends, 'blacklist') &&
			Array.isArray(options.extends.blacklist)
		) {
			this.blacklist = [...new Set([...this.blacklist, ...(options.extends.blacklist || [])])];
		}

		this.nodeModulesDir = options.nodeModules ? path.resolve(options.nodeModules) : this.cwd;
		this.nodeModules = (options.nodeModules !== false && existsSync(path.join(this.nodeModulesDir, 'node_modules'))) ? readdirSync(path.join(this.nodeModulesDir, 'node_modules')) : [];

		if (
			Reflect.has(options, 'extends') &&
			Reflect.has(options.extends, 'modules') &&
			Array.isArray(options.extends.modules)
		) {
			this.nodeModules = [...new Set([...this.nodeModules, ...options.extends.modules])];
		}

		this.pkg = existsSync(path.join(this.cwd, 'package.json')) ? JSON.parse(readFileSync(path.join(this.cwd, 'package.json'), 'utf-8')) : {};

		this.list = [...new Set([
			...[
				...this.nodeModules,
				...Object.keys(this.pkg).filter(property => !packageList.includes(property)),
				...Object.keys(
					Object.assign(
						this.pkg.dependencies || {},
						this.pkg.devDependencies || {}
					)
				)
			].filter(namespace => options.namespace ? options.namespace.includes(namespace) : true),
			...((Reflect.has(options, 'extends') && Reflect.has(options.extends, 'namespace') && (typeof options.extends.namespace === 'string' ? [options.extends.namespace] : options.extends.namespace)) || [])
		])];

		this.namespaces = [...new Set(this.list.map(this.getNamespace.bind(this)).filter(namespace => namespace.length))];

		if (
			Reflect.has(options, 'extends') &&
			Reflect.has(options.extends, 'config') &&
			typeof options.extends.config === 'object'
		) {
			this.pkg = deepmerge(this.pkg, this.normalizeConfig(options.extends.config));
		}
	}

	getNamespace(module) {
		for (let namespace in this.whitelist) {
			if (this.whitelist[namespace].includes(module)) {
				return namespace;
			}
		}

		if (module.includes('-') === false) {
			return module;
		}

		return module.substr(0, module.indexOf('-'));
	}

	find(property, namespace = '') {
		if (!property) {
			return;
		}

		return this.list.find(module => {
			/* Fix, waits resolve issue #30
			if (property === '0' || property === '1') {
				return false;
			} */
			return toCamelCase(module)
				.toLowerCase()
				.includes(
					toCamelCase(`${property.includes(namespace) ? '' : namespace}${property}`)
					.toLowerCase()
				);
		});
	}

	normalizeConfig(configs = {}) {
		if (Array.isArray(configs) === true) {
			throw new TypeError('Extend configs must be an Object');
		}

		if (Reflect.has(configs, 'plugins')) {
			configs = deepmerge(configs, configs.plugins);
			Reflect.deleteProperty(configs, 'plugins');
		}

		Object.keys(configs)
			.filter(property => !this.namespaces.includes(property))
			.forEach(property => {
				let namespace = this.namespaces.includes(this.getNamespace(property)) ? this.getNamespace(property) : undefined;
				const module = this.find(property, namespace);

				if (
					namespace === undefined &&
					module &&
					this.getNamespace(module) !== module
				) {
					namespace = this.getNamespace(module);
				}

				if (namespace && !Reflect.has(configs, namespace)) {
					configs[namespace] = {};
				}

				if (
					module === undefined &&
					this.namespaces.includes(namespace) &&
					this.list.includes(property) &&
					this.whitelist[namespace].includes(property)
				) {
					configs[namespace] = deepmerge(configs[namespace], {[property]: configs[property] || {}});
					Reflect.deleteProperty(configs, property);
					return;
				}

				if (
					this.list.includes(module) &&
					(
						namespace ||
						this.namespaces.includes(namespace)
					)
				) {
					configs[namespace] = deepmerge(configs[namespace], {[module]: configs[property] || {}});
					Reflect.deleteProperty(configs, property);
				}
			});

		/* Ref
		configs.forEach((config = {}) => {
			if (Array.isArray(config)) {
				throw new TypeError('Config extends must not be an Array');
			}

			if (typeof config === 'string' && existsSync(path.resolve(config))) {
				config = require(path.resolve(this.cwd, config));
			}

			this.namespaces
				.filter(namespace => Reflect.has(config, namespace))
				.forEach(namespace => {
					if (!Reflect.has(this.pkg, namespace)) {
						this.pkg[namespace]	= {};
					}

					this.pkg[namespace] = deepmerge(this.pkg[namespace], config[namespace]);
					Reflect.deleteProperty(config, namespace);
				});

			if (Reflect.has(config, 'plugins')) {
				config = deepmerge(config, config.plugins);
				Reflect.deleteProperty(config, 'plugins');
			}

			Object.keys(config).forEach(property => {
				let namespace = this.namespaces.includes(this.getNamespace(property)) ? this.getNamespace(property) : undefined;
				const module = this.find(property, namespace);

				if (
					module === undefined &&
					this.namespaces.includes(namespace) &&
					this.list.includes(property) &&
					whiteList[namespace].includes(property)
				) {
					this.pkg[namespace] = deepmerge(this.pkg[namespace], {[property]: config[property] || {}});
					Reflect.deleteProperty(config, property);
				}

				if (
					this.list.includes(module) &&
					this.namespaces.includes(namespace = this.getNamespace(module))
				) {
					this.pkg[namespace] = deepmerge(this.pkg[namespace], {[property]: config[property] || {}});
					Reflect.deleteProperty(config, property);
				}
			});
		});

		return this;
		*/

		return configs;
	}
}(options);
