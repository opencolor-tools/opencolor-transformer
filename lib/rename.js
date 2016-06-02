'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.autoname = exports.compoundWords = exports.searchAndReplace = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _ntc = require('./utils/ntc');

var _factory = require('./factory');

var _humanizeString = require('humanize-string');

var _humanizeString2 = _interopRequireDefault(_humanizeString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultSearchAndReplaceOptions = {
  search: false,
  replace: false
};

var defaultCompundWordsOptions = {
  transform: 'humanize'
};

var defaultAutonameOptions = {
  transform: false,
  pool: 'xkcd'
};

var validNamePools = ['ntc', 'xkcd', 'css'];

var validTransforms = {
  'camelize': 'camelCase',
  'capitalize': 'startCase',
  'dasherize': 'kebabCase',
  'lowdasherize': 'snakeCase',
  'clean': 'deburr',
  'uppercase': function uppercase(s) {
    return s.toUpperCase();
  },
  'lowercase': function lowercase(s) {
    return s.toLowerCase();
  },
  'humanize': _humanizeString2.default
};

var searchAndReplace = exports.searchAndReplace = (0, _factory.createTransformer)(defaultSearchAndReplaceOptions, function (tree, options) {
  if (!options.search || !options.replace) {
    return Promise.resolve(tree);
  }

  return new Promise(function (resolve, reject) {
    tree.transformEntries(function (entry) {
      var path = entry.path();
      var newPath = path.replace(options.search, options.replace);
      if (newPath !== path) {
        if (newPath.indexOf('.') !== false) {
          entry.moveTo(newPath);
        } else {
          entry.rename(newPath);
        }
      }
    });
    resolve(tree);
  });
});

var compoundWords = exports.compoundWords = (0, _factory.createTransformer)(defaultCompundWordsOptions, function (tree, options) {
  if (!options.transform || Object.keys(validTransforms).indexOf(options.transform) === -1) {
    return Promise.reject(new Error('Invalid option transform: ' + options.transform + ' - choose one of ' + Object.keys(validTransforms).join(', ')));
  }

  var transformFunction = validTransforms[options.transform];
  if (_lodash2.default.isString(transformFunction)) {
    transformFunction = _lodash2.default[transformFunction];
  }
  return new Promise(function (resolve, reject) {
    tree.transformEntries(function (entry) {
      entry.rename(transformFunction(entry.name));
    });
    resolve(tree);
  });
});

var autoname = exports.autoname = (0, _factory.createTransformer)(defaultAutonameOptions, { scope: ['Color'] }, function (tree, options) {
  if (validNamePools.indexOf(options.pool) === -1) {
    return Promise.reject(new Error('Invalid option pool: ' + options.pool + ' - choose one of ' + validNamePools.join(', ')));
  }
  _ntc.ntc.init(options.pool);
  return new Promise(function (resolve, reject) {
    tree.transformEntries(function (entry) {
      entry.rename(_ntc.ntc.name(entry.hexcolor())[1]);
    });
    resolve(tree);
  });
});