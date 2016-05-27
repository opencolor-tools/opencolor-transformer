'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortByHue = undefined;

var _factory = require('./factory');

var _tinycolor = require('tinycolor2');

var _tinycolor2 = _interopRequireDefault(_tinycolor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultSortByHueOptions = {};

var sortByHue = exports.sortByHue = (0, _factory.createTransformer)(defaultSortByHueOptions, function (tree, options) {
  function sortChildrenByHue(entry) {
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

      var aHue = (0, _tinycolor2.default)(a.hexcolor()).toHsv().h;
      var bHue = (0, _tinycolor2.default)(b.hexcolor()).toHsv().h;

      return Math.sign(aHue - bHue);
    });
  }

  return new Promise(function (resolve, reject) {
    var transformed = tree.clone();

    transformed.traverseTree(['Palette'], sortChildrenByHue);
    sortChildrenByHue(transformed);

    resolve(transformed);
  });
});