// const toKebabCase = plugin => plugin.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
const toCamelCase = plugin => plugin.replace(/[_.-](\w|$)/g, (match, parameter) => parameter.toUpperCase());

// export {toKebabCase, toCamelCase};
export {toCamelCase};
