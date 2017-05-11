/* eslint-disable no-console */
const chalk = require('chalk');

module.exports = (requestedEnv, shopifyConfig) => {
  if (!requestedEnv) {
    console.log(chalk.yellow('\nEnvironment not provided, defaulting to "development".\n'));
    return 'development';
  }

  if (!shopifyConfig[requestedEnv]) {
    console.log(chalk.red(`\nProvided environment ("${requestedEnv}") does not exists.\n`));
    process.exit(1);
  }

  return requestedEnv;
};
