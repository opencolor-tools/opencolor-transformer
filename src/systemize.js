import {createTransformer} from './factory'
import {ntc} from './utils/ntc'
import oco from 'opencolor'

const defaultAbstractRepeatingOptions = {
  occurences: 2,
  autoname: false,
  palette: 'extracted'
}

export const abstractRepeating = createTransformer(defaultAbstractRepeatingOptions, {scope: ['Color']}, (tree, options) => {
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
    let addedColors = 0
    let paletteForExtractedColors = tree
    if (options.palette) {
      let existingPalette = tree.get(options.palette)
      if (existingPalette) {
        paletteForExtractedColors = existingPalette
      } else {
        paletteForExtractedColors = new oco.Entry(options.palette.replace('.', ''), [], 'Palette')
        tree.addChild(paletteForExtractedColors, false, 0)
      }
    }
    Object.keys(entryLookup).forEach((k, index) => {
      if (entryLookup[k].length < options.occurences) {
        return
      }
      const newColorEntry = entryLookup[k][0].clone()
      newColorEntry.name = name(newColorEntry.hexcolor(), index)

      paletteForExtractedColors.addChild(newColorEntry, false, addedColors++)
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
