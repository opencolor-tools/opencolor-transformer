import _ from 'lodash'
import transformerFactory from './factory.js'

const defaultGroupOptions = {
  spilt: ' ',
  glue: ' ',
  direction: 'left',
  maxDepth: false
}

const defaultFoldOptions = {
  glue: ' ',
  direction: 'left',
  keepDepth: false
}

const validDirections = ['left', 'right']

export const group = transformerFactory(defaultGroupOptions, (tree, options) => {
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

export const fold = transformerFactory(defaultFoldOptions, (tree, options) => {
  if (options.direction && validDirections.indexOf(options.direction) === -1) {
    return Promise.reject(new Error(`Invalid option direction: ${options.direction} - choose one of ${validDirections.join(', ')}`))
  }
  return new Promise((resolve, reject) => {
    const transformed = tree.clone()
    tree.traverseTree(options.scope, (entry) => {
      const parts = entry.path().split('.')
      let path = parts.join(options.glue)
      if (options.keepDepth && parts.length > options.keepDepth) {
        if (options.direction === 'left') {
          path = parts.slice(0, options.keepDepth).join('.') + '.' + parts.slice(options.keepDepth).join(options.glue)
        } else {
          path = parts.slice(0, -1 * options.keepDepth).join(options.glue) + '.' + parts.slice(-1 * options.keepDepth).join('.')
        }
      }
      transformed.remove(entry.path())
      transformed.set(path, entry)
    })
    // remove empty groups
    transformed.traverseTree(['Palette'], (entry) => {
      if (!entry.children.length) {
        transformed.remove(entry.path())
      }
    })
    resolve(transformed)
  })
})
