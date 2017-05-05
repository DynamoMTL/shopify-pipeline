// Dynamically require all files matching a regex.
// Keeps working after adding/removing file from the filesystem.
// http://stackoverflow.com/a/30652110
function requireAll(r) { r.keys().forEach(r); }
// custom lookbehind implementation - http://stackoverflow.com/a/7376612
requireAll(require.context('../src', true, /^(?:(?!theme\.liquid$).)*\.(liquid|json)$/));
