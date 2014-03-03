App.Login = (function () {
  'use strict';

  var loginForm;

  return {

    init: function () {
      loginForm = document.getElementById('login');

      this.bindEvents();
    },

    bindEvents: function () {
      loginForm.addEventListener('submit', this.submit.bind(this), false);
    },

    submit: function (e) {
      e.preventDefault();

      var id = document.getElementById('id').value;
      var password = document.getElementById('password').value;

      App.Utils.ajax({
        method: 'POST',
        url: '/login',
        data: {
          id: id,
          password: password
        }
      }, function (response) {
        if (response.success) {
          window.location = '/new';
        } else {
          App.Utils.message(response.error, 'error');
        }
      }.bind(this));
    }

  };

})();

if (document.getElementById('login')) {
  window.addEventListener('load', App.Login.init.bind(App.Login));
}
