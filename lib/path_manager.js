const fs = require("fs")
const path = require("path")

exports.getSkvmHomePath = function() {
  return path.join(process.env["HOME"], ".skvm")
}

exports.getCurrentVersionPath = function() {
  return path.join(this.getSkvmHomePath(), "current")
}

exports.getSymlinkPath = function() {
  return path.join("/Applications", "Sketch.app")
}

exports.createVersionPath = function(version) {
  return path.join(this.getSkvmHomePath(), version)
}

exports.createZipPath = function(version) {
  return path.join(this.createVersionPath(version), "Sketch.zip")
}

exports.createAppPath = function(version) {
  return path.join(this.createVersionPath(version), "Sketch.app")
}

exports.checkPath = function(filePath) {
  try {
    return !!fs.statSync(filePath)
  } catch (e) {
    // Ignore error
  }
  return false
}
