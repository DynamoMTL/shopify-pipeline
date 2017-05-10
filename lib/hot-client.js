/* global __whmEventSourceWrapper */
Object.keys(__whmEventSourceWrapper).forEach((key) => {
  __whmEventSourceWrapper[key].addMessageListener((event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.action === 'shopify_upload_finished') {
        // eslint-disable-next-line
        console.log('new files uploaded on shopify, you may want to refresh.');
        // window.location.reload();
      }
    } catch (ex) {
      // swallow the error... sometimes event.data is an emoji.. ?
    }
  });
});
