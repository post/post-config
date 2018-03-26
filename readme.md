# post-config

> Creates a configuration

[![Travis Build Status](https://img.shields.io/travis/post/post-config/master.svg?style=flat-square&label=unix)](https://travis-ci.org/post/post-config)[![node](https://img.shields.io/node/v/post-sequence.svg?maxAge=2592000&style=flat-square)]()[![npm version](https://img.shields.io/npm/v/post-config.svg?style=flat-square)](https://www.npmjs.com/package/post-config)[![Dependency Status](https://david-dm.org/post/post-config.svg?style=flat-square)](https://david-dm.org/post/post-config)[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg?style=flat-square)](https://github.com/sindresorhus/xo)[![Coveralls status](https://img.shields.io/coveralls/post/post-config.svg?style=flat-square)](https://coveralls.io/r/post/post-config)

[![npm downloads](https://img.shields.io/npm/dm/post-config.svg?style=flat-square)](https://www.npmjs.com/package/post-config)[![npm](https://img.shields.io/npm/dt/post-config.svg?style=flat-square)](https://www.npmjs.com/package/post-config)

## Why?
For use in processors such as [posthtml](https://github.com/posthtml/posthtml), [postcss](https://github.com/postcss/postcss), [reshape](https://github.com/reshape/reshape) or for plug-ins. Automatically finds all the modules and tries to match them with the executable processes.

## Install

```bash
$ npm install post-config 
```
> **Note:** This project is compatible with node v4+

## Example
package.json  
```json
"name": "my-post-project",
"devDependencies": {
    "posthtml": "^6.5.4",
    "posthtml-spaceless": "^6.5.4",
    "posthtml-custom-elements": "^5.2.6"
},
"posthtml":{
  "sync": false,
  "posthtml-custom-elements": {
    "defaultTag": "span"
  }
}
```

index.js  
```js
import posthtml from 'posthtml';
import postConfig from 'post-config';

const options = postConfig({namespace: ['posthtml']});
/*
  Return configuration object for posthtml processor.
  {
    sync: false,
    plugins: [
      'posthtml-spaceless',
      ['posthtml-custom-elements', {
        defaultTag: 'article'
      }]
    ]
  }
*/

const plugins = options.plugins.map(module => {
  let config = {};

  if (Array.isArray(module)) {
    [module, config] = module;
  }

  return require(module)(config);
});

const html = `
  <component>
    <h1>Super Title</h1>
    <text tag="p">Awesome Text</text>
    <spaceless>
    <ul>
      <li class="box-inline col-6">Link</li>
      <li class="box-inline col-6">Link</li>
    </ul>
    </spaceless>
  </component>
`;

posthtml(plugins)
  .process(html, options)
  .then(result => console.log(result.html));
/*
  Return result
  <article class="component">
    <h1>Super Title</h1>
        <p>Awesome Text</p>
        <ul><li class="box-inline col-6">Link</li><li class="box-inline col-6">Link</li></ul>
    </article>
*/
```


## Options
### `root`
Type: `String`  
Default: `"./"`  
Description: *Directory to find `package.json`*

### `nodeModules`
Type: `String|Boolean`  
Default: `node_modules`  
Description: *Directory to find modules relatively `root` dirictory. Set falsely is not necessary to look for modules in `node_modules`*

### `namespace`  
Type: `Array`  
Default: `[]`  
Description: *Makes a search and a resulting configuration object for specified namespaces*

### `extends`
Type: `Object`  
Default: `{}`  
Description: *Can extend configurations*

  - ### `config`
    Type: `Object`  
    Default: `{}`  
    Description: *Inherits, supplements, and extends the resulting configuration object*

  - ### `namespace`
    Type: `Array|String`  
    Default: `[]`  
    Description: *Expands the list of namespace for better matching of modules*

  - ### `modules`
    Type: `Array`  
    Default: `[]`  
    Description: *Inherits, supplements, and extends the resulting configuration object*

  - ### `whitelist`
    Type: `Object`  
    Default: [white-list.js](https://github.com/post/post-config/blob/master/src/white-list.js)  
    Description: *Expands the list of module to namespace relationships*

  - ### `blacklist`
    Type: `Array`  
    Default: [black-list.js](https://github.com/post/post-config/blob/master/src/black-list.js)  
    Description: *Modules necessary to ignore when building the final configuration object*
