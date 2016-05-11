/* eslint-env mocha */
import chai, {expect} from 'chai'
import oco from 'opencolor'
import rename from '../src/rename'
import fs from 'fs'
import path from 'path'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)

describe('Rename Transformer', () => {
  // const readerOcoString = fs.readFileSync(path.join(__dirname, 'fixtures', 'reader.oco'))
  const simpleOcoString = fs.readFileSync(path.join(__dirname, 'fixtures', 'simple.oco'))
  const simplePaletteOcoString = fs.readFileSync(path.join(__dirname, 'fixtures', 'simple-palette.oco'))

  describe('Scoping and Filters', () => {
    it('should allow scoping on Color, Palette and Reference', () => {
      return Promise.all([
        expect(rename(oco.parse('colorA: #FFF'), {scope: 'Color'})).to.be.fullfilled,
        expect(rename(oco.parse('colorA: #FFF'), {scope: 'Palette'})).to.be.fullfilled,
        expect(rename(oco.parse('colorA: #FFF'), {scope: 'Reference'})).to.be.fullfilled
      ])
    })
    it('should allow multiple scoping', () => {
      return expect(rename(oco.parse('colorA: #FFF'), {scope: ['Color', 'Palette']})).to.be.fullfilled
    })
    it('should reject unknown scoping options', () => {
      return expect(rename(oco.parse('colorA: #FFF'), {scope: 'XXX'})).to.be.rejectedWith(Error)
    })
    it('should filter entry names with string', () => {
      const tree = oco.parse(simplePaletteOcoString)
      return rename(tree, {
        filter: 'colorname',
        search: 'A',
        replace: 'X'
      }).then((transformed) => {
        expect(transformed.get('palettenameA')).to.not.be.undefined
        expect(transformed.get('palettenameA.colornameX')).to.not.be.undefined
        expect(transformed.get('palettenameA.colornameB')).to.not.be.undefined
      })
    })
    it('should filter entry names with regexp', () => {
      const tree = oco.parse(simplePaletteOcoString)
      return rename(tree, {
        filter: /colorname[AB]/,
        search: 'name',
        replace: 'xxx'
      }).then((transformed) => {
        expect(transformed.get('palettenameA')).to.not.be.undefined
        expect(transformed.get('palettenameA.colorxxxA')).to.not.be.undefined
        expect(transformed.get('palettenameA.colorxxxB')).to.not.be.undefined
        expect(transformed.get('palettenameA.colornameC')).to.not.be.undefined
      })
    })
    it('should only effect entries inside the scope', () => {
      const tree = oco.parse(simplePaletteOcoString)
      return rename(tree, {
        search: 'A',
        replace: 'X',
        scope: ['Color']
      }).then((transformed) => {
        expect(transformed.get('palettenameA')).to.not.be.undefined
        expect(transformed.get('palettenameA.colornameX')).to.not.be.undefined
        expect(transformed.get('palettenameA.colornameA')).to.be.undefined
        expect(transformed.get('palettenameA.colornameB')).to.not.be.undefined
      })
    })
  })

  describe('Search and Replace', () => {
    it('should rename color names based on search and replace', () => {
      const tree = oco.parse(simpleOcoString)
      return rename(tree, {
        search: 'colornameA',
        replace: 'colornameX'
      }).then((transformed) => {
        expect(transformed.get('colornameX')).to.not.be.undefined
        expect(transformed.get('colornameA')).to.be.undefined
        expect(transformed.get('colornameB')).to.not.be.undefined
      })
    })

    it('should rename all entry names based on search and replace', () => {
      const tree = oco.parse(simplePaletteOcoString)
      return rename(tree, {
        search: 'A',
        replace: 'X'
      }).then((transformed) => {
        expect(transformed.get('palettenameX')).to.not.be.undefined
        expect(transformed.get('palettenameX.colornameX')).to.not.be.undefined
        expect(transformed.get('palettenameX.colornameA')).to.be.undefined
        expect(transformed.get('palettenameX.colornameB')).to.not.be.undefined
      })
    })
  })

  describe('Case Changes', () => {
    it('should reject unknown transform options', () => {
      return expect(rename(oco.parse('colorA: #FFF'), {transform: 'XXX'})).to.be.rejectedWith(Error)
    })

    it('should dasherize', () => {
      const tree = oco.parse('colorA: #FFF')
      return rename(tree, {
        transform: 'dasherize'
      }).then((transformed) => {
        expect(transformed.get('color-a')).to.not.be.undefined
      })
    })

    it('should humanize', () => {
      const tree = oco.parse('CÜlá--r: #FFF')
      return rename(tree, {
        transform: 'humanize'
      }).then((transformed) => {
        expect(transformed.get('CUla--r')).to.not.be.undefined
      })
    })

    it('should camelcase', () => {
      const tree = oco.parse('color-a: #FFF')
      return rename(tree, {
        transform: 'camelize'
      }).then((transformed) => {
        expect(transformed.get('colorA')).to.not.be.undefined
      })
    })

    it('should lowdasherize', () => {
      const tree = oco.parse('color a: #FFF')
      return rename(tree, {
        transform: 'lowdasherize'
      }).then((transformed) => {
        expect(transformed.get('color_a')).to.not.be.undefined
      })
    })

    it('should capitalize', () => {
      const tree = oco.parse('color a: #FFF')
      return rename(tree, {
        transform: 'capitalize'
      }).then((transformed) => {
        expect(transformed.get('Color a')).to.not.be.undefined
      })
    })
  })
})
