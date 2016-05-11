/* eslint-env mocha */
import chai, {expect} from 'chai'
import oco from 'opencolor'
import {group} from '../src/regroup'
import fs from 'fs'
import path from 'path'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)

describe.only('Regroup Transformer', () => {
  describe('Splitting Names', () => {
    it('should reject unknown direction options', () => {
      return expect(group(oco.parse('color a: #FFF'), {direction: 'XXX'})).to.be.rejectedWith(Error)
    })

    it('should accept direction options', () => {
      return Promise.all([
        expect(group(oco.parse('colorA: #FFF'), {direction: 'left'})).to.be.fullfilled,
        expect(group(oco.parse('colorA: #FFF'), {direction: 'right'})).to.be.fullfilled
      ])
    })

    it('should create groups', () => {
      const tree = oco.parse('color a: #FFF')
      return group(tree, {
        split: ' '
      }).then((transformed) => {
        expect(transformed.get('color').type).to.equal('Palette')
        expect(transformed.get('color.a')).to.not.be.undefined
        expect(transformed.get('color a')).to.be.undefined
      })
    })

    it('should assign multiple colors to same group', () => {
      const tree = oco.parse(`
color a: #FFF
color b: #FFF
`)
      return group(tree, {
        split: ' '
      }).then((transformed) => {
        expect(transformed.get('color').type).to.equal('Palette')
        expect(transformed.get('color').children).to.have.length(2)
        expect(transformed.get('color.a')).to.not.be.undefined
        expect(transformed.get('color.b')).to.not.be.undefined
      })
    })

    it('should limit depth of 1', () => {
      const tree = oco.parse('level1 level2 level3 level4: #FFF')
      return group(tree, {
        split: ' ',
        maxDepth: 1
      }).then((transformed) => {
        expect(transformed.get('level1').type).to.equal('Palette')
        expect(transformed.get('level1.level2 level3 level4')).to.not.be.undefined
      })
    })

    it('should limit depth of 3', () => {
      const tree = oco.parse('level1 level2 level3 level4: #FFF')
      return group(tree, {
        split: ' ',
        maxDepth: 3
      }).then((transformed) => {
        expect(transformed.get('level1').type).to.equal('Palette')
        expect(transformed.get('level1.level2.level3.level4')).to.not.be.undefined
      })
    })

    it('should limit depth of 1 from right', () => {
      const tree = oco.parse('level1 level2 level3 level4: #FFF')
      return group(tree, {
        split: ' ',
        maxDepth: 1,
        direction: 'right'
      }).then((transformed) => {
        expect(transformed.get('level1 level2 level3').type).to.equal('Palette')
        expect(transformed.get('level1 level2 level3.level4')).to.not.be.undefined
      })
    })

    it('should limit depth of 2 from right', () => {
      const tree = oco.parse('level1 level2 level3 level4: #FFF')
      return group(tree, {
        split: ' ',
        maxDepth: 2,
        direction: 'right'
      }).then((transformed) => {
        expect(transformed.get('level1 level2').type).to.equal('Palette')
        expect(transformed.get('level1 level2.level3.level4')).to.not.be.undefined
      })
    })
  })
})
