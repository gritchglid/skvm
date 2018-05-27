const path = require("path")

const testee = require("../src/path_manager")

test("Get current version path", () => {
  expect(testee.getCurrentVersionPath()).toBe(
    path.join(process.env["HOME"], ".skvm", "current")
  )
})

test("Get version path", () => {
  expect(testee.createVersionPath("x.x.x")).toBe(
    path.join(process.env["HOME"], ".skvm", "x.x.x")
  )
})

test("Get symlink path", () => {
  expect(testee.getSymlinkPath("x.x.x")).toBe(
    path.join(path.join("/", "Applications", "Sketch.app"))
  )
})

test("Should return true if correct file path", () => {
  const testPath = path.join(__dirname, "path_manager.test.js")
  expect(testee.checkPath(testPath)).toBe(true)
})

test("Should return false if incorrect file path", () => {
  const testPath = path.join(__dirname, "fakefile_path")
  expect(testee.checkPath(testPath)).toBe(false)
})
