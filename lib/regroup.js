'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flatten = exports.group = undefined;

var _factory = require('./factory.js');

var _factory2 = _interopRequireDefault(_factory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultGroupOptions = {
  spilt: ' ',
  direction: 'left',
  maxDepth: false
};

var defaultFoldOptions = {
  glue: ' ',
  direction: 'left',
  minDepth: false
};

var validDirections = ['left', 'right'];

var group = exports.group = (0, _factory2.default)(defaultGroupOptions, function (tree, options) {
  if (options.direction && validDirections.indexOf(options.direction) === -1) {
    return Promise.reject(new Error('Invalid option direction: ' + options.direction + ' - choose one of ' + validDirections.join(', ')));
  }
  return new Promise(function (resolve, reject) {
    var transformed = tree.clone();
    tree.transformEntries(function (entry) {
      var parts = entry.name.split(options.split);
      var path = parts.join('.');
      if (options.maxDepth && parts.length > options.maxDepth) {
        if (options.direction === 'left') {
          path = parts.slice(0, options.maxDepth).join('.') + '.' + parts.slice(options.maxDepth).join(options.split);
        } else {
          path = parts.slice(0, -1 * options.maxDepth).join(options.split) + '.' + parts.slice(-1 * options.maxDepth).join('.');
        }
      }
      transformed.remove(entry.path());
      transformed.set(path, entry);
    });
    resolve(transformed);
  });
});

var flatten = exports.flatten = (0, _factory2.default)(defaultFoldOptions, function (tree, options) {
  if (options.direction && validDirections.indexOf(options.direction) === -1) {
    return Promise.reject(new Error('Invalid option direction: ' + options.direction + ' - choose one of ' + validDirections.join(', ')));
  }
  return new Promise(function (resolve, reject) {
    var transformed = tree.clone();
    tree.transformEntries(function (entry) {
      var parts = entry.path().split('.');
      var path = parts.join(options.glue);
      if (options.minDepth && parts.length > options.minDepth) {
        if (options.direction === 'left') {
          path = parts.slice(0, options.minDepth).join('.') + '.' + parts.slice(options.minDepth).join(options.glue);
        } else {
          path = parts.slice(0, -1 * options.minDepth).join(options.glue) + '.' + parts.slice(-1 * options.minDepth).join('.');
        }
      }
      transformed.remove(entry.path());
      transformed.set(path, entry);
    });
    // remove empty groups
    transformed.traverseTree(['Palette'], function (entry) {
      if (!entry.children.length) {
        transformed.remove(entry.path());
      }
    });
    resolve(transformed);
  });
});