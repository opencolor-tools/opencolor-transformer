/* eslint-env mocha */
import chai, {expect} from 'chai'
import oco from 'opencolor'
import {abstractRepeating} from '../src/systemize'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)

describe.only('Systemize Transformer', () => {
  describe('abstract repeating', () => {
    it('should create a new color entry for repeating color values', () => {
      var ocoString = `
color a: #FFF
color b: #FFF
`
      return abstractRepeating(oco.parse(ocoString))
        .then((transformed) => {
          expect(transformed.get('color1').hexcolor()).to.equal('#FFFFFF')
        })
    })
    it('should replace existing color entries with a reference entry to the newly created color', () => {
      var ocoString = `
color a: #FFF
color b: #FFF
`
      return abstractRepeating(oco.parse(ocoString))
        .then((transformed) => {
          expect(transformed.get('color a').type).to.equal('Reference')
          expect(transformed.get('color a').refName).to.equal('color1')
          expect(transformed.get('color b').type).to.equal('Reference')
          expect(transformed.get('color b').refName).to.equal('color1')
        })
    })
    it('should create more than one new color values for repeating color values', () => {
      var ocoString = `
color a: #FFF
color b: #000
color c: #FFF
color d: #000
`
      return abstractRepeating(oco.parse(ocoString))
        .then((transformed) => {
          expect(transformed.get('color1').hexcolor()).to.equal('#FFFFFF')
          expect(transformed.get('color2').hexcolor()).to.equal('#000000')
        })
    })
    it('should replace existing color entries with reference entries to the newly created colors', () => {
      var ocoString = `
color a: #FFF
color b: #000
color c: #FFF
color d: #000
`
      return abstractRepeating(oco.parse(ocoString))
        .then((transformed) => {
          expect(transformed.get('color a').type).to.equal('Reference')
          expect(transformed.get('color a').refName).to.equal('color1')
          expect(transformed.get('color b').type).to.equal('Reference')
          expect(transformed.get('color b').refName).to.equal('color2')
        })
    })
    it('should make occurences configurable', () => {
      var ocoString = `
color a: #FFF
color b: #000
color c: #FFF
color d: #FFF
color e: #000
`
      return abstractRepeating(oco.parse(ocoString), {occurences: 3})
        .then((transformed) => {
          expect(transformed.get('color a').type).to.equal('Reference')
          expect(transformed.get('color a').refName).to.equal('color1')
          expect(transformed.get('color b').type).to.equal('Color')
        })
    })
  })
})
