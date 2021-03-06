'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var defaultTransformerOptions = {
  filter: false,
  scope: []
};

var validScopes = ['Color', 'Reference', 'Palette'];

var createTransformer = exports.createTransformer = function createTransformer(defaultOptions, enforcedOptions) {
  var func = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  if (func == null) {
    func = enforcedOptions;
    enforcedOptions = {};
  }

  var transformer = function transformer(tree, configuration) {
    var toBeTransformed = tree.clone();
    var options = _extends({}, defaultOptions, defaultTransformerOptions, configuration, enforcedOptions);

    if (typeof options.scope === 'string') {
      options.scope = [options.scope];
    }
    if (options.scope && options.scope.length && options.scope.some(function (scope) {
      return validScopes.indexOf(scope) === -1;
    })) {
      return Promise.reject(new Error('Invalid option scope: ' + options.scope.join(', ') + ' - valid elements are ' + validScopes.join(', ')));
    }
    var isInSearchScope = function isInSearchScope() {
      return true;
    };
    if (options.filter) {
      if (options.filter instanceof RegExp) {
        isInSearchScope = function isInSearchScope(term) {
          return options.filter.test(term);
        };
      } else {
        isInSearchScope = function isInSearchScope(term) {
          return term.indexOf(options.filter) !== -1;
        };
      }
    }
    toBeTransformed.transformEntries = function (cb) {
      toBeTransformed.traverseTree(options.scope, function (entry) {
        if (!isInSearchScope(entry.name)) {
          return;
        }
        cb(entry);
      });
    };
    return func(toBeTransformed, options);
  };

  transformer.configure = function (options) {
    return createConfigurableTransformer(transformer)(options);
  };
  return transformer;
};

var createConfigurableTransformer = exports.createConfigurableTransformer = function createConfigurableTransformer(transformer) {
  return function (options) {
    return function (tree) {
      return transformer(tree, options);
    };
  };
};