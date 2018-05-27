#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const pkg = require('../package.json')
const skvm = require('../index')

const minimist = require('minimist')
const argv = minimist(process.argv.slice(2), {
  boolean: [
    'help',
    'version'
  ],
  alias: {
    h: 'help',
    v: 'version',
  }
})

if (argv.v) {
  console.log(pkg.version)
  process.exit()
}

if (argv.h) {
  showHelp()
  process.exit()
}

switch (argv._[0]) {
  case 'ls':
    skvm.versions.localVersion()
      .forEach(v => console.log(v))
    console.log(`\ncurrent: ${skvm.versions.currentVersion()}`)
    break;
  case 'ls-remote':
    skvm.versions.fetchShortVersions()
      .then(versions => {
        versions.forEach(v => console.log(v))
      })
    break;
  case 'install': {
    const version = argv._[1] + ''
    skvm.installer.download(version)
    break
  }
  case 'uninstall': {
    const version = argv._[1] + ''
    skvm.installer.removeEnv(version)
    break
  }
  case 'use': {
    const version = argv._[1] + ''
    skvm.installer.replaceEnv(version)
    break
  }
  default:
    showHelp()
}

function showHelp () {
  console.log('Usage:')
  console.log('  skvm install <version>    Download and install <version>')
  console.log('  skvm uninstall <version>  Uninstall <version>')
  console.log('  skvm use <version>        Use <version>')
  console.log('  skvm ls                   List local versions')
  console.log('  skvm ls-remote            List remote versions')
}
