doodles.init = function () {
  FastClick.attach(document.body);
  doodles.login.init();
  doodles.register.init();
}

window.addEventListener('load', doodles.init);