module.exports = {

  presence: function (data) {
    // Data is an array.
    if (data instanceof Array) {
      for (var i in data) {
        if (!data[i])
          break;
        if (data[data.length - 1])
          return true;
      }
      return false;
    }
    // Data is simply a string.
    if (data)
      return true;
    return false;
  },

  email: function (email) {
    var emailRegex = /^([a-zA-Z0-9_\.-]+)@([\da-zA-Z\.-]+)\.([a-zA-Z\.]{2,6})$/;
    if (emailRegex.test(email))
      return true;
    return false;
  },

  username: function (username) {
    var usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (usernameRegex.test(username))
      return true;
    return false;
  },

  hex: function (hex) {
    var reghex = /(^[0-9a-fA-F]{6}$)|(^[0-9a-fA-F]{3}$)/;
    if (reghex.test(hex))
      return true;
    return false;
  }
  
}