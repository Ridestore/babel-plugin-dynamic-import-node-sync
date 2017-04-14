function getModule(path) {
  return require('test-module');
}

getModule().then(() => {});
