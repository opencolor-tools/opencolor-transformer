import _ from 'lodash'
import transformerFactory from './factory.js'

const defaultOptions = {
  search: false,
  replace: false,
  transform: false,
  filter: false,
  scope: []
}

const validTransforms = {
  'camelize': 'camelCase',
  'capitalize': 'capitalize',
  'dasherize': 'kebabCase',
  'lowdasherize': 'snakeCase',
  'humanize': 'deburr'
}

const validScopes = ['Color', 'Reference', 'Palette']

export default transformerFactory(defaultOptions, (tree, options) => {
  if (options.transform && Object.keys(validTransforms).indexOf(options.transform) === -1) {
    return Promise.reject(new Error(`Invalid option transform: ${options.transform} - choose one of ${Object.keys(validTransforms).join(', ')}`))
  }
  if (typeof options.scope === 'string') {
    options.scope = [options.scope]
  }
  if (options.scope && options.scope.length && options.scope.some(scope => validScopes.indexOf(scope) === -1)) {
    return Promise.reject(new Error(`Invalid option scope: ${options.scope.join(', ')} - valid elements are ${validScopes.join(', ')}`))
  }
  if (!options.search && !options.transform) {
    return Promise.resolve(tree)
  }

  let isInSearchScope = () => true
  if (options.filter) {
    if (_.isRegExp(options.filter)) {
      isInSearchScope = (term) => options.filter.test(term)
    } else {
      isInSearchScope = (term) => (term.indexOf(options.filter) !== -1)
    }
  }
  return new Promise((resolve, reject) => {
    tree.traverseTree(options.scope, (entry) => {
      if (!isInSearchScope(entry.name)) {
        return
      }
      if (options.replace) {
        entry.name = entry.name.replace(options.search, options.replace)
      } else if (options.transform) {
        entry.name = _[validTransforms[options.transform]](entry.name)
      }
    })
    resolve(tree)
  })
})
