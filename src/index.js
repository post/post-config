import blackList from './black-list.js';
import whiteList from './white-list.js';
import deepmerge from 'deepmerge';

export default (...configExtends) => {
	const modules = require('./modules.js');

	return modules.configExtends(configExtends).namespaces.reduce((config, namespace) => {
		if (Reflect.has(modules.pkg, namespace)) {
			if (Reflect.has(config, config[namespace]) === false) {
				config[namespace] = {};
			}

			if (Reflect.has(config[namespace], 'plugins') === false) {
				config[namespace].plugins = {};
			}

			Object.keys(deepmerge(modules.pkg[namespace], modules.pkg[namespace].plugins || {}))
				.filter(property => property !== 'plugins')
				.forEach(property => {
					const module = modules.find(namespace, property);

					if (
						module &&
						Reflect.has(config[namespace], 'plugins') &&
						Reflect.has(config[namespace].plugins, module)
					) {
						config[namespace].plugins[module] = deepmerge(config[namespace].plugins[module], (modules.pkg[namespace][property] || modules.pkg[namespace].plugins[property] || {}));
					}

					if (module && Reflect.has(config[namespace].plugins, module) === false) {
						config[namespace].plugins[module] = modules.pkg[namespace][property] || modules.pkg[namespace].plugins[property] || {};
					}

					if (
						module === undefined &&
						modules.namespaces.includes(namespace) &&
						modules.list.includes(property) &&
						whiteList[namespace].includes(property)
					) {
						config[namespace].plugins = deepmerge(config[namespace].plugins, {[property]: modules.pkg[namespace][property] || modules.pkg[namespace].plugins[property] || {}});
					}

					if (
						module === undefined &&
						modules.list.includes(property) &&
						whiteList[namespace].includes(property) === false
					) {
						config[namespace].plugins[property] = modules.pkg[namespace][property] || {};
					}

					if (module === undefined && !modules.list.includes(property)) {
						config[namespace][property] = typeof modules.pkg[namespace][property] === 'boolean' ? modules.pkg[namespace][property] : modules.pkg[namespace][property] || {};
					}
				});

			modules.list
				.filter(property => (property.substr(0, namespace.length) === namespace ||
						(Reflect.has(whiteList, namespace) && whiteList[namespace].includes(property))) &&
						property !== namespace
				)
				.forEach(property => {
					if (blackList.includes(property)) {
						return;
					}

					if (Array.isArray(config[namespace].plugins) && config[namespace].plugins.includes(property) === false) {
						config[namespace].plugins.push(property);
					}

					if (
						Array.isArray(config[namespace].plugins) === false &&
						typeof config[namespace].plugins === 'object' &&
						Reflect.has(config[namespace].plugins, property) === false
					) {
						config[namespace].plugins[property] = {};
					}
				});
		}

		return config;
	}, {});
};
