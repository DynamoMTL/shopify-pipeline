/* global __whmEventSourceWrapper */
Object.keys(__whmEventSourceWrapper).forEach((key) => {
  __whmEventSourceWrapper[key].addMessageListener((event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.action === 'shopify_upload_finished') {
        window.location.reload();
      }
    } catch (ex) {
      // swallow the error... sometimes event.data is an emoji.. ?
    }
  });
});
