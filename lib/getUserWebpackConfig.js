/* eslint-disable global-require, import/no-dynamic-require */
import fs from 'fs'
import paths from '../config/paths'

export default (env) => {
  if (!['dev', 'prod'].includes(env)) {
    return {}
  }

  const configPath = `${paths.root}/config/webpack.${env}.conf.js`
  if (fs.existsSync(configPath)) {
    const config = require(configPath)
    return config
  }

  return {}
}
