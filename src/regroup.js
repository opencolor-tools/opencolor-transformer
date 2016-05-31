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
      entry.moveTo(path)
    })
    resolve(tree)
  })
})

export const flatten = createTransformer(defaultFoldOptions, (tree, options) => {
  if (options.direction && validDirections.indexOf(options.direction) === -1) {
    return Promise.reject(new Error(`Invalid option direction: ${options.direction} - choose one of ${validDirections.join(', ')}`))
  }
  return new Promise((resolve, reject) => {
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
      entry.moveTo(path)
    })

    // remove empty groups
    function removeIfEmpty (entry) {
      if (!entry.children.length) {
        tree.remove(entry.path())
        if (entry.parent) {
          removeIfEmpty(entry.parent)
        }
      }
    }
    tree.traverseTree(['Palette'], removeIfEmpty)
    resolve(tree)
  })
})
