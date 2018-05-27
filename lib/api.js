const https = require("https")

const FeedParser = require("feedparser")

const URL = "https://download.sketchapp.com/sketch-versions.xml"

exports.fetchSketchVersionsApi = function() {
  return new Promise((resolve, reject) => {
    const feedParser = new FeedParser()
    const req = https.get(URL, res => {
      res.setEncoding("utf8")
      res.pipe(feedParser)
      res.on("end", () => {
        let items = []
        let chunk
        while ((chunk = feedParser.read()) !== null) items.push(chunk)
        resolve(items)
      })
    })
    req.on("error", reject)
  })
}

exports.isAvailbleSketchLink = function(link) {
  return new Promise((resolve, reject) => {
    const req = https.get(link, res => {
      res.on("error", reject)
      // invalid link response is 403
      if (res.statusCode !== 200) {
        req.abort()
        return resolve(false)
      }
      req.abort()
      resolve(true)
    })
    req.on("error", reject)
  })
}

exports.downloadSketchZip = function(link, writer, opts = {}) {
  return new Promise((resolve, reject) => {
    writer.on("error", reject)

    const req = https.get(link, res => {
      if (res.statusCode !== 200) {
        throw new Error("server respond " + res.statusCode)
      }

      if (opts.progress) {
        const progress = opts.progress
        progress.setLength(res.headers["content-length"])
        res = res.pipe(progress)
      }

      res.pipe(writer)
      res.on("end", () => resolve())
      res.on("error", err => reject(err))
    })
    req.on("error", err => reject(err))
  })
}
