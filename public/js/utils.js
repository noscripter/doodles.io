App.Utils = (function () {
  'use strict';

  var messageTimer;

  return {

    message: function (message, type, delay) {
      var timeoutDelay = 0;
      var messageElement = document.getElementById('message');
      type = type || 'info';
      delay = delay || 3;

      if (messageElement.className === 'open') {
        messageElement.className = '';
        clearTimeout(messageTimer);
        timeoutDelay = 200;
      }

      setTimeout(function () {
        messageElement.innerHTML = message;
        messageElement.dataset.type = type;
        messageElement.className = 'open';
        messageTimer = setTimeout(function () {
          messageElement.className = '';
        }, delay * 1000);
      }, timeoutDelay);
    },

    ajax: function (options, callback) {
      var factories = [
        function () {
          return new XMLHttpRequest();
        },
        function () {
          return new window.ActiveXObject('Msxml2.XMLHTTP');
        },
        function () {
          return new window.ActiveXObject('Msxml3.XMLHTTP');
        },
        function () {
          return new window.ActiveXObject('Microsoft.XMLHTTP');
        }
      ];
      var method = options.method || 'GET';
      var xhr = createXHRObject();

      if (!xhr) {
        return callback({
          success: false,
          error: 'An unknown error occurred. Please try again.'
        });
      }

      xhr.open(method, options.url, true);

      if (method === 'POST') {
        xhr.setRequestHeader('Content-type', 'application/json');
      }

      xhr.send(options.data ? JSON.stringify(options.data) : null);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            return callback(JSON.parse(xhr.responseText));
          } else {
            return callback({
              success: false,
              error: 'An unknown error occurred. Please try again.'
            });
          }
        }
      };

      function createXHRObject() {
        var xhr = null;
        for (var i = 0, l = factories.length; i < l; i++) {
          try {
            xhr = factories[i]();
          } catch (e) {
            continue;
          }
          break;
        }
        return xhr;
      }
    }

  };

})();
