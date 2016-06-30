# Open Color Tools Transformer

Build status: ![Build Status](https://travis-ci.org/opencolor-tools/opencolor-transformer.svg?branch=master)

– Work in Progess –

Open Color Transformers help to transform existing color palettes defined in the Open Color File Format and will be released as node module soon.

[☞ Learn more about Open Color Tools](http://opencolor.tools)

The transformers are used to manipulate names, structure and meaning of color palettes. They are often used in combination with opencolor-converters to unbox meaningful color information form existing color definitions in sass, less or other formats.

Looking for a UI to work with the transformers?

[Try the Open Color Companion App](http://opencolor.tools)

## Design

All transformers expect two parameters, a parsed oco tree and a configuration object. They return a promise that resolves with a manipulated cloned tree.

(Promised based API and clone vs. direct manipulation are up for discussion).

## Default Options

- `filter` _String or RegExp_<br>
  filters entries before apply any transform
- `scope` _String or Array_ limits the rename operation to a specific entry type

  - Color
  - Palette
  - Reference

## Rename

Rename entries in a palette.

### Search and replace

`searchAndReplace(tree, options)`

- `search` _String or RegExp_, `replace` _String_

### Compound Words

`compoundWords(tree, options)`

```
const tree = oco.parse('colorA: #FFF')
return rename(tree, {
  transform: 'dasherize'
}).then((transformed) => {
  console.log(transformed.get('color-a').name)
})
```

- `transform` _String_<br>
  applies a transform

  - camelize
  - capitalize
  - dasherize
  - lowdasherize
  - uppercase
  - lowercase
  - humanize
  - clean

### Autoname

`autoname(tree, options)`

- `pool` _String_ defines source for naming information

  - xkcd
  - ntc

## Regroup

Regroup entries in a palette based on their name.

### Group

`group(tree, options)`

Splits a entry name and creates group for each part of the name.

- `separator` _String_ · default: ' '
- `direction` _String_ · default: 'left'
- `maxDepth` _Integer_ or _Boolean_ · default: false

### Flatten

`flatten(tree, options)`

- `glue` _String_ · default: ' '
- `direction` _String_ · default: 'left'
- `minDepth` _Integer_ or _Boolean_ · default: false

## Systemize

### Search and replace

`abstractRepeating(tree, options)`

Extracts repeating color values and creates references.

- `occurences` _Integer_ · default 2<br>
  Number of occurences of a color value needed, before value will be abstracted.
- `autoname` _Boolean_ · default: false<br>
  Renames extracted color entries

# Development

```
npm install
npm run test:watch
```

## How to create new transformer

Use the transformer factory to create new transformer functions which introduces some convience. The factory will wrap your transform function. Once called it handles the default options and provide an oco Object which is a clone of the original tree passed to your function. The oco Object is enriched by a `transformEntries((entry) => {})` function - use it to iterate over all filtered entries ready for being transformed.

```javascript
import oco from 'opencolor'
import transformerFactory from './src/factory.js'
const exampleTranfromerDefaultOptions = {
  append: ' - transformed'
}
const exampleTransformer = transformerFactory(exampleTranfromerDefaultOptions, (tree, options) => {
  return new Promise((resolve, reject) => {
    tree.transformEntries((entry) => {
      entry.name = entry.name + options.append
    })
    resolve(tree)
  })
})

exampleTransformer(oco.parse('color: #FF0000'), {
  append: ' - red'
}).then((transformed) => {
  console.log(oco.render(transformed));
  // color - red: #FF0000
})
```

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com/)
