import _ from 'lodash'
import {ntc} from './utils/ntc'
import {createTransformer} from './factory'
import humanizeString from 'humanize-string'

const defaultSearchAndReplaceOptions = {
  search: false,
  replace: false
}

const defaultCompundWordsOptions = {
  transform: 'humanize'
}

const defaultAutonameOptions = {
  transform: false,
  pool: 'xkcd'
}

const validNamePools = ['ntc', 'xkcd', 'css']

const validTransforms = {
  'camelize': 'camelCase',
  'capitalize': 'startCase',
  'dasherize': 'kebabCase',
  'lowdasherize': 'snakeCase',
  'clean': 'deburr',
  'uppercase': (s) => s.toUpperCase(),
  'lowercase': (s) => s.toLowerCase(),
  'humanize': humanizeString
}

export const searchAndReplace = createTransformer(defaultSearchAndReplaceOptions, (tree, options) => {
  if (!options.search || !options.replace) {
    return Promise.resolve(tree)
  }

  return new Promise((resolve, reject) => {
    tree.transformEntries((entry) => {
      entry.rename(entry.name.replace(options.search, options.replace))
    })
    resolve(tree)
  })
})

export const compoundWords = createTransformer(defaultCompundWordsOptions, (tree, options) => {
  if (!options.transform || Object.keys(validTransforms).indexOf(options.transform) === -1) {
    return Promise.reject(new Error(`Invalid option transform: ${options.transform} - choose one of ${Object.keys(validTransforms).join(', ')}`))
  }

  let transformFunction = validTransforms[options.transform]
  if (_.isString(transformFunction)) {
    transformFunction = _[transformFunction]
  }
  return new Promise((resolve, reject) => {
    tree.transformEntries((entry) => {
      entry.rename(transformFunction(entry.name))
    })
    resolve(tree)
  })
})

export const autoname = createTransformer(defaultAutonameOptions, {scope: ['Color']}, (tree, options) => {
  if (validNamePools.indexOf(options.pool) === -1) {
    return Promise.reject(new Error(`Invalid option pool: ${options.pool} - choose one of ${validNamePools.join(', ')}`))
  }
  ntc.init(options.pool)
  return new Promise((resolve, reject) => {
    tree.transformEntries((entry) => {
      entry.rename(ntc.name(entry.hexcolor())[1])
    })
    resolve(tree)
  })
})
