import syntax from '@babel/plugin-syntax-dynamic-import';

export default function ({ template, types: t }) {
  const buildImport = template(`
    const r = require(SOURCE);r.then = cb => cb(r);return r;
  `);

  const build = (path, importArguments) => path.replaceWithMultiple(buildImport({
    SOURCE: (t.isStringLiteral(importArguments[0]) || t.isTemplateLiteral(importArguments[0]))
        ? importArguments
        : t.templateLiteral([t.templateElement({ raw: '' }), t.templateElement({ raw: '' }, true)], importArguments),
  }));

  return {
    inherits: syntax,
    visitor: {
      Import(path, { opts }) {
        const importArguments = path.parentPath.node.arguments;
        const importArgument = importArguments[0];

        if (opts && !opts.target) {
          return build(path, importArguments);
        }

        (importArgument.leadingComments || [])
          // eslint-disable-next-line max-len
          .filter(comment => comment && comment.value && comment.value.trim().toLowerCase() === opts.target)
          .slice(0, 1)
          .forEach(() => build(path, importArguments));

        // const isString = t.isStringLiteral(importArgument) || t.isTemplateLiteral(importArgument);

        // if (isString) {
        //   t.removeComments(importArguments[0]);
        // }
        // const newImport = buildImport({
        //   SOURCE: (isString)
        //     ? importArguments
        //     : t.templateLiteral([
        //       t.templateElement({ raw: '', cooked: '' }),
        //       t.templateElement({ raw: '', cooked: '' }, true),
        //     ], importArguments),
        // });
        // path.parentPath.replaceWith(newImport);
      },
    },
  };
}