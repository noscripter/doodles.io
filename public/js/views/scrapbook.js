var Scrapbook = (function () {

  var element;

  return {

    init: function () {
      element = document.getElementById('scrapbook');
      this.bindEvents();
    },

    bindEvents: function () {
      var buttons = document.getElementsByClassName('remove');
      for (var i = 0, l = buttons.length; i < l; i++) {
        this.addEventToElement(buttons[i]);
      }
    },

    addEventToElement: function (elem) {
      var parent = elem.parentNode;
      elem.addEventListener('click', function () {
        this.removeDoodle(parent.dataset.slug, function () {
          parent.parentNode.removeChild(parent);
        })
      }.bind(this), false);
    },

    removeDoodle: function (slug, callback) {
      console.log('hrere');
      doodles.utils.ajax({
        url: '/' + slug,
        method: 'DELETE',
        data: {
          slug: slug
        }
      }, function (res) {
        if (!res.success) {
          // WHAT! Give user the error!
        }
        return callback();
      });
    }

  }

}());

if (document.getElementById('scrapbook')) {
  window.addEventListener('load', Scrapbook.init.bind(Scrapbook), false);
}
