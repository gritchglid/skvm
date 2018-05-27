const path = require("path")

const testee = require("../src/versions")
const apiMock = require("../src/api")
const fsMock = require("fs")
const pathManagerMock = require("../src/path_manager")
const apiHelper = require("./api_helper")

jest.mock("fs")
jest.mock("../src/api")
jest.mock("../src/path_manager")

test("Sorted versions", async () => {
  apiMock.fetchSketchVersionsApi.mockResolvedValueOnce(
    apiHelper.createVersionsResponseMock()
  )

  apiMock.isAvailbleSketchLink.mockResolvedValue(true)

  expect.assertions(1)
  const actual = await testee.fetchShortVersions()

  const expected = ["3.8", "39.1", "50.1"]
  expect(actual).toEqual(expected)
})

test("Success fetch download list", async () => {
  apiMock.fetchSketchVersionsApi.mockResolvedValueOnce(
    apiHelper.createVersionsResponseMock()
  )

  apiMock.isAvailbleSketchLink.mockResolvedValue(true)

  expect.assertions(1)
  const actual = await testee.fetchDownloadList()

  const expected = {
    "50.1": {
      version: "50.1",
      link: "https://download.sketchapp.com/sketch-50.1-55044.zip",
      publishDate: "2018-05-14T15:00:00.000Z"
    },
    "3.8": {
      version: "3.8",
      link: "https://download.sketchapp.com/sketch-3.8-29681.zip",
      publishDate: "2016-05-18T15:00:00.000Z"
    },
    "39.1": {
      version: "39.1",
      link: "https://download.sketchapp.com/sketch-39.1-31720.zip",
      publishDate: "2016-07-24T15:00:00.000Z"
    }
  }
  expect(actual).toEqual(expected)
})

test("Filter fetch download list", async () => {
  apiMock.fetchSketchVersionsApi.mockResolvedValueOnce(
    apiHelper.createVersionsResponseMock()
  )

  apiMock.isAvailbleSketchLink
    .mockResolvedValueOnce(true)
    .mockResolvedValueOnce(false)
    .mockResolvedValueOnce(false)

  expect.assertions(1)
  const actual = await testee.fetchDownloadList()

  const expected = {
    "50.1": {
      version: "50.1",
      link: "https://download.sketchapp.com/sketch-50.1-55044.zip",
      publishDate: "2018-05-14T15:00:00.000Z"
    }
  }
  expect(actual).toEqual(expected)
})

test("Filter error version", async () => {
  apiMock.fetchSketchVersionsApi.mockResolvedValueOnce(
    apiHelper.createVersionsResponseMock()
  )

  apiMock.isAvailbleSketchLink
    .mockResolvedValueOnce(true)
    .mockResolvedValueOnce(true)
    .mockImplementation(() => {
      throw new Error("Unexpected error")
    })

  expect.assertions(1)
  const actual = await testee.fetchDownloadList()

  const expected = {
    "50.1": {
      version: "50.1",
      link: "https://download.sketchapp.com/sketch-50.1-55044.zip",
      publishDate: "2018-05-14T15:00:00.000Z"
    },
    "3.8": {
      version: "3.8",
      link: "https://download.sketchapp.com/sketch-3.8-29681.zip",
      publishDate: "2016-05-18T15:00:00.000Z"
    }
  }
  expect(actual).toEqual(expected)
})

test("Failed to fetch sketch versions", () => {
  apiMock.fetchSketchVersionsApi.mockImplementation(() => {
    throw new Error("Unexpected error")
  })

  expect.assertions(1)
  expect(testee.fetchDownloadList()).rejects.toEqual(
    new Error("Unexpected error")
  )
})

test("Get current version path", () => {
  pathManagerMock.getCurrentVersionPath.mockReturnValueOnce("fake_path")

  pathManagerMock.checkPath.mockReturnValueOnce(true)

  fsMock.readFileSync.mockReturnValueOnce("50.1")

  expect(testee.currentVersion()).toBe("50.1")
})

test("Not used skvm", () => {
  pathManagerMock.checkPath.mockReturnValueOnce(false)

  expect(() => testee.currentVersion()).toThrow(
    "skvm: sketch app not installed"
  )
})
