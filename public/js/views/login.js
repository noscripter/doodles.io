doodles.login = {

  init: function () {
    var loginForm = document.getElementById('login_form');
    if (loginForm) {
      loginForm.addEventListener('submit', doodles.login.submit);
    }
  },

  submit: function (e) {
    e.preventDefault();

    var id = document.getElementById('id').value;
    var password = document.getElementById('password').value;
    
    doodles.utils.ajax({
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
        doodles.utils.displayMessage(response.error, 'error');
      }
    }.bind(this));
  }

}

window.addEventListener('load', doodles.login.init);