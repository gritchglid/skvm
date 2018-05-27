const fs = require("fs")
const https = require("https")

const decompress = require("decompress")
const mkdirp = require("mkdirp")
const progressStreamCreator = require("progress-stream")
const trash = require("trash")

const api = require("./api")
const pathManager = require("./path_manager")
const versions = require("./versions")

const PROGRESS_OPTION = {
  time: 100,
  speed: 1
}

exports.download = async function(version, callback = () => {}) {
  const availableVersions = await versions.fetchDownloadList()
  if (!availableVersions[version]) {
    throw new Error(`skvm: definition not found: ${version}`)
  }

  const zipPath = pathManager.createZipPath(version)
  const versionPath = pathManager.createVersionPath(version)

  mkdirp.sync(versionPath)

  const downloadLink = availableVersions[version].link
  const progressStream = progressStreamCreator(PROGRESS_OPTION)
  const writer = fs.createWriteStream(zipPath, {
    flags: "a",
    encoding: "binary"
  })

  trash(pathManager.createAppPath(version))
    .then(() =>
      api.downloadSketchZip(downloadLink, writer, { progress: progressStream })
    )
    .then(() => decompress(zipPath, versionPath))
    .then(() => writer.end())
    .then(() => callback())
    .catch(err => {
      writer.end()
      throw err
    })

  return progressStream
}

exports.replaceEnv = async function(version) {
  const p = pathManager.createVersionPath(version)
  if (!pathManager.checkPath(p)) {
    throw new Error(`skvm: ${version} is not installed`)
  }
  await trash(pathManager.getSymlinkPath())
  fs.symlinkSync(
    pathManager.createAppPath(version),
    pathManager.getSymlinkPath(),
    "dir"
  )
  fs.writeFileSync(pathManager.getCurrentVersionPath(), version, "utf8")
}

exports.removeEnv = async function(version) {
  const p = pathManager.createVersionPath(version)
  if (!pathManager.checkPath(p)) {
    throw new Error(`skvm: ${version} is not installed`)
  }
  if (versions.currentVersion() === version) {
    fs.unlinkSync(pathManager.getSymlinkPath())
    fs.unlinkSync(pathManager.getCurrentVersionPath())
  }
  await trash(p)
}
