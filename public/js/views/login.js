var Login = (function () {

  var loginForm;

  return {

    init: function () {
      loginForm = document.getElementById('login_form');

      this.bindEvents();
    },

    bindEvents: function () {
      loginForm.addEventListener('submit', this.submit.bind(this), false);
    },

    submit: function (e) {
      e.preventDefault();

      var id = document.getElementById('id').value;
      var password = document.getElementById('password').value;

      Utils.ajax({
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
          Utils.message(response.error, 'error');
        }
      }.bind(this));
    }

  };

})();

if (document.getElementById('login_form')) {
  window.addEventListener('load', Login.init.bind(Login));
}
