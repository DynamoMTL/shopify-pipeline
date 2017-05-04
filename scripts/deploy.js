/* eslint-disable no-use-before-define */

/*
- cache object records files to add or remove
- triggers deploy (which aborts if there is one in progress)
 */

const path = require('path');
const themekit = require('@shopify/themekit').command;

const config = {
  env: 'development',
  deployRoot: path.join(__dirname, '../dist'),
  defaultArgs: ['--no-update-notifier', '--config', '../config/shopify.yml'],
};

const cache = { upload: [], remove: [] };

let deploying = false;

function logDeploy(cmd, files) {
  // @TODO implement
  // eslint-disable-next-line
  console.log(`${cmd}: ${files.join(', ')}`);
}

function logError(err) {
  // @TODO implement
  // eslint-disable-next-line
  console.log(err);
}

// should be debounced
function maybeDeploy() {
  if (deploying) { return; }

  if (cache.upload.length) {
    deploy('upload', cache.upload, config.env);
    cache.upload = [];
  } else if (cache.remove.length) {
    deploy('remove', cache.upload, config.env);
    cache.remove = [];
  }
}

// cmd can be upload, remove or replace
function deploy(cmd, files = []) {
  deploying = true;

  return new Promise((resolve, reject) => {
    themekit({
      args: [cmd, ...config.defaultArgs, ...files],
      cwd: config.deployRoot,
    }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  }).then(() => {
    deploying = false;
    logDeploy(cmd, files);
    return maybeDeploy();
  }).catch((err) => {
    deploying = false;
    logError(err);
    return maybeDeploy();
  });
}

module.exports = {
  sync(files = { upload: [], remove: [] }) {
    if (files.uploads.length) {
      cache.upload = [...cache.upload, ...files.upload];
    }

    if (files.remove.length) {
      cache.remove = [...cache.remove, ...files.remove];
    }

    maybeDeploy();
  },

  overwrite() {
    deploy('replace');
  },
};
