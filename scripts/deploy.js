/* eslint-disable comma-dangle */
const spawn = require('cross-spawn');

const args = process.argv.slice(3);

const result = spawn.sync(
  'node',
  [require.resolve('./build'), '--deploy'].concat(args),
  { stdio: 'inherit' }
);

process.exit(result.status);
