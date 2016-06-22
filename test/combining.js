/* eslint-env mocha */
import {expect} from 'chai'
import {parse} from 'opencolor'
import {compoundWords, group, autoname} from '../lib'

describe('Combining Transformer Example', () => {
  it('should be easy to chain transformer', () => {
    const ocoString = `
AmazonColor0: #ff9900
AmazonColor1: #146eb4
TwitterColor0: #55acee
FacebookColor0: #3b5998
IKEAYellow: #ffcc00
IKEABlue: #003399
`
    const tree = parse(ocoString)
    return compoundWords.configure({transform: 'humanize'})(tree)
      .then(group.configure({separator: ' ', maxDepth: 1}))
      .then(autoname.configure({filter: /color.*/}))
      .then((transformed) => {
        expect(transformed.get('AmazonColor0')).to.be.undefined
        expect(transformed.get('Amazon').type).to.equal('Palette')
        expect(transformed.get('Amazon').children).to.have.length(2)
        expect(transformed.get('Ikea.yellow').hexcolor()).to.equal('#FFCC00')
      })
  })
})
