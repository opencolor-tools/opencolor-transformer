'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.abstractRepeating = undefined;

var _factory = require('./factory');

var _opencolor = require('opencolor');

var _opencolor2 = _interopRequireDefault(_opencolor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultAbstractRepeatingOptions = {
  occurences: 2
};

var abstractRepeating = exports.abstractRepeating = (0, _factory.createTransformer)(defaultAbstractRepeatingOptions, function (tree, options) {
  return new Promise(function (resolve, reject) {
    var entryLookup = {};
    tree.transformEntries(function (entry) {
      var hexvalue = entry.hexcolor();
      if (!hexvalue) {
        return;
      }
      if (!(hexvalue in entryLookup)) {
        entryLookup[hexvalue] = [entry];
      } else {
        entryLookup[hexvalue].push(entry);
      }
    });
    Object.keys(entryLookup).forEach(function (k, index) {
      if (entryLookup[k].length < options.occurences) {
        return;
      }
      var newColorEntry = entryLookup[k][0].clone();
      newColorEntry.name = 'color' + (index + 1);
      tree.addChild(newColorEntry, false, index);
      var newPath = newColorEntry.path();
      entryLookup[k].forEach(function (entry) {
        var path = entry.path();
        var newRefrenceEntry = new _opencolor2.default.Reference(entry.name, newPath);
        tree.set(path, newRefrenceEntry);
      });
    });
    resolve(tree);
  });
});