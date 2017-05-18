#!/usr/bin/env node
/* eslint-disable comma-dangle, no-console */
const spawn = require('cross-spawn');
const paths = require('../config/paths');

const script = process.argv[2];
const args = process.argv.slice(3);

let result;

switch (script) {
  case 'build':
  case 'deploy':
  case 'serve':
    result = spawn.sync(
      'node',
      [require.resolve(`../scripts/${script}`)].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'test':
    result = spawn.sync(
      'jest',
      [].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  default:
    console.log(`Unknown script "${script}".`);
    console.log('Perhaps you need to update foobarify-scripts?');
    break;
}
