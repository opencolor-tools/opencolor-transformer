'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.abstractRepeating = undefined;

var _factory = require('./factory.js');

var _factory2 = _interopRequireDefault(_factory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultAbstractRepeatingOptions = {
  occurences: 2
};

var abstractRepeating = exports.abstractRepeating = (0, _factory2.default)(defaultAbstractRepeatingOptions, function (tree, options) {
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
    Object.keys(entryLookup).forEach(function (k) {
      if (entryLookup[k].length < options.occurences) {
        return;
      }
      tree.set('abstractedColor.color' + k, entryLookup[k][0]);
    });
    resolve(tree);
  });
});