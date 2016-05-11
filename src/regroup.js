import _ from 'lodash'
import transformerFactory from './factory.js'

const defaultOptions = {
  spilt: ' ',
  direction: 'left',
  maxDepth: false
}

const validDirections = ['left', 'right']

export const group = transformerFactory(defaultOptions, (tree, options) => {
  if (options.direction && validDirections.indexOf(options.direction) === -1) {
    return Promise.reject(new Error(`Invalid option direction: ${options.direction} - choose one of ${validDirections.join(', ')}`))
  }
  return new Promise((resolve, reject) => {
    const transformed = tree.clone()
    tree.traverseTree(options.scope, (entry) => {
      const parts = entry.name.split(options.split)
      let path = parts.join('.')
      if (options.maxDepth && parts.length > options.maxDepth) {
        if (options.direction === 'left') {
          path = parts.slice(0, options.maxDepth).join('.') + '.' + parts.slice(options.maxDepth).join(options.split)
        } else {
          path = parts.slice(0, -1 * options.maxDepth).join(options.split) + '.' + parts.slice(-1 * options.maxDepth).join('.')
        }
      }
      transformed.remove(entry.path())
      transformed.set(path, entry)
    })
    resolve(transformed)
  })
})
