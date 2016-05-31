'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sort = undefined;

var _factory = require('./factory');

var _tinycolor = require('tinycolor2');

var _tinycolor2 = _interopRequireDefault(_tinycolor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultSortByHueOptions = {
  sortBy: 'hue',
  order: 'asc'
};

var validSortBy = ['hue', 'saturation', 'value'];
var validOrder = ['asc', 'desc'];

var sort = exports.sort = (0, _factory.createTransformer)(defaultSortByHueOptions, function (tree, options) {
  if (validSortBy.indexOf(options.sortBy) === -1) {
    return Promise.reject(new Error('Invalid option sortBy: ' + options.sortBy + ' - choose one of ' + validSortBy.join(',  ')));
  }

  if (validOrder.indexOf(options.order) === -1) {
    return Promise.reject(new Error('Invalid option order: ' + options.order + ' - choose one of ' + validOrder.join(',  ')));
  }

  function sortChildren(entry) {
    entry.children.sort(function (a, b) {
      if (a.type === 'Palette' || b.type === 'Palette') {
        return 0;
      }

      if (a.type === 'Reference') {
        a = a.resolved();
      }

      if (b.type === 'Reference') {
        b = b.resolved();
      }

      var aValue = 0;
      var bValue = 0;

      if (options.sortBy === 'hue') {
        aValue = (0, _tinycolor2.default)(a.hexcolor()).toHsv().h;
        bValue = (0, _tinycolor2.default)(b.hexcolor()).toHsv().h;
      } else if (options.sortBy === 'saturation') {
        aValue = (0, _tinycolor2.default)(a.hexcolor()).toHsv().s;
        bValue = (0, _tinycolor2.default)(b.hexcolor()).toHsv().s;
      } else if (options.sortBy === 'value') {
        aValue = (0, _tinycolor2.default)(a.hexcolor()).toHsv().v;
        bValue = (0, _tinycolor2.default)(b.hexcolor()).toHsv().v;
      }

      if (options.order === 'asc') {
        return Math.sign(aValue - bValue);
      } else if (options.order === 'desc') {
        return Math.sign(bValue - aValue);
      }
    });
  }

  return new Promise(function (resolve, reject) {
    var transformed = tree.clone();

    transformed.traverseTree(['Palette'], sortChildren);
    sortChildren(transformed);

    resolve(transformed);
  });
});