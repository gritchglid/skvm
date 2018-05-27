# skvm - Sketch.app Version Manager

<div align="center" style="margin:30px 0">
  <a href="https://github.com/gritchglid">
    <img width=360px src="https://morishitter.github.io/skvm-logo.svg">
  </a>
</div>
<br>

<p align="center">
  <a href="https://travis-ci.org/gritchglid/skvm">
    <img src="https://camo.githubusercontent.com/e688e140da51d197ac1230acf711eb12f85f70be/68747470733a2f2f7472617669732d63692e6f72672f6d6f7269736869747465722f73637373666d742e737667" alt="Build Status" data-canonical-src="https://travis-ci.org/gritchglid/skvm.svg" style="max-width:100%;">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/license-MIT-444444.svg?style=flat-square" alt="License">
  </a>
</p>

## Installation

NPM:

```
$ npm install -g skvm
```

Yarn:

```
$ yarn global add skvm
```

## Usage

```
$ skvm --help
```

```
Usage:
  skvm install <version>    Download and install <version>
  skvm uninstall <version>  Uninstall <version>
  skvm use <version>        Use <version>
  skvm ls                   List local versions
  skvm ls-remote            List remote versions
```

### `skvm install <version>`

Download and install `<version>`.

Example:

```
$ skvm install v50.2
```

### `skvm use <version>`

Use `<version>`.

Example:

```
$ skvm use v50.2
```

### `skvm ls`

List local versions.

### `skvm ls-remote`

List remote versions.

### `skvm uninstall <version>`

Uninstall `<version>`.
