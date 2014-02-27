var App = (function () {

  return {

    init: function () {
      FastClick.attach(document.body);
    }

  };

})();

window.addEventListener('load', App.init.bind(App));
