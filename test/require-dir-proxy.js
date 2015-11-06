var expect = require('chai').expect
var requireDir = require('..')

describe('require-dir-proxy', function () {
  it('returns an empty object', function () {
    var dir = requireDir('..')
    expect(Object.keys(dir)).to.deep.equal([])
  })

  it('auto requires the referenced file', function () {
    var dir = requireDir('..')
    expect(dir.index).to.equal(requireDir)
  })

  it('creates a direct reference', function () {
    var dir = requireDir('..')
    dir.index
    expect(Object.keys(dir)).to.deep.equal(['index'])
  })
})
