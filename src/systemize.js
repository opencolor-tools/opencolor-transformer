import transformerFactory from './factory.js'

const defaultAbstractRepeatingOptions = {
  occurences: 2
}

export const abstractRepeating = transformerFactory(defaultAbstractRepeatingOptions, (tree, options) => {
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
    Object.keys(entryLookup).forEach((k) => {
      if (entryLookup[k].length < options.occurences) {
        return
      }
      tree.set('abstractedColor.color' + k, entryLookup[k][0])
    })
    resolve(tree)
  })
})
