var App = (function () {
  'use strict';

  return {

    init: function () {
      FastClick.attach(document.body);
    }

  };

})();

window.addEventListener('load', App.init.bind(App));
