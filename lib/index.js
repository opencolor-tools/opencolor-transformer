'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.autoname = exports.compoundWords = exports.searchAndReplace = exports.flatten = exports.group = undefined;

var _regroup = require('./regroup');

var _rename = require('./rename');

exports.group = _regroup.group;
exports.flatten = _regroup.flatten;
exports.searchAndReplace = _rename.searchAndReplace;
exports.compoundWords = _rename.compoundWords;
exports.autoname = _rename.autoname;