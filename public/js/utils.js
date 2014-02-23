doodles.utils = {

  displayMessage: function (message, type, delay) {
    var type = type || 'info';
    var delay = delay || 3;
    var timeout;
    var timeoutDelay = 0;
    var messageElement = document.getElementById('message');
    if (messageElement.className == 'open') {
      messageElement.className = '';
      clearTimeout(timeout);
      timeoutDelay = 200;
    }
    setTimeout(function () {
      messageElement.innerHTML = message;
      messageElement.dataset.type = type;
      messageElement.className = 'open';
      timeout = setTimeout(function () {
        messageElement.className = '';
      }, delay * 1000);
    }, timeoutDelay);
  }

}