// http://stackoverflow.com/a/30652110
// const regex = /^((?![\\/]layout[\\/]).)*\.liquid$/;
// var req = require.context('.', true, /^((?![\\/]node_modules|vendor[\\/]).)*\.md$/);
function requireAll(r) { r.keys().forEach(r); }
// requireAll(require.context('../src', true, regex));
requireAll(require.context('../src', true, /\.liquid$/));
