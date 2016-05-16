import {createTransformer} from './factory'
import {ntc} from './utils/ntc'
import oco from 'opencolor'

const defaultAbstractRepeatingOptions = {
  occurences: 2,
  autoname: false
}

export const abstractRepeating = createTransformer(defaultAbstractRepeatingOptions, (tree, options) => {
  let name = function (value, index) {
    return `color${index + 1}`
  }
  if (options.autoname) {
    ntc.init('xkcd')
    let usedNames = {}
    name = function (value, index) {
      let suggestion = ntc.name(value)[1]
      if (Object.keys(usedNames).indexOf(suggestion) !== -1) {
        return suggestion + ' ' + usedNames[suggestion]++
      }
      usedNames[suggestion] = 1
      return suggestion
    }
  }
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
      newColorEntry.name = name(newColorEntry.hexcolor(), index)

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
