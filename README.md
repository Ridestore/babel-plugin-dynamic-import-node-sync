# babel-plugin-dynamic-import-node-sync

Babel plugin to transpile `import()` to a `require()`, for node. Matches the [proposed spec](https://github.com/domenic/proposal-import-function).

**NOTE:** Babylon >= v6.12.0 is required to correct parse dynamic imports.

I am using it for server-side rendering.

## Difference from babel-plugin-dynamic-import-node

**babel-plugin-dynamic-import-node-sync**
```
import(SOURCE) => require(SOURCE)
```

**babel-plugin-dynamic-import-node**
```
import(SOURCE) => Promise.resolve().then(() => require(SOURCE))
```

## Installation

```sh
$ npm install babel-plugin-dynamic-import-node-sync --save-dev
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["dynamic-import-node-sync"]
}
```

### Via CLI

```sh
$ babel --plugins dynamic-import-node-sync script.js
```

### Via Node API

```javascript
require('babel-core').transform('code', {
  plugins: ['dynamic-import-node-sync']
});
```
