const config = require('../config');

// Dynamically require all files matching a regex.
// Keeps working after adding/removing file from the filesystem.
// http://stackoverflow.com/a/30652110
function requireAll(r) { r.keys().forEach(r); }
requireAll(require.context('../src', true, config.regex.static));
