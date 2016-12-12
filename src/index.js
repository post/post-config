import path from 'path';
import {existsSync} from 'fs';
import blackList from './black-list';

const exclude = plugins => /^posthtml-[\w]/.test(plugins);
const inBlackList = plugin => !blackList.includes(plugin);
const toSnakeCase = plugin => plugin.slice(9).replace(/[_.-](\w|$)/g, (match, parameter) => parameter.toUpperCase());
const isFile = string => typeof string === 'string' && existsSync(path.join(process.cwd(), string));

export default (...options) => {
	const {dependencies, devDependencies, posthtml} = require(path.join(process.cwd(), 'package.json'));

	return Object.assign(
		{},
		Object.keys(Object.assign({}, dependencies, devDependencies))
			.filter(exclude)
			.filter(inBlackList)
			.map(toSnakeCase)
			.reduce((previousValue, currentValue) => Object.assign(previousValue, {[currentValue]: {}}), {}),
		posthtml,
		options.reduce((previousValue, currentValue) => {
			if (isFile(currentValue)) {
				currentValue = require(path.resolve(currentValue));
			}

			if (Array.isArray(currentValue)) {
				currentValue = currentValue.reduce((previousValue, currentValue) => Object.assign(previousValue, currentValue), {});
			}

			if (Array.isArray(currentValue) === false && isFile(currentValue) === false && currentValue !== undefined) {
				currentValue = Object.keys(currentValue)
					.map(plugin => (exclude(plugin) ? {[toSnakeCase(plugin)]: currentValue[plugin]} : {[plugin]: currentValue[plugin]}))
					.reduce((previousValue, currentValue) => Object.assign(previousValue, currentValue), {});
			}

			return Object.assign(previousValue, currentValue);
		}, {})
	);
};
