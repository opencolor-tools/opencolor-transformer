import {createTransformer} from './factory'
import tinycolor from 'tinycolor2'

const defaultSortByHueOptions = {

}

export const sortByHue = createTransformer(defaultSortByHueOptions, (tree, options) => {
  function sortChildrenByHue (entry) {
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

      const aHue = tinycolor(a.hexcolor()).toHsv().h
      const bHue = tinycolor(b.hexcolor()).toHsv().h

      return Math.sign(aHue - bHue)
    })
  }

  return new Promise((resolve, reject) => {
    const transformed = tree.clone()

    transformed.traverseTree(['Palette'], sortChildrenByHue)
    sortChildrenByHue(transformed)

    resolve(transformed)
  })
})
