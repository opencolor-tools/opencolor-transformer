'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sort = exports.abstractRepeating = exports.autoname = exports.compoundWords = exports.searchAndReplace = exports.flatten = exports.group = undefined;

var _regroup = require('./regroup');

var _rename = require('./rename');

var _systemize = require('./systemize');

var _sort = require('./sort');

exports.group = _regroup.group;
exports.flatten = _regroup.flatten;
exports.searchAndReplace = _rename.searchAndReplace;
exports.compoundWords = _rename.compoundWords;
exports.autoname = _rename.autoname;
exports.abstractRepeating = _systemize.abstractRepeating;
exports.sort = _sort.sort;