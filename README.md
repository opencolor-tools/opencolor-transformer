# Open Color Tools Transformer

– Work in Progess –

Open Color Transformers help to transform existing color palettes defined in the Open Color File Format and will be released as node module soon.

[☞ Learn more about Open Color Tools](http://opencolor.tools)

The transformers are used to manipulate names, structure and meaning of color palettes. They are often used in combination with opencolor-converters to unbox meaningful color information form existing color definitions in sass, less or other formats.

Looking for a UI to work with the transformers?

[Try the Open Color Companion App](http://opencolor.tools)

## Design

All transformers expect two paramerters, a parsed oco tree and a configuration object. They return a promise that resolves with a manipulated cloned tree.

(Promised based API and clone vs. direct manipulation are up for discussion).

## Rename

Rename entries in a palette.

```
const tree = oco.parse('colorA: #FFF')
return rename(tree, {
  transform: 'dasherize'
}).then((transformed) => {
  console.log(transformed.get('color-a').name)
})
```

- `filter` _String or RegExp_<br>
  filters entries before apply the rename operation
- `scope` _String or Array_ limits the rename operation to a specific entry type

  - Color
  - Palette
  - Reference

define either `search` and `replace` or `transform`

- `search` _String or Array_, `replace` _String_
- `transform` _String_<br>
  applies a transform

  - camelize
  - capitalize
  - dasherize
  - lowdasherize
  - humanize

## Regroup

Regroup entries in a palette based on their name.

### Group

Splits a entry name and creates group for each part of the name.

# Development

```
npm install
npm run test:watch
```

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com/)
