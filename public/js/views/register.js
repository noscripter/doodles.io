var Register = (function () {

  var registerForm;

  return {

    init: function () {
      registerForm = document.getElementById('register_form');

      this.bindEvents();
    },

    bindEvents: function () {
      registerForm.addEventListener('submit', this.submit.bind(this), false);
    },

    submit: function (e) {
      e.preventDefault();

      var username = document.getElementById('username').value;
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;

      Utils.ajax({
        method: 'POST',
        url: '/register',
        data: {
          username: username,
          email: email,
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

if (document.getElementById('register_form')) {
  window.addEventListener('load', Register.init.bind(Register));
}
