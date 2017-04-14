require('test-module').then(() => require('test-module-2'));

Promise.all([require('test-1'), require('test-2'), require('test-3')]).then(() => {});
