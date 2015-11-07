require('harmony-reflect') // shim the correct Proxy

var path = require('path')
var moduleResolveAsCaller = require('module-resolve-as-caller')

var requireDirProxy = module.exports = function (targetDir, base) {
  targetDir = moduleResolveAsCaller(targetDir)
  var proxyCache = {}

  return new Proxy(base || proxyCache, {
    get: function (target, prop) {
      if (prop in target) {
        return target[prop]
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
  })
}

requireDirProxy.require = function (targetDir) {
  targetDir = moduleResolveAsCaller(targetDir)
  var base = require(targetDir)
  return requireDirProxy(targetDir, base)
}
