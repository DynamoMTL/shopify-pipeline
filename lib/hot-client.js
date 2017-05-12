/* eslint-disable */
// remove trailing slash from webpack public path
// see https://github.com/glenjamin/webpack-hot-middleware/issues/154
const tmpPublicPath = __webpack_public_path__;
 __webpack_public_path__ = __webpack_public_path__.replace(/\/$/, '');
const client = require('webpack-hot-middleware/client?dynamicPublicPath=true');
// and add the trailing slash again so we don't run into issue with webpack itself...
 __webpack_public_path__ = tmpPublicPath;

client.subscribe((event) => {
  if (event.action === 'shopify_upload_finished') {
    window.location.reload();
  }
})
