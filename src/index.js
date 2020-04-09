import template from 'babel-template';
import syntax from 'babel-plugin-syntax-dynamic-import';
import * as t from 'babel-types';

const TYPE_IMPORT = 'Import';

const buildImport = template(`
  const r = require(SOURCE);r.then = cb => cb(r);return r;
`);

const build = (path, argument) => path.replaceWithMultiple(buildImport({
  SOURCE: (t.isStringLiteral(argument) || t.isTemplateLiteral(argument))
      ? path.node.arguments
      : t.templateLiteral([t.templateElement({ raw: '' }), t.templateElement({ raw: '' }, true)], path.node.arguments),
}));

export default () => ({
  inherits: syntax,
  visitor: {
    // eslint-disable-next-line consistent-return
    CallExpression(path, { opts }) {
      if (path.node.callee.type === TYPE_IMPORT) {
        const importArgument = path.node.arguments[0];

        if (opts && !opts.target) {
          return build(path, importArgument);
        }

        (importArgument.leadingComments || [])
          // eslint-disable-next-line max-len
          .filter(comment => comment && comment.value && comment.value.trim().toLowerCase() === opts.target)
          .slice(0, 1)
          .forEach(() => build(path, importArgument));
      }
    },
  },
});
