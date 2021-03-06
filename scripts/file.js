const glob = require('glob')
const fs = require('fs')
const path = require('path')
const wcmatch = require('wildcard-match')

function list(pattern, include = [], exclude = []) {
  return new Promise(resolve => {
    glob(pattern, function (err, files) {
      if (include.length) {
        files = files.filter(filename => include.some(item => wcmatch(item)(filename)))
      }

      if (exclude.length) {
        files = files.filter(filename => !exclude.some(item => wcmatch(item)(filename)))
      }

      resolve(files)
    })
  })
}

function load(filename) {
  const filePath = path.resolve(filename)

  return require(filePath)
}

function read(filename) {
  return fs.readFileSync(filename, { encoding: 'utf8' })
}

function write(filename, data) {
  const dir = path.resolve(path.dirname(filename))
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  fs.writeFileSync(path.resolve(filename), data)
}

module.exports = {
  list,
  read,
  write,
  load
}
