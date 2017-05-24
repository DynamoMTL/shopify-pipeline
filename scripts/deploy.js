import spawn from 'cross-spawn'

const args = process.argv.slice(3)

const result = spawn.sync(
  'babel-node',
  [require.resolve('./build'), '--deploy'].concat(args),
  { stdio: 'inherit' }
)

process.exit(result.status)
