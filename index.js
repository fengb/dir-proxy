require('harmony-reflect') // shim the correct Proxy

var path = require('path')
var moduleResolveAsCaller = require('module-resolve-as-caller')

var requireDirProxy = module.exports = function (targetDir, base) {
  targetDir = moduleResolveAsCaller(targetDir)
  base = base || {}

  return new Proxy(base, {
    get: function (target, prop) {
      if (!(prop in target)) {
        target[prop] = require(path.join(targetDir, prop))
      }

      return target[prop]
    }
  })
}

requireDirProxy.withBase = function (targetDir) {
  targetDir = moduleResolveAsCaller(targetDir)
  var base = require(targetDir)
  return requireDirProxy(targetDir, base)
}
