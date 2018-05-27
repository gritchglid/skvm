const fs = require("fs")
const path = require("path")

const trash = require("trash")
const progressStreamCreator = require("progress-stream")

const testee = require("../src/installer")
const apiMock = require("../src/api")
const pathManagerMock = require("../src/path_manager")
const versionsMock = require("../src/versions")
const apiHelper = require("./api_helper")

const TEST_DIR_PREFIX = "installer_test_"

jest.mock("../src/api")
jest.mock("../src/path_manager")
jest.mock("../src/versions")

afterAll(() => {
  trash(path.join(__dirname, TEST_DIR_PREFIX + "*"))
})

test("Success to download zip file", async () => {
  versionsMock.fetchDownloadList.mockResolvedValueOnce(createVasionMock())

  const tmpFilePath = fs.mkdtempSync(path.join(__dirname, TEST_DIR_PREFIX))
  const versionPath = path.join(tmpFilePath, "50.1")

  pathManagerMock.createZipPath.mockReturnValueOnce(
    path.join(__dirname, "fake.zip")
  )

  pathManagerMock.createVersionPath.mockReturnValueOnce(versionPath)

  pathManagerMock.createAppPath.mockReturnValueOnce("FakeDir")

  apiMock.downloadSketchZip.mockResolvedValueOnce(null)

  expect.assertions(1)
  const actual = await testee.download("50.1", () => {
    const outputFiles = fs.readdirSync(versionPath, "utf8")
    expect(outputFiles.includes("fake")).toBe(true)
  })
  expect(actual).toBeDefined()
})

test("Unavailable version", () => {
  versionsMock.fetchDownloadList.mockResolvedValueOnce({})

  expect(testee.download("50.1")).rejects.toEqual(
    new Error(`skvm: definition not found: 50.1`)
  )
})

test("Create and remove symlink", async () => {
  const tmpFilePath = fs.mkdtempSync(path.join(__dirname, TEST_DIR_PREFIX))

  pathManagerMock.createAppPath.mockReturnValue(
    path.join(__dirname, "fake.app")
  )

  pathManagerMock.checkPath.mockReturnValue(true)

  pathManagerMock.getSymlinkPath.mockReturnValue(
    path.join(tmpFilePath, "fake_symlink")
  )

  pathManagerMock.getCurrentVersionPath.mockReturnValue(
    path.join(tmpFilePath, "fake_symlink_current")
  )

  pathManagerMock.createVersionPath.mockReturnValue(tmpFilePath)

  await testee.replaceEnv("50.1")
  const outputFiles = fs.readdirSync(tmpFilePath, "utf8")
  expect(outputFiles.includes("fake_symlink")).toBe(true)
  expect(outputFiles.includes("fake_symlink_current")).toBe(true)

  await testee.removeEnv("50.1")
  const outputFiles2 = fs.readdirSync(__dirname, "utf8")
  expect(outputFiles.includes(tmpFilePath)).toBe(false)
})

test("Replace that is not install version", () => {
  pathManagerMock.checkPath.mockReturnValue(false)

  expect(testee.replaceEnv("50.1")).rejects.toEqual(
    new Error(`skvm: 50.1 is not installed`)
  )
})

test("Remove that is not install version", () => {
  pathManagerMock.checkPath.mockReturnValue(false)

  expect(testee.removeEnv("50.1")).rejects.toEqual(
    new Error(`skvm: 50.1 is not installed`)
  )
})

function createVasionMock() {
  return {
    "50.1": {
      version: "50.1",
      link: "https://download.sketchapp.com/sketch-50.1-55044.zip",
      publishDate: "2018-05-14T15:00:00.000Z"
    }
  }
}
