/* eslint-disable no-use-before-define, no-console */

/*
- cache object records files to add or remove
- triggers deploy (which aborts if there is one in progress)
*/

const prompt = require('react-dev-utils/prompt');
const themekit = require('@shopify/themekit').command;
const paths = require('../config/paths');
const promptIfMainTheme = require('./promptIfMainTheme');

const config = {
  env: 'development',
  deployRoot: paths.dist,
  defaultArgs: [
    '--no-update-notifier',
    '--config', paths.userShopifyConfig,
  ],
};

const cache = { upload: [], remove: [] };

let deploying = false;

// @TODO refactor out
function logError(err) {
  console.log(err);
}

// should be debounced
function maybeDeploy() {
  if (deploying) { return Promise.reject(); }

  let promise;

  if (cache.upload.length) {
    promise = deploy('upload', cache.upload, config.env);
    cache.upload = [];
  } else if (cache.remove.length) {
    promise = deploy('remove', cache.upload, config.env);
    cache.remove = [];
  }

  return promise || Promise.resolve();
}

// cmd can be upload, remove or replace
function deploy(cmd = '', files = []) {
  if (!['upload', 'remove', 'replace'].includes(cmd)) {
    throw new Error('shopify-deploy.deploy() first argument must be either "upload", "remove", "replace"');
  }

  deploying = true;

  return new Promise((resolve, reject) => {
    themekit({
      args: [cmd, ...config.defaultArgs, ...files],
      cwd: config.deployRoot,
    }, (err) => {
      deploying = false;

      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  }).then(() => {
    deploying = false;
    return maybeDeploy();
  }).catch((err) => {
    deploying = false;
    logError(err);
    return maybeDeploy();
  });
}

module.exports = {
  sync({ upload = [], remove = [] } = {}) {
    return new Promise((resolve, reject) => {
      promptIfMainTheme(config.env).then(() => {
        if (upload.length) {
          // remove duplicate
          cache.upload = [...new Set([...cache.upload, ...upload])];
        }

        if (remove.length) {
          cache.remove = [...new Set([...cache.remove, ...remove])];
        }

        maybeDeploy().then(resolve).catch(reject);
      }).catch(reject); // user aborted deploy
    });
  },

  overwrite() {
<<<<<<< HEAD
    const message = `Environment is ${config.env}. Go ahead with "replace" ?`;

    return new Promise((resolve, reject) => {
      prompt(message, false).then((isYes) => {
        if (isYes) {
          promptIfMainTheme(config.env).then(() => {
            deploy('replace').then(resolve).catch(reject);
          }).catch(reject); // user aborted deploy
        } else {
          reject('Aborting. You aborted the deploy.');
        }
      });
||||||| merged common ancestors
    prompt.start();

    const schema = {
      properties: {
        confirm: {
          description: `Environment is ${config.env}. Go ahead with "replace" ? (Yes/Y)`,
        },
      },
    };

    prompt.get(schema, (err, result) => {
      if (['Yes', 'Y'].includes(result.confirm)) {
        deploy('replace');
      } else {
        console.log('Deploy canceled.');
      }
=======
    const message = `Environment is ${config.env}. Go ahead with "replace" ?`;

    prompt(message, false).then((isYes) => {
      if (isYes) {
        deploy('replace');
      } else {
        console.log('Deploy canceled.');
      }
>>>>>>> Simpler prompt with react-dev-utils/prompt
    });
  },
};
