var validate = module.exports = {

  presence: function (data) {
    if (toString.call(data) === '[object Array]') {
      for (var i in data) {
        if (!data[i]) {
          break;
        }
        if (data[data.length - 1]) {
          return true;
        }
      }
      return false;
    }
    if (data) {
      return true;
    }
    return false;
  },

  email: function (email) {
    var regex = /^([a-zA-Z0-9_\.-]+)@([\da-zA-Z\.-]+)\.([a-zA-Z\.]{2,6})$/;

    if (regex.test(email)) {
      return true;
    }
    return false;
  },

  username: function (username) {
    var regex = /^[a-zA-Z0-9_]+$/;

    if (regex.test(username)) {
      return true;
    }
    return false;
  },

  hex: function (hex) {
    var regex = /(^[0-9a-fA-F]{6}$)|(^[0-9a-fA-F]{3}$)/;

    if (regex.test(hex)) {
      return true;
    }
    return false;
  }
  
}