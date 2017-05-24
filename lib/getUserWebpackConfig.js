/* eslint-disable global-require, import/no-dynamic-require */
import fs from 'fs'
import config from '../config'

/**
 * Find and return the user webpack config or an empty object if none is found.
 *
 * @param   env   String  The environment
 * @return        Object
 */
export default (env) => {
  if (!['dev', 'prod'].includes(env)) {
    return {}
  }

  const configPath = `${config.paths.root}/config/webpack.${env}.conf.js`
  if (fs.existsSync(configPath)) {
    const config = require(configPath)
    return config
  }

  return {}
}
