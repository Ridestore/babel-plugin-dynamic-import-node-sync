# babel-plugin-dynamic-import-node-sync

Babel **6** plugin to transpile async `import()` to sync a `require()`, for node. Matches the [proposed spec](https://github.com/domenic/proposal-import-function).

I am using it for server-side rendering.

## Difference from babel-plugin-dynamic-import-node

**babel-plugin-dynamic-import-node-sync**
```
import(SOURCE) => () => { const r=require(SOURCE);r.then(cb=>cb(r));return r; }()
```

**babel-plugin-dynamic-import-node**
```
import(SOURCE) => Promise.resolve().then(() => require(SOURCE))
```

## Installation

```sh
$ npm install @ridestore/babel-plugin-dynamic-import-node-sync --save-dev
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": [
    ["@ridestore/babel-plugin-dynamic-import-node-sync", { "target": "sync" }]
  ]
}
```


## Options

### opts.target

Script is looking for ```import()``` with comment provided in ``target`` field, example:

```js
// .babelrc
{
  "plugins": [
    ["@ridestore/babel-plugin-dynamic-import-node-sync", { "target": "sync" }]
  ]
}

// index.js
const component = import(/* sync */ './path/to/component').then(module => module.MyComponent);
// will be replaced with
const component = (()=>{const r=__webpack_require__(666);r.then=cb=>cb(r);return r;})().then(module => module.MyComponent);
```

Otherwise, if you initiate plugin without ``target`` option, it replaces all ```import()``` calls 
