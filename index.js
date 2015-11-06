require('harmony-reflect') // shim the correct Proxy

var path = require('path')
var moduleResolveAsCaller = require('module-resolve-as-caller')

var requireDirProxy = module.exports = function (targetDir) {
  targetDir = moduleResolveAsCaller(targetDir)

  return new Proxy({}, {
    get: function (target, prop) {
      if (!target[prop]) {
        target[prop] = require(path.join(targetDir, prop))
      }

      return target[prop]
    }
  })
}
