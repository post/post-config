import path from 'path';
import {readdirSync} from 'fs';
import * as convert from './to-case.js';

export default new class {
	constructor() {
		this.cwd = process.cwd();
		this.pkg = require(path.join(this.cwd, 'package.json'));
		this.list = [...new Set([...readdirSync(path.join(this.cwd, 'node_modules')), ...Object.keys(Object.assign(this.pkg.dependencies, this.pkg.devDependencies))])];
		this.namespaces = [...new Set(this.list.map(this.getNamespace).filter(namespace => namespace.length))];
	}

	find(namespace = '', property) {
		return this.list.find(module => {
			return convert.toCamelCase(module).toLowerCase().indexOf(convert.toCamelCase(`${namespace}${property}`).toLowerCase()) !== -1;
		});
	}

	getNamespace(module) {
		if (module.indexOf('-') === -1) {
			return module;
		}

		return module.substr(0, module.indexOf('-'));
	}
}();
