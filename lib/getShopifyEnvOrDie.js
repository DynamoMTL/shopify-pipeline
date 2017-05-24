import chalk from 'chalk'

export default (requestedEnv, shopifyConfig) => {
  if (!requestedEnv) {
    console.log(chalk.yellow('\nEnvironment not provided, defaulting to "development".\n'))
    return 'development'
  }

  if (!shopifyConfig[requestedEnv]) {
    console.log(chalk.red(`\nProvided environment ("${requestedEnv}") does not exists.\n`))
    process.exit(1)
  }

  return requestedEnv
}
