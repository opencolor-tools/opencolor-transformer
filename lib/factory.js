'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (defaultOptions, func) {
  return function (tree, configuration) {
    var toBeTransformed = tree.clone();
    var options = Object.assign({}, defaultOptions, defaultTransformerOptions, configuration);

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
};

var defaultTransformerOptions = {
  filter: false,
  scope: []
};

var validScopes = ['Color', 'Reference', 'Palette'];