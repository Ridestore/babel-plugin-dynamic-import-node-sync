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
  "plugins": ["@ridestore/babel-plugin-dynamic-import-node-sync"]
}
```
