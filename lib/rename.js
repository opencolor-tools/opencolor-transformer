'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.autoname = exports.compoundWords = exports.searchAndReplace = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _ntc = require('./utils/ntc');

var _factory = require('./factory.js');

var _factory2 = _interopRequireDefault(_factory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultSearchAndReplaceOptions = {
  search: false,
  replace: false
};

var defaultCompundWordsOptions = {
  transform: false
};

var defaultAutonameOptions = {
  transform: false,
  scope: ['Color']
};

var validTransforms = {
  'camelize': 'camelCase',
  'capitalize': 'capitalize',
  'dasherize': 'kebabCase',
  'lowdasherize': 'snakeCase',
  'humanize': 'deburr'
};

var searchAndReplace = exports.searchAndReplace = (0, _factory2.default)(defaultSearchAndReplaceOptions, function (tree, options) {
  if (!options.search || !options.replace) {
    return Promise.resolve(tree);
  }

  return new Promise(function (resolve, reject) {
    tree.transformEntries(function (entry) {
      entry.name = entry.name.replace(options.search, options.replace);
    });
    resolve(tree);
  });
});

var compoundWords = exports.compoundWords = (0, _factory2.default)(defaultCompundWordsOptions, function (tree, options) {
  if (options.transform && Object.keys(validTransforms).indexOf(options.transform) === -1) {
    return Promise.reject(new Error('Invalid option transform: ' + options.transform + ' - choose one of ' + Object.keys(validTransforms).join(', ')));
  }

  return new Promise(function (resolve, reject) {
    tree.transformEntries(function (entry) {
      entry.name = _lodash2.default[validTransforms[options.transform]](entry.name);
    });
    resolve(tree);
  });
});

var autoname = exports.autoname = (0, _factory2.default)(defaultAutonameOptions, function (tree, options) {
  return new Promise(function (resolve, reject) {
    tree.transformEntries(function (entry) {
      entry.name = _ntc.ntc.name(entry.hexcolor())[1];
    });
    resolve(tree);
  });
});