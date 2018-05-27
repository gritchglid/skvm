const fs = require("fs")

const api = require("./api")
const pathManager = require("./path_manager")

const SORT_WEIGHT = 100

exports.fetchShortVersions = async function() {
  const items = await this.fetchDownloadList()
  return Object.keys(items)
    .map(prepareSort)
    .sort()
    .map(teardownSort)
}

exports.fetchDownloadList = async function() {
  const items = await api.fetchSketchVersionsApi()
  const promises = items.map(async item => {
    const enclosure = item.enclosures[0]
    try {
      const isAvailable = await api.isAvailbleSketchLink(enclosure.url)
      if (!isAvailable) {
        return null
      }
      return formatDownloadItem(item)
    } catch (err) {
      return null // Worried ...
    }
  }, [])

  return Promise.all(promises).then(newItems => {
    return newItems.filter(item => !!item).reduce((merged, item) => {
      merged[item.version] = item
      return merged
    }, {})
  })
}

exports.localVersion = function() {
  return fs.readdirSync(pathManager.getSkvmHomePath(), "utf8")
    .filter(item => !isNaN(item))
}

exports.currentVersion = function() {
  const p = pathManager.getCurrentVersionPath()
  if (!pathManager.checkPath(p)) {
    throw Error("skvm: sketch app not installed")
  }
  return fs.readFileSync(p, "utf8")
}

function prepareSort(version) {
  return version.split(".").map(n => parseInt(n) + SORT_WEIGHT)
}

function teardownSort(sortedVersion) {
  return sortedVersion.map(n => parseInt(n) - SORT_WEIGHT).join(".")
}

function formatDownloadItem(item) {
  return {
    version: item.title.replace("Sketch", "").trim(),
    link: item.enclosures[0].url,
    publishDate: item.pubdate
  }
}
