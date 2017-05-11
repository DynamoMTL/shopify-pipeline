/* eslint-disable global-require, import/no-dynamic-require */
const fs = require('fs');
const paths = require('../config/paths');

module.exports = (env) => {
  if (!['dev', 'prod'].includes(env)) {
    return {};
  }

  const configPath = `${paths.root}/config/webpack.${env}.conf.js`;
  if (fs.existsSync(configPath)) {
    const config = require(configPath);
    console.log(config);
    return config;
  }

  return {};
};
