require('harmony-reflect') // shim the correct Proxy

var path = require('path')
var moduleResolveAsCaller = require('module-resolve-as-caller')

var requireDirProxy = module.exports = function (targetDir, base) {
  targetDir = moduleResolveAsCaller(targetDir)
  var proxyRequired = {}

  return new Proxy(base || proxyRequired, {
    get: function (target, prop) {
      if (prop in target) {
        return target[prop]
      }

      if (!proxyRequired.hasOwnProperty(prop)) {
        try {
          proxyRequired[prop] = require(path.join(targetDir, prop))
        } catch (e) {
          if (e.code === 'MODULE_NOT_FOUND') {
            console.warn(e.message)
          } else {
            throw e
          }
        }
      }

      return proxyRequired[prop]
    }
  })
}

requireDirProxy.withBase = function (targetDir) {
  targetDir = moduleResolveAsCaller(targetDir)
  var base = require(targetDir)
  return requireDirProxy(targetDir, base)
}
