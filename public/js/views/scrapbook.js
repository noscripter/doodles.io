doodles.scrapbook = {

  init: function () {
    console.log('here');
    var removeButtons = document.getElementsByClassName('remove-btn');
    if (removeButtons) {
      for (var i = 0, l = removeButtons.length; i < l; i++) {
        this.addEvent(removeButtons[i]);
      }
    }
  },

  addEvent: function (button) {
    button.addEventListener('click', function () {
      doodles.scrapbook.remove(button.dataset.slug)
    }, false);
  },

  remove: function (slug) {
    console.log('remove ', slug);
  }

};

window.addEventListener('load', doodles.scrapbook.init.bind(doodles.scrapbook));
