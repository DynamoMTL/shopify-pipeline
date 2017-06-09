/*eslint-disable */
var sideEffectNode = document.createElement('div');
sideEffectNode.textContent = 'salut bonjour salut';
document.body.appendChild(sideEffectNode);

// Remove the most recently-added <div> so that when the code runs again and
// adds a new <div>, we don't end up with duplicate divs.
if (module.hot) {
  console.log('accepting the update');

  module.hot.dispose(function() {
    sideEffectNode.parentNode.removeChild(sideEffectNode);
  });

  module.hot.accept();
}
