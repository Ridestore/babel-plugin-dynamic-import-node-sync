import template from 'babel-template';
import syntax from 'babel-plugin-syntax-dynamic-import';

const TYPE_IMPORT = 'Import';

const buildImport = template(`
  Promise.resolve().then(() => {
    return require(SOURCE);
  })
`);

export default () => ({
  inherits: syntax,

  visitor: {
    CallExpression(path) {
      if (path.node.callee.type === TYPE_IMPORT) {
        const newImport = buildImport({
          SOURCE: path.node.arguments,
        });
        path.replaceWith(newImport);
      }
    },
  },
});
