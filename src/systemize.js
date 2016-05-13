import {createTransformer} from './factory'
import oco from 'opencolor'

const defaultAbstractRepeatingOptions = {
  occurences: 2
}

export const abstractRepeating = createTransformer(defaultAbstractRepeatingOptions, (tree, options) => {
  return new Promise((resolve, reject) => {
    let entryLookup = {}
    tree.transformEntries((entry) => {
      let hexvalue = entry.hexcolor()
      if (!hexvalue) {
        return
      }
      if (!(hexvalue in entryLookup)) {
        entryLookup[hexvalue] = [entry]
      } else {
        entryLookup[hexvalue].push(entry)
      }
    })
    Object.keys(entryLookup).forEach((k, index) => {
      if (entryLookup[k].length < options.occurences) {
        return
      }
      const newColorEntry = entryLookup[k][0].clone()
      newColorEntry.name = `color${index + 1}`
      tree.addChild(newColorEntry, false, index)
      const newPath = newColorEntry.path()
      entryLookup[k].forEach((entry) => {
        const path = entry.path()
        const newRefrenceEntry = new oco.Reference(entry.name, newPath)
        tree.set(path, newRefrenceEntry)
      })
    })
    resolve(tree)
  })
})
