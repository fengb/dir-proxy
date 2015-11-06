var expect = require('chai').expect
var requireDir = require('..')

describe('require-dir-proxy', function () {
  it('returns an empty object', function () {
    var proxy = requireDir('..')
    expect(Object.keys(proxy)).to.deep.equal([])
  })

  it('auto requires the referenced file', function () {
    var proxy = requireDir('..')
    expect(proxy.index).to.equal(requireDir)
  })

  it('creates a direct reference', function () {
    var proxy = requireDir('..')
    proxy.index
    expect(Object.keys(proxy)).to.deep.equal(['index'])
  })

  it('does not explode when doing fancy things', function () {
    var proxy = requireDir('..')
    console.log(proxy)
  })

  describe('.withBase', function () {
    it('uses the base file as underlying', function () {
      var base = require('mocha')
      var proxy = requireDir.withBase('mocha')
      for (var key in base) {
        expect(proxy[key]).to.equal(base[key])
      }
    })

    it('does not modify base when auto requiring', function () {
      var base = require('..')
      var proxy = requireDir.withBase('..')
      expect(proxy.index).to.equal(base)
      expect(base).to.not.have.property('index')
    })
  })
})
