if (process.env.HARMONY_REFLECT === 'true') {
  // Shim for 'new Proxy' syntax
  require('harmony-reflect')
}

var expect = require('chai').expect
var sinon = require('sinon')
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

  context('with fake console.warn', function () {
    beforeEach(function () {
      this.console = sinon.stub(console, 'warn')
    })

    afterEach(function () {
      this.console.restore()
    })

    it('does not explode when doing fancy things', function () {
      var proxy = dirProxy('..')
      console.warn(proxy)
    })
  })

  describe('with opts', function () {
    describe('{ transform }', function () {
      it('transforms with a string method', function () {
        var proxy = dirProxy('..', { transform: 'toLowerCase' })
        expect(proxy.Index).to.equal(dirProxy)
      })

      it('transforms with a function', function () {
        var proxy = dirProxy('..', {
          transform: function (prop) {
            return 'index'
          },
        })
        expect(proxy.foodnard).to.equal(dirProxy)
      })
    })
  })

  describe('.require()', function () {
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
