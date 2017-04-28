import Reflect from 'core-js/fn/reflect';
import toSlugCase from 'to-slug-case';
import deepmerge from 'deepmerge';

export default (options = {}) => {
	const modules = require('./modules.js')(options);

	return modules.namespaces.reduce((config, namespace) => {
		if (Reflect.has(config, namespace) === false) {
			config[namespace] = {};
		}

		if (Reflect.has(config[namespace], 'plugins') === false) {
			config[namespace].plugins = {};
		}

		if (Reflect.has(modules.pkg, namespace)) {
			Object.keys(deepmerge(modules.pkg[namespace], modules.pkg[namespace].plugins || {}))
			.filter(property => property !== 'plugins')
			.forEach(property => {
				const module = modules.find(property, namespace);

				if (
					module &&
					Reflect.has(config[namespace], 'plugins') &&
					Reflect.has(config[namespace].plugins, module)
				) {
					config[namespace].plugins[module] = deepmerge(config[namespace].plugins[module], (modules.pkg[namespace][property] || modules.pkg[namespace].plugins[property] || {}));
					return;
				}

				if (module && Reflect.has(config[namespace].plugins, module) === false) {
					config[namespace].plugins[module] = modules.pkg[namespace][property] || modules.pkg[namespace].plugins[property] || {};
					return;
				}

				if (
					module === undefined &&
					modules.namespaces.includes(namespace) &&
					modules.list.includes(property) &&
					Reflect.has(modules.whitelist, namespace) &&
					modules.whitelist[namespace].includes(property)
				) {
					config[namespace].plugins = deepmerge(config[namespace].plugins, {[property]: modules.pkg[namespace][property] || modules.pkg[namespace].plugins[property] || {}});
					return;
				}

				if (
					module === undefined &&
					modules.list.includes(property) &&
					!(
						Reflect.has(modules.whitelist, namespace) &&
						modules.whitelist[namespace].includes(property)
					)
				) {
					config[namespace].plugins[property] = modules.pkg[namespace][property] || {};
					return;
				}

				if (
					module === undefined &&
					!modules.list.includes(property) &&
					(
						!Reflect.has(modules.whitelist, namespace) ||
						(Reflect.has(modules.whitelist, namespace) && Reflect.has(modules.whitelist[namespace], 'property'))
					) &&
					Reflect.has(modules.pkg[namespace], 'plugins') &&
					Reflect.has(modules.pkg[namespace].plugins, property)
				) {
					let moduleName = property;

					if (
						Reflect.has(modules.pkg, namespace) &&
						Reflect.has(modules.pkg[namespace], 'plugins') &&
						Reflect.has(modules.pkg[namespace].plugins, property) &&
						!property.includes(namespace) &&
						modules.find(property, namespace) === undefined
					) {
						moduleName = toSlugCase(`${namespace} ${property}`);
					}

					config[namespace].plugins = deepmerge(config[namespace].plugins, {[moduleName]: modules.pkg[namespace][property] || modules.pkg[namespace].plugins[property] || {}});
					return;
				}

				if (
					module === undefined &&
					!modules.list.includes(property) &&
					(
						!Reflect.has(modules.pkg[namespace], 'plugins') ||
						(Reflect.has(modules.pkg[namespace], 'plugins') && !Reflect.has(modules.pkg[namespace].plugins, property))
					)
				) {
					config[namespace][property] = typeof modules.pkg[namespace][property] === 'boolean' ? modules.pkg[namespace][property] : modules.pkg[namespace][property] || {};
				}
			});
		}

		modules.list
			.filter(property => (property.substr(0, namespace.length) === namespace ||
					(Reflect.has(modules.whitelist, namespace) && modules.whitelist[namespace].includes(property))) &&
					property !== namespace
			)
			.forEach(property => {
				if (modules.blacklist.includes(property)) {
					return;
				}

				if (Array.isArray(config[namespace].plugins) && config[namespace].plugins.includes(property) === false) {
					config[namespace].plugins.push(property);
					return;
				}

				if (
					Array.isArray(config[namespace].plugins) === false &&
					typeof config[namespace].plugins === 'object' &&
					Reflect.has(config[namespace].plugins, property) === false
				) {
					config[namespace].plugins[property] = {};
				}
			});

		return config;
	}, {});
};
