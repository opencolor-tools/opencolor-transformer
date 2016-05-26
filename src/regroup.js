import {createTransformer} from './factory'

const defaultGroupOptions = {
  separator: ' ',
  direction: 'left',
  maxDepth: false
}

const defaultFoldOptions = {
  glue: ' ',
  direction: 'left',
  minDepth: false
}

const validDirections = ['left', 'right']

export const group = createTransformer(defaultGroupOptions, {'scope': ['Color', 'Reference']}, (tree, options) => {
  if (options.direction && validDirections.indexOf(options.direction) === -1) {
    return Promise.reject(new Error(`Invalid option direction: ${options.direction} - choose one of ${validDirections.join(', ')}`))
  }
  return new Promise((resolve, reject) => {
    const transformed = tree.clone()
    const changes = {}
    tree.transformEntries((entry) => {
      const parts = entry.name.split(options.separator)
      let path = parts.join('.')
      if (options.maxDepth && parts.length > options.maxDepth) {
        if (options.direction === 'left') {
          path = parts.slice(0, options.maxDepth).join('.') + '.' + parts.slice(options.maxDepth).join(options.separator)
        } else {
          path = parts.slice(0, -1 * options.maxDepth).join(options.separator) + '.' + parts.slice(-1 * options.maxDepth).join('.')
        }
      }
      changes[entry.path()] = path
      transformed.remove(entry.path())
      transformed.set(path, entry.clone())
    })
    // fix refrences
    tree.traverseTree(['Reference'], (entry) => {
      if (Object.keys(changes).indexOf(entry.absoluteRefName) !== 1) {
        entry.refName = changes[entry.absoluteRefName]
        transformed.set(changes[entry.path()], entry.clone())
      }
    })
    resolve(transformed)
  })
})

export const flatten = createTransformer(defaultFoldOptions, (tree, options) => {
  if (options.direction && validDirections.indexOf(options.direction) === -1) {
    return Promise.reject(new Error(`Invalid option direction: ${options.direction} - choose one of ${validDirections.join(', ')}`))
  }
  return new Promise((resolve, reject) => {
    const transformed = tree.clone()
    const changes = {}
    tree.transformEntries((entry) => {
      if (entry.type === 'Palette') {
        return
      }
      const parts = entry.path().split('.')
      let path = parts.join(options.glue)
      if (options.minDepth && parts.length > options.minDepth) {
        if (options.direction === 'left') {
          path = parts.slice(0, options.minDepth).join('.') + '.' + parts.slice(options.minDepth).join(options.glue)
        } else {
          path = parts.slice(0, -1 * options.minDepth).join(options.glue) + '.' + parts.slice(-1 * options.minDepth).join('.')
        }
      }
      changes[entry.path()] = path
      transformed.remove(entry.path())
      transformed.set(path, entry.clone())
    })
    // fix refrences
    tree.traverseTree(['Reference'], (entry) => {
      if (Object.keys(changes).indexOf(entry.absoluteRefName) !== 1) {
        entry.refName = changes[entry.absoluteRefName]
        transformed.set(changes[entry.path()], entry.clone())
      }
    })

    // remove empty groups
    function removeIfEmpty (entry) {
      if (!entry.children.length) {
        transformed.remove(entry.path())
        if (entry.parent) {
          removeIfEmpty(entry.parent)
        }
      }
    }
    transformed.traverseTree(['Palette'], removeIfEmpty)
    resolve(transformed)
  })
})
