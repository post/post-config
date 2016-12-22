import path from 'path';
import {readdirSync, existsSync} from 'fs';
import * as convert from './to-case.js';
import deepmerge from 'deepmerge';

export default new class {
	constructor() {
		this.cwd = process.cwd();
		this.pkg = require(path.join(this.cwd, 'package.json'));
		this.list = [...new Set([...readdirSync(path.join(this.cwd, 'node_modules')), ...Object.keys(Object.assign(this.pkg.dependencies, this.pkg.devDependencies))])];
		this.namespaces = [...new Set(this.list.map(this.getNamespace).filter(namespace => namespace.length))];
	}

	find(namespace = '', property) {
		return this.list.find(module => {
			// fix, waits resolve issue #30
			if (property === '0' || property === '1') {
				return false;
			}

			return convert.toCamelCase(module).toLowerCase().indexOf(convert.toCamelCase(`${property.indexOf(namespace) === -1 ? namespace : ''}${property}`).toLowerCase()) !== -1;
		});
	}

	getNamespace(module) {
		if (module.indexOf('-') === -1) {
			return module;
		}

		return module.substr(0, module.indexOf('-'));
	}

	configExtends(configs) {
		configs.forEach(config => {
			if (Array.isArray(config)) {
				throw new TypeError('config extends must not be an Array');
			}

			if (typeof config === 'string' && existsSync(path.resolve(config))) {
				config = require(path.resolve(this.cwd, config));
			}

			this.namespaces.filter(namespace => Object.prototype.hasOwnProperty.call(config, namespace))
				.forEach(namespace => {
					this.pkg[namespace] = deepmerge(this.pkg[namespace], config[namespace]);
					delete config[namespace];
				});

			if (Object.prototype.hasOwnProperty.call(config, 'plugins')) {
				config = deepmerge(config, config.plugins);
				delete config.plugins;
			}

			Object.keys(config).forEach(property => {
				let namespace = this.namespaces.includes(this.getNamespace(property)) ? this.getNamespace(property) : undefined;
				const module = this.find(namespace, property);

				if (
					this.list.includes(module) &&
					this.namespaces.includes(namespace = this.getNamespace(module))
				) {
					this.pkg[namespace] = deepmerge(this.pkg[namespace], {[property]: config[property] || {}});
					delete config[property];
				}
			});
		});

		return this;
	}
}();
