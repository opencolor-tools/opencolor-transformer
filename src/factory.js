const defaultTransformerOptions = {
  filter: false,
  scope: []
}

const validScopes = ['Color', 'Reference', 'Palette']

export const createTransformer = function (defaultOptions, enforcedOptions, func = null) {
  if (func == null) {
    func = enforcedOptions
    enforcedOptions = {}
  }

  const transformer = (tree, configuration) => {
    const toBeTransformed = tree.clone()
    const options = Object.assign({}, defaultOptions, defaultTransformerOptions, configuration, enforcedOptions)

    if (typeof options.scope === 'string') {
      options.scope = [options.scope]
    }
    if (options.scope && options.scope.length && options.scope.some(scope => validScopes.indexOf(scope) === -1)) {
      return Promise.reject(new Error(`Invalid option scope: ${options.scope.join(', ')} - valid elements are ${validScopes.join(', ')}`))
    }
    let isInSearchScope = () => true
    if (options.filter) {
      if (options.filter instanceof RegExp) {
        isInSearchScope = (term) => options.filter.test(term)
      } else {
        isInSearchScope = (term) => (term.indexOf(options.filter) !== -1)
      }
    }
    toBeTransformed.transformEntries = (cb) => {
      toBeTransformed.traverseTree(options.scope, (entry) => {
        if (!isInSearchScope(entry.name)) {
          return
        }
        cb(entry)
      })
    }
    return func(toBeTransformed, options)
  }

  transformer.configure = function (options) {
    return createConfigurableTransformer(transformer)(options)
  }
  return transformer
}

export const createConfigurableTransformer = function (transformer) {
  return function (options) {
    return function (tree) {
      return transformer(tree, options)
    }
  }
}
