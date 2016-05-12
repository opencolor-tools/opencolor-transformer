import _ from 'lodash'
import {ntc} from './utils/ntc'
import transformerFactory from './factory.js'
import humanizeString from 'humanize-string'

const defaultSearchAndReplaceOptions = {
  search: false,
  replace: false
}

const defaultCompundWordsOptions = {
  transform: false
}

const defaultAutonameOptions = {
  transform: false,
  scope: ['Color']
}

const validTransforms = {
  'camelize': 'camelCase',
  'capitalize': 'capitalize',
  'dasherize': 'kebabCase',
  'lowdasherize': 'snakeCase',
  'clean': 'deburr',
  'humanize': humanizeString
}

export const searchAndReplace = transformerFactory(defaultSearchAndReplaceOptions, (tree, options) => {
  if (!options.search || !options.replace) {
    return Promise.resolve(tree)
  }

  return new Promise((resolve, reject) => {
    tree.transformEntries((entry) => {
      entry.name = entry.name.replace(options.search, options.replace)
    })
    resolve(tree)
  })
})

export const compoundWords = transformerFactory(defaultCompundWordsOptions, (tree, options) => {
  if (options.transform && Object.keys(validTransforms).indexOf(options.transform) === -1) {
    return Promise.reject(new Error(`Invalid option transform: ${options.transform} - choose one of ${Object.keys(validTransforms).join(', ')}`))
  }

  let transformFunction = validTransforms[options.transform]
  if (_.isString(transformFunction)) {
    transformFunction = _[transformFunction]
  }
  return new Promise((resolve, reject) => {
    tree.transformEntries((entry) => {
      entry.name = transformFunction(entry.name)
    })
    resolve(tree)
  })
})

export const autoname = transformerFactory(defaultAutonameOptions, (tree, options) => {
  return new Promise((resolve, reject) => {
    tree.transformEntries((entry) => {
      entry.name = ntc.name(entry.hexcolor())[1]
    })
    resolve(tree)
  })
})
