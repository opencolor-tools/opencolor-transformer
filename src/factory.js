export default function (defaultOptions, func) {
  return (tree, configuration) => {
    const transformed = tree.clone()
    const options = Object.assign({}, defaultOptions, configuration)
    return func(transformed, options)
  }
}
