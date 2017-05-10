/* eslint-disable import/no-dynamic-require, no-underscore-dangle, no-unused-vars */

// The `allstaticfiles` context is replaced in `config/webpack.base.conf.js`
// with the ContextReplacementPlugin. This was required so that we could require
// an entire directory from the executing app directory.
// (ie.: we run in ./node_modules/foobarify-scripts but want to require ./src)
const paths = require('../config/paths');

const theDynamicPart = 'salut';
const __svg__ = { path: `${paths.src}/src/assets/images/svg/**/*.svg`, name: 'store.svg' };
require(`./allstaticfiles/${theDynamicPart}`);
