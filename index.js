var path = require('path')
var moduleResolveAsCaller = require('module-resolve-as-caller')
var requireOptional = require('require-optional')

var dirProxy = module.exports = function (targetDir, opts) {
  targetDir = moduleResolveAsCaller(targetDir)
  opts = opts || {}

  var proxyCache = {}
  var base = opts.base || proxyCache
  var transform = asTransform(opts.transform)

  return createProxy(base || proxyCache, {
    get: function (target, prop) {
      if (prop in base) {
        return base[prop]
      }

      if (!proxyCache.hasOwnProperty(prop)) {
        var targetFile = path.join(targetDir, transform(prop))
        proxyCache[prop] = requireOptional(targetFile, undefined, console.warn)
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

dirProxy.require = function (targetDir, opts) {
  targetDir = moduleResolveAsCaller(targetDir)
  opts = opts || {}

  opts.base = require(targetDir)
  return dirProxy(targetDir, opts)
}

function asTransform (transform) {
  if (typeof transform === 'function') {
    return transform
  } else if (transform == null) {
    return function (prop) {
      return prop
    }
  } else {
    return function (prop) {
      return prop[transform]()
    }
  }
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
