/* eslint-disable consistent-return */
/* eslint-disable max-len */
import syntax from '@babel/plugin-syntax-dynamic-import';

export default function ({ template, types: t }) {
  const buildImport = template(`
    const r = require(SOURCE);r.then = cb => cb(r);return r;
  `);

  const build = (path, importArguments) => {
    const isString = t.isStringLiteral(importArguments[0]) || t.isTemplateLiteral(importArguments[0]);

    if (isString) {
      t.removeComments(importArguments[0]);
    }
    const newImport = buildImport({
      SOURCE: (isString)
        ? importArguments
        : t.templateLiteral([
          t.templateElement({ raw: '', cooked: '' }),
          t.templateElement({ raw: '', cooked: '' }, true),
        ], importArguments),
    });
    path.parentPath.replaceWithMultiple(newImport);
  };

  return {
    inherits: syntax,
    visitor: {
      Import(path, { opts }) {
        const importArguments = path.parentPath.node.arguments;

        if (opts && !opts.target) {
          return build(path, importArguments);
        }

        (importArguments[0].leadingComments || [])
          // eslint-disable-next-line max-len
          .filter(comment => comment && comment.value && comment.value.trim().toLowerCase() === opts.target)
          .slice(0, 1)
          .forEach(() => build(path, importArguments));
      },
    },
  };
}