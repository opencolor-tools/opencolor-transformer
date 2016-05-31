'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.abstractRepeating = undefined;

var _factory = require('./factory');

var _ntc = require('./utils/ntc');

var _opencolor = require('opencolor');

var _opencolor2 = _interopRequireDefault(_opencolor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultAbstractRepeatingOptions = {
  occurences: 2,
  autoname: false,
  palette: 'extracted'
};

var abstractRepeating = exports.abstractRepeating = (0, _factory.createTransformer)(defaultAbstractRepeatingOptions, { scope: ['Color'] }, function (tree, options) {
  var name = function name(value, index) {
    return 'color' + (index + 1);
  };
  if (options.autoname) {
    (function () {
      _ntc.ntc.init('xkcd');
      var usedNames = {};
      name = function name(value, index) {
        var suggestion = _ntc.ntc.name(value)[1];
        if (Object.keys(usedNames).indexOf(suggestion) !== -1) {
          return suggestion + ' ' + usedNames[suggestion]++;
        }
        usedNames[suggestion] = 1;
        return suggestion;
      };
    })();
  }
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
    var addedColors = 0;
    var paletteForExtractedColors = tree;
    if (options.palette) {
      if (tree.children.every(function (entry) {
        return entry.type === 'Color' || entry.type === 'Reference';
      })) {
        // save renderer, only swatchentries: do not allow creation of sub-palette for extracted
      } else {
          var existingPalette = tree.get(options.palette);
          if (existingPalette) {
            paletteForExtractedColors = existingPalette;
          } else {
            paletteForExtractedColors = new _opencolor2.default.Entry(options.palette.replace('.', ''), [], 'Palette');
            tree.addChild(paletteForExtractedColors, false, 0);
          }
        }
    }
    Object.keys(entryLookup).forEach(function (k, index) {
      if (entryLookup[k].length < options.occurences) {
        return;
      }
      var newColorEntry = entryLookup[k][0].clone();
      newColorEntry.name = name(newColorEntry.hexcolor(), index);

      paletteForExtractedColors.addChild(newColorEntry, false, addedColors++);
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