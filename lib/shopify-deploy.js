/* eslint-disable no-use-before-define */
const prompt = require('react-dev-utils/prompt')
const themekit = require('@shopify/themekit').command
const paths = require('../config/paths')
const promptIfMainTheme = require('./promptIfMainTheme')

const config = {
  env: 'development',
  deployRoot: paths.dist,
  defaultArgs: [
    '--no-update-notifier',
    '--config', paths.userShopifyConfig
  ]
}

let deploying = false
let filesToDeploy = []

function maybeDeploy() {
  if (deploying) {
    return Promise.reject('Deploy already in progress.')
  }

  if (filesToDeploy.length) {
    const files = [...filesToDeploy]
    filesToDeploy = []
    return deploy('upload', files, config.env)
  }

  return Promise.resolve()
}

/**
 * Deploy to Shopify using themekit.
 *
 * @param   cmd     String    The command to run
 * @param   files   Array     An array of files to deploy
 * @return          Promise
 */
function deploy(cmd = '', files = []) {
  if (!['upload', 'replace'].includes(cmd)) {
    throw new Error('shopify-deploy.deploy() first argument must be either "upload", "replace"')
  }

  deploying = true

  return new Promise((resolve, reject) => {
    themekit({
      args: [cmd, ...config.defaultArgs, ...files],
      cwd: config.deployRoot
    }, (err) => {
      deploying = false

      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  }).then(() => {
    deploying = false
    return maybeDeploy()
  }).catch((err) => {
    deploying = false
    console.error(err)
    return maybeDeploy()
  })
}

module.exports = {
  sync(env, files = []) {
    if (!files.length) {
      return Promise.reject('No files to deploy.')
    }

    config.env = env

    return new Promise((resolve, reject) => {
      promptIfMainTheme(config.env).then(() => {
        // remove duplicate
        filesToDeploy = [...new Set([...filesToDeploy, ...files])]

        maybeDeploy().then(resolve).catch(reject)
      }).catch(reject) // user aborted deploy
    })
  },

  overwrite(env) {
    config.env = env

    return new Promise((resolve, reject) => {
      const message = `Environment is ${config.env}. Go ahead with "replace" ?`

      prompt(message, false).then((isYes) => {
        if (isYes) {
          promptIfMainTheme(config.env).then(() => {
            deploy('replace').then(resolve).catch(reject)
          }).catch(reject) // user aborted deploy
        } else {
          reject('Aborting. You aborted the deploy.')
        }
      })
    })
  }
}
