import {createTransformer} from './factory'
import tinycolor from 'tinycolor2'

const defaultSortByHueOptions = {
  sortBy: 'hue',
  order: 'asc'
}

const validSortBy = ['hue', 'saturation', 'value']
const validOrder = ['asc', 'desc']

export const sort = createTransformer(defaultSortByHueOptions, (tree, options) => {
  if (validSortBy.indexOf(options.sortBy) === -1) {
    return Promise.reject(new Error(`Invalid option sortBy: ${options.sortBy} - choose one of ${validSortBy.join(',  ')}`))
  }

  if (validOrder.indexOf(options.order) === -1) {
    return Promise.reject(new Error(`Invalid option order: ${options.order} - choose one of ${validOrder.join(',  ')}`))
  }

  function sortChildren (entry) {
    entry.children.sort((a, b) => {
      if (a.type === 'Palette' || b.type === 'Palette') {
        return 0
      }

      if (a.type === 'Reference') {
        a = a.resolved()
      }

      if (b.type === 'Reference') {
        b = b.resolved()
      }

      let aValue = 0
      let bValue = 0

      if (options.sortBy === 'hue') {
        aValue = tinycolor(a.hexcolor()).toHsv().h
        bValue = tinycolor(b.hexcolor()).toHsv().h
      } else if (options.sortBy === 'saturation') {
        aValue = tinycolor(a.hexcolor()).toHsv().s
        bValue = tinycolor(b.hexcolor()).toHsv().s
      } else if (options.sortBy === 'value') {
        aValue = tinycolor(a.hexcolor()).toHsv().v
        bValue = tinycolor(b.hexcolor()).toHsv().v
      }

      if (options.order === 'asc') {
        return Math.sign(aValue - bValue)
      } else if (options.order === 'desc') {
        return Math.sign(bValue - aValue)
      }
    })
  }

  return new Promise((resolve, reject) => {
    const transformed = tree.clone()

    transformed.traverseTree(['Palette'], sortChildren)
    sortChildren(transformed)

    resolve(transformed)
  })
})
