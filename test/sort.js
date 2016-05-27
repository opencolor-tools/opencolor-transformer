/* eslint-env mocha */
import chai, {expect} from 'chai'
import oco from 'opencolor'
import {sortByHue} from '../src/sort'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)

describe('Sort Transformer', () => {
  describe('sort by hue', () => {
    it('sort color in group by hue', () => {
      var ocoString = `
mygroup:
  color a: #00FF00
  color b: #FF0000
`
      return sortByHue(oco.parse(ocoString))
        .then((transformed) => {
          expect(transformed.get('mygroup').children[0].name).to.equal('color b')
          expect(transformed.get('mygroup').children[1].name).to.equal('color a')
        })
    })
    it('sort color in root by hue', () => {
      var ocoString = `
color a: #00FF00
color b: #FF0000
`
      return sortByHue(oco.parse(ocoString))
        .then((transformed) => {
          expect(transformed.children[0].name).to.equal('color b')
          expect(transformed.children[1].name).to.equal('color a')
        })
    })
  })
})
