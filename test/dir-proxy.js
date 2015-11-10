var expect = require('chai').expect
var dirProxy = require('..')

describe('dir-proxy', function () {
  it('returns an empty object', function () {
    var proxy = dirProxy('..')
    expect(Object.keys(proxy)).to.deep.equal([])
  })

  it('auto requires the referenced file', function () {
    var proxy = dirProxy('..')
    expect(proxy.index).to.equal(dirProxy)
  })

  it('creates a direct reference', function () {
    var proxy = dirProxy('..')
    proxy.index
    expect(Object.keys(proxy)).to.deep.equal(['index'])
  })

  it('does not explode when doing fancy things', function () {
    var proxy = dirProxy('..')
    console.log(proxy)
  })

  describe('.require', function () {
    it('uses the base file as underlying', function () {
      var base = require('mocha')
      var proxy = dirProxy.require('mocha')
      for (var key in base) {
        expect(proxy[key]).to.equal(base[key])
      }
    })

    it('does not modify base when auto requiring', function () {
      var base = require('..')
      var proxy = dirProxy.require('..')
      expect(proxy.index).to.equal(base)
      expect(base).to.not.have.property('index')
    })
  })
})