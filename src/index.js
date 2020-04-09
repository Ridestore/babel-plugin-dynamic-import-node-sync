import template from 'babel-template';
import syntax from 'babel-plugin-syntax-dynamic-import';
import * as t from 'babel-types';

const TYPE_IMPORT = 'Import';

const buildImport = template(`
  const r = require(SOURCE);r.then = cb => cb(r);return r;
`);

export default () => ({
  inherits: syntax,
  visitor: {
    CallExpression(path) {
      if (path.node.callee.type === TYPE_IMPORT) {
        const importArgument = path.node.arguments[0];
        const syncComment = importArgument[1];

        if (!syncComment || !syncComment.value || !(syncComment.value.trim().toLowerCase() === 'sync')) {
          return;
        }

        path.replaceWithMultiple(buildImport({
          SOURCE: (t.isStringLiteral(importArgument) || t.isTemplateLiteral(importArgument))
            ? path.node.arguments
            : t.templateLiteral([t.templateElement({ raw: '' }), t.templateElement({ raw: '' }, true)], path.node.arguments),
        }));
      }
    },
  },
});
