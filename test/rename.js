/* eslint-env mocha */
import chai, {expect} from 'chai'
import oco from 'opencolor'
import {searchAndReplace, compoundWords, autoname} from '../src/rename'
import fs from 'fs'
import path from 'path'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)

describe('Rename Transformer', () => {
  const simpleOcoString = fs.readFileSync(path.join(__dirname, 'fixtures', 'simple.oco'))
  const simplePaletteOcoString = fs.readFileSync(path.join(__dirname, 'fixtures', 'simple-palette.oco'))

  describe('Search and Replace', () => {
    it('should rename color names based on search and replace', () => {
      const tree = oco.parse(simpleOcoString)
      return searchAndReplace(tree, {
        search: 'colornameA',
        replace: 'colornameX'
      }).then((transformed) => {
        expect(transformed.get('colornameX')).to.not.be.undefined
        expect(transformed.get('colornameA')).to.be.undefined
        expect(transformed.get('colornameB')).to.not.be.undefined
      })
    })

    it('should rename groups and maintain references', () => {
      const tree = oco.parse(`Greys:
  Subtle Grey: #FAFAFA
Day Theme:
  oct/:
    backgroundColor: =Background
  Background: =Greys.Subtle Grey`
)
      return searchAndReplace(tree, {
        search: 'Greys',
        replace: 'xxx'
      }).then((transformed) => {
        // console.log(transformed.toString())
        expect(transformed.get('Day Theme.Background').refName).to.equal('xxx.Subtle Grey')
      })
    })

    it('should levae palette intact, when nonsense options specified', () => {
      const tree = oco.parse(`Greys:
  Subtle Grey: #FAFAFA
Day Theme:
  oct/:
    backgroundColor: =Background
  Background: =Greys.Subtle Grey`
)
      return searchAndReplace(tree, {
        search: null,
        replace: null
      }).then((transformed) => {
        expect(transformed.get('Day Theme.Background').refName).to.equal('Greys.Subtle Grey')
      })
    })

    it('should rename colors in groups and maintain references', () => {
      const tree = oco.parse(`Greys:
  Subtle Grey: #FAFAFA
Day Theme:
  oct/:
    backgroundColor: =Background
  Background: =Greys.Subtle Grey`
)
      return searchAndReplace(tree, {
        search: 'Subtle',
        replace: 'xxx'
      }).then((transformed) => {
        expect(transformed.get('Day Theme.Background').refName).to.equal('Greys.xxx Grey')
      })
    })

    it('should rename all entry names based on search and replace', () => {
      const tree = oco.parse(simplePaletteOcoString)
      return searchAndReplace(tree, {
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

  describe('Compound Words', () => {
    it('should reject unknown transform options', () => {
      return expect(compoundWords(oco.parse('colorA: #FFF'), {transform: 'XXX'})).to.be.rejectedWith(Error)
    })

    it('should dasherize', () => {
      const tree = oco.parse('colorA: #FFF')
      return compoundWords(tree, {
        transform: 'dasherize'
      }).then((transformed) => {
        expect(transformed.get('color-a')).to.not.be.undefined
      })
    })

    it('should humanize', () => {
      const tree = oco.parse('CÜlá--r: #FFF')
      return compoundWords(tree, {
        transform: 'humanize'
      }).then((transformed) => {
        expect(transformed.get('Cülá r')).to.not.be.undefined
      })
    })

    it('should clean', () => {
      const tree = oco.parse('CÜlá--r: #FFF')
      return compoundWords(tree, {
        transform: 'clean'
      }).then((transformed) => {
        expect(transformed.get('CUla--r')).to.not.be.undefined
      })
    })

    it('should camelcase', () => {
      const tree = oco.parse('color-a: #FFF')
      return compoundWords(tree, {
        transform: 'camelize'
      }).then((transformed) => {
        expect(transformed.get('colorA')).to.not.be.undefined
      })
    })

    it('should lowdasherize', () => {
      const tree = oco.parse('color a: #FFF')
      return compoundWords(tree, {
        transform: 'lowdasherize'
      }).then((transformed) => {
        expect(transformed.get('color_a')).to.not.be.undefined
      })
    })

    it('should capitalize', () => {
      const tree = oco.parse('color a: #FFF')
      return compoundWords(tree, {
        transform: 'capitalize'
      }).then((transformed) => {
        expect(transformed.get('Color A')).to.not.be.undefined
      })
    })

    it('should uppercase', () => {
      const tree = oco.parse('color a: #FFF')
      return compoundWords(tree, {
        transform: 'uppercase'
      }).then((transformed) => {
        expect(transformed.get('COLOR A')).to.not.be.undefined
      })
    })

    it('should lowercase', () => {
      const tree = oco.parse('ColoR A: #FFF')
      return compoundWords(tree, {
        transform: 'lowercase'
      }).then((transformed) => {
        expect(transformed.get('color a')).to.not.be.undefined
      })
    })
  })

  describe('Autoname', () => {
    it('should name colors', () => {
      return Promise.all([
        autoname(oco.parse('color a: #3778bf')).then((transformed) => {
          expect(transformed.children[0].name).to.equal('windows blue')
        }),
        autoname(oco.parse('color a: #3778be')).then((transformed) => {
          expect(transformed.children[0].name).to.equal('windows blue')
        }),
        autoname(oco.parse('color a: #3778bd')).then((transformed) => {
          expect(transformed.children[0].name).to.equal('windows blue')
        }),
        autoname(oco.parse('color a: #FFF')).then((transformed) => {
          expect(transformed.children[0].name).to.equal('white')
        })
      ])
    })
    it('should support name pool ntc', () => {
      return Promise.all([
        autoname(oco.parse('color a: #3778bf'), {pool: 'ntc'}).then((transformed) => {
          expect(transformed.children[0].name).to.equal('Boston Blue')
        }),
        autoname(oco.parse('color a: #3778be'), {pool: 'ntc'}).then((transformed) => {
          expect(transformed.children[0].name).to.equal('Boston Blue')
        }),
        autoname(oco.parse('color a: #3778bd'), {pool: 'ntc'}).then((transformed) => {
          expect(transformed.children[0].name).to.equal('Boston Blue')
        }),
        autoname(oco.parse('color a: #FFF')).then((transformed) => {
          expect(transformed.children[0].name).to.equal('white')
        })
      ])
    })
    it('should support name pool css', () => {
      return Promise.all([
        autoname(oco.parse('color a: #008B8B'), {pool: 'css'}).then((transformed) => {
          expect(transformed.children[0].name).to.equal('darkcyan')
        }),
        autoname(oco.parse('color a: #008B8C'), {pool: 'css'}).then((transformed) => {
          expect(transformed.children[0].name).to.equal('darkcyan')
        }),
        autoname(oco.parse('color a: #008B8D'), {pool: 'css'}).then((transformed) => {
          expect(transformed.children[0].name).to.equal('darkcyan')
        }),
        autoname(oco.parse('color a: #FFF')).then((transformed) => {
          expect(transformed.children[0].name).to.equal('white')
        })
      ])
    })
  })
})
