import _ from 'lodash'
import transformerFactory from './factory.js'

const defaultSearchAndReplaceOptions = {
  search: false,
  replace: false
}

const defaultCompundWordsOptions = {
  transform: false
}

const validTransforms = {
  'camelize': 'camelCase',
  'capitalize': 'capitalize',
  'dasherize': 'kebabCase',
  'lowdasherize': 'snakeCase',
  'humanize': 'deburr'
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

  return new Promise((resolve, reject) => {
    tree.transformEntries((entry) => {
      entry.name = _[validTransforms[options.transform]](entry.name)
    })
    resolve(tree)
  })
})
