/* eslint-env mocha */
import {expect} from 'chai'
import * as transformers from '../lib'

describe('Transformer API', () => {
  it('should respond to group', () => {
    expect(transformers).to.respondTo('group')
  })
  it('should respond to flatten', () => {
    expect(transformers).to.respondTo('flatten')
  })
  it('should respond to searchAndReplace', () => {
    expect(transformers).to.respondTo('searchAndReplace')
  })
  it('should respond to autoname', () => {
    expect(transformers).to.respondTo('autoname')
  })
  it('should respond to compoundWords', () => {
    expect(transformers).to.respondTo('compoundWords')
  })
  it('should respond to abstractRepeating', () => {
    expect(transformers).to.respondTo('abstractRepeating')
  })
  it('should respond to sort', () => {
    expect(transformers).to.respondTo('sort')
  })
  it('all transformer should be configurable', () => {
    Object.keys(transformers).forEach((key) => {
      expect(transformers[key]).to.have.ownProperty('configure')
    })
  })
})
