import chalk from 'chalk'

/**
 * Retrieve the requested environment form the Shopify config file or die otherwise.
 *
 * @return String|void
 */
export default (requestedEnv, shopifyConfig) => {
  if (!requestedEnv && shopifyConfig.development) {
    console.log(chalk.yellow('\nEnvironment not provided, defaulting to "development".\n'))
    return 'development'
  }

  if (!shopifyConfig[requestedEnv]) {
    console.log(chalk.red(`\nProvided environment ("${requestedEnv}") does not exists.\n`))
    process.exit(1)
  }

  return requestedEnv
}
