/* eslint-disable */

// The `allstaticfiles` context is replaced in `config/webpack.base.conf.js`
// with the ContextReplacementPlugin. This was required so that we could require
// an entire directory from the executing app directory.
// (ie.: we run in ./node_modules/foobarify-scripts but want to require ./src)
var theDynamicPart = 'salut';
require('./allstaticfiles/' + theDynamicPart);
