import blackList from './black-list.js';
import whiteList from './white-list.js';

export default () => {
	const modules = require('./modules.js');

	return modules.namespaces.reduce((config, namespace) => {
		if (Object.prototype.hasOwnProperty.call(modules.pkg, namespace)) {
			if (Object.prototype.hasOwnProperty.call(config, config[namespace]) === false) {
				config[namespace] = {};
			}

			if (Object.prototype.hasOwnProperty.call(config[namespace], 'plugins') === false) {
				config[namespace].plugins = {};
			}

			Object.keys(modules.pkg[namespace]).forEach(property => {
				const module = modules.find(namespace, property);

				if (module) {
					config[namespace].plugins[module] = modules.pkg[namespace][property];
				}

				if (module === undefined && modules.list.includes(property)) {
					config[namespace].plugins[property] = modules.pkg[namespace][property];
				}

				if (module === undefined && !modules.list.includes(property)) {
					config[namespace][property] = modules.pkg[namespace][property];
				}
			});

			modules.list
				.filter(property => (property.substr(0, namespace.length) === namespace ||
						(Object.prototype.hasOwnProperty.call(whiteList, namespace) && whiteList[namespace].includes(property))) &&
						property !== namespace
				)
				.forEach(property => {
					if (blackList.includes(property)) {
						return;
					}

					if (Array.isArray(config[namespace].plugins)) {
						config[namespace].plugins.push(property);
					}

					if (
						Array.isArray(config[namespace].plugins) === false &&
						typeof config[namespace].plugins === 'object' &&
						Object.prototype.hasOwnProperty.call(config[namespace].plugins, property) === false
					) {
						config[namespace].plugins[property] = {};
					}
				});
		}

		return config;
	}, {});
};
