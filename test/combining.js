/* eslint-env mocha */
import {expect} from 'chai'
import oco from 'opencolor'
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
    const tree = oco.parse(ocoString)
    compoundWords(tree, {transform: 'humanize'})
      .then(group.configure({separator: ' ', maxDepth: 1}))
      .then(autoname.configure({filter: /color.*/}))
      .then((transfromed) => {
        expect(transfromed.get('AmazonColor0')).to.be.undefined
        expect(transfromed.get('Amazon').type).to.equal('Palette')
        expect(transfromed.get('Amazon').children).to.have.length(2)
        expect(transfromed.get('Ikea.yellow').hexcolor()).to.equal('#FFCC00')
      })
  })
})
