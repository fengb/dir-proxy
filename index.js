var path = require('path')
var moduleResolveAsCaller = require('module-resolve-as-caller')

var dirProxy = module.exports = function (targetDir, base) {
  var proxyCache = {}
  targetDir = moduleResolveAsCaller(targetDir)
  base = base || proxyCache

  return createProxy(base || proxyCache, {
    get: function (target, prop) {
      if (prop in base) {
        return base[prop]
      }

      if (!proxyCache.hasOwnProperty(prop)) {
        try {
          proxyCache[prop] = require(path.join(targetDir, prop))
        } catch (e) {
          if (e.code === 'MODULE_NOT_FOUND') {
            console.warn(e.message)
          } else {
            throw e
          }
        }
      }

      return proxyCache[prop]
    },

    keys: function (target) {
      return Object.keys(base)
    },

    getOwnPropertyDescriptor: function (target, prop) {
      return Object.getOwnPropertyDescriptor(base, prop)
    },
  })
}

dirProxy.require = function (targetDir) {
  targetDir = moduleResolveAsCaller(targetDir)
  var base = require(targetDir)
  return dirProxy(targetDir, base)
}

var createProxy = (function () {
  if (typeof Proxy === 'function') {
    return function (base, handler) {
      return new Proxy(base, handler)
    }
  }

  if (typeof Proxy === 'object' && typeof Proxy.create === 'function') {
    return function (base, handler) {
      return Proxy.create(handler, base)
    }
  }

  throw new Error('proxies not supported on this platform. On v8/node/iojs, make sure to pass the --harmony_proxies flag')
})()
