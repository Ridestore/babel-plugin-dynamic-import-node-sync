'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports['default'] = function (_ref) {
  var template = _ref.template,
      t = _ref.types;

  var buildImport = template('\n    const r = require(SOURCE);r.then = cb => cb(r);return r;\n  ');

  var build = function () {
    function build(path, importArguments) {
      var isString = t.isStringLiteral(importArguments[0]) || t.isTemplateLiteral(importArguments[0]);

      if (isString) {
        t.removeComments(importArguments[0]);
      }
      var newImport = buildImport({
        SOURCE: isString ? importArguments : t.templateLiteral([t.templateElement({ raw: '', cooked: '' }), t.templateElement({ raw: '', cooked: '' }, true)], importArguments)
      });
      path.parentPath.replaceWithMultiple(newImport);
    }

    return build;
  }();

  return {
    inherits: _pluginSyntaxDynamicImport2['default'],
    visitor: {
      Import: function () {
        function Import(path, _ref2) {
          var opts = _ref2.opts;

          var importArguments = path.parentPath.node.arguments;

          if (opts && !opts.target) {
            return build(path, importArguments);
          }

          (importArguments[0].leadingComments || []).
          // eslint-disable-next-line max-len
          filter(function (comment) {
            return comment && comment.value && comment.value.trim().toLowerCase() === opts.target;
          }).slice(0, 1).forEach(function () {
            return build(path, importArguments);
          });
        }

        return Import;
      }()
    }
  };
};

var _pluginSyntaxDynamicImport = require('@babel/plugin-syntax-dynamic-import');

var _pluginSyntaxDynamicImport2 = _interopRequireDefault(_pluginSyntaxDynamicImport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }