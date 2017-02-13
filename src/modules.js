import path from 'path';
import {readdirSync, existsSync} from 'fs';
import toCamelCase from 'to-camel-case';
import whiteList from './white-list.js';
import packageList from './package-list.js';
import deepmerge from 'deepmerge';

export default new class {
	constructor() {
		this.cwd = process.cwd();
		this.pkg = require(path.join(this.cwd, 'package.json'));
		this.nodeModules = existsSync(path.join(this.cwd, 'node_modules')) ? readdirSync(path.join(this.cwd, 'node_modules')) : {};
		this.list = [...new Set([...this.nodeModules, ...Object.keys(this.pkg).filter(name => !packageList.includes(name)), ...Object.keys(Object.assign(this.pkg.dependencies, this.pkg.devDependencies))])];
		this.namespaces = [...new Set(this.list.map(this.getNamespace).filter(namespace => namespace.length))];
	}

	find(namespace = '', property) {
		return this.list.find(module => {
			// fix, waits resolve issue #30
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

	configExtends(configs) {
		configs.forEach((config = {}) => {
			if (Array.isArray(config)) {
				throw new TypeError('config extends must not be an Array');
			}

			if (typeof config === 'string' && existsSync(path.resolve(config))) {
				config = require(path.resolve(this.cwd, config));
			}

			this.namespaces
				.filter(namespace => Reflect.has(config, namespace))
				.forEach(namespace => {
					this.pkg[namespace] = deepmerge(this.pkg[namespace], config[namespace]);
					Reflect.deleteProperty(config, namespace);
				});

			if (Reflect.has(config, 'plugins')) {
				config = deepmerge(config, config.plugins);
				Reflect.deleteProperty(config, 'plugins');
			}

			Object.keys(config).forEach(property => {
				let namespace = this.namespaces.includes(this.getNamespace(property)) ? this.getNamespace(property) : undefined;
				const module = this.find(namespace, property);

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
}();
