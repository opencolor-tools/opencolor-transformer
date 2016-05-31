/* eslint-env mocha */
import chai, {expect} from 'chai'
import oco from 'opencolor'
import {sort} from '../src/sort'
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
      return sort(oco.parse(ocoString), {sortBy: 'hue', order: 'asc'})
        .then((transformed) => {
          expect(transformed.get('mygroup').children[0].name).to.equal('color b')
          expect(transformed.get('mygroup').children[1].name).to.equal('color a')
        })
    })
    it('sort color in group by hue in descending order', () => {
      var ocoString = `
mygroup:
  color a: #FF0000
  color b: #00FF00
`
      return sort(oco.parse(ocoString), {sortBy: 'hue', order: 'desc'})
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
      return sort(oco.parse(ocoString), {sortBy: 'hue', order: 'asc'})
        .then((transformed) => {
          expect(transformed.children[0].name).to.equal('color b')
          expect(transformed.children[1].name).to.equal('color a')
        })
    })
  })
  describe('sort by saturation', () => {
    it('sort color in group by saturation', () => {
      var ocoString = `
mygroup:
  color a: #FF0000
  color b: #333333
`
      return sort(oco.parse(ocoString), {sortBy: 'saturation', order: 'asc'})
        .then((transformed) => {
          expect(transformed.get('mygroup').children[0].name).to.equal('color b')
          expect(transformed.get('mygroup').children[1].name).to.equal('color a')
        })
    })
    it('sort color in group by saturation in descending order', () => {
      var ocoString = `
mygroup:
  color a: #333333
  color b: #FF0000
`
      return sort(oco.parse(ocoString), {sortBy: 'saturation', order: 'desc'})
        .then((transformed) => {
          expect(transformed.get('mygroup').children[0].name).to.equal('color b')
          expect(transformed.get('mygroup').children[1].name).to.equal('color a')
        })
    })

    it('sort color in root by saturation', () => {
      var ocoString = `
color a: #FF0000
color b: #333333
`
      return sort(oco.parse(ocoString), {sortBy: 'saturation', order: 'asc'})
        .then((transformed) => {
          expect(transformed.children[0].name).to.equal('color b')
          expect(transformed.children[1].name).to.equal('color a')
        })
    })
  })
  describe('sort by value', () => {
    it('sort color in group by value', () => {
      var ocoString = `
mygroup:
  color a: #FFFFFF
  color b: #000000
`
      return sort(oco.parse(ocoString), {sortBy: 'value', order: 'asc'})
        .then((transformed) => {
          expect(transformed.get('mygroup').children[0].name).to.equal('color b')
          expect(transformed.get('mygroup').children[1].name).to.equal('color a')
        })
    })
    it('sort color in group by value in descending order', () => {
      var ocoString = `
mygroup:
  color a: #000000
  color b: #FFFFFF
`
      return sort(oco.parse(ocoString), {sortBy: 'value', order: 'desc'})
        .then((transformed) => {
          expect(transformed.get('mygroup').children[0].name).to.equal('color b')
          expect(transformed.get('mygroup').children[1].name).to.equal('color a')
        })
    })
    it('sort color in root by value', () => {
      var ocoString = `
color a: #FFFFFF
color b: #000000
`
      return sort(oco.parse(ocoString), {sortBy: 'value', order: 'asc'})
        .then((transformed) => {
          expect(transformed.children[0].name).to.equal('color b')
          expect(transformed.children[1].name).to.equal('color a')
        })
    })
  })
})
