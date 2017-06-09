const fs = require('fs-extra')
const path = require('path')
const paths = require('../config/paths')

// @TODO find out a way to never run this twice ?

const packageJsonPath = path.join(paths.root, 'package.json')
// eslint-disable-next-line
const packageJson = require(packageJsonPath)

packageJson.scripts = {
  serve: 'foobarify-scripts serve',
  build: 'foobarify-scripts build',
  deploy: 'foobarify-scripts build --deploy',
  test: 'foobarify-scripts test --coverage'
}
packageJson.babel = { presets: ['env'] }

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

fs.copySync(path.join(__dirname, '../template'), paths.root)
fs.copySync(path.join(__dirname, '../README.md'), path.join(paths.root, 'README.md'))

fs.moveSync(path.join(paths.root, 'gitignore'), path.join(paths.root, '.gitignore'))
