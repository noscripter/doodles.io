var Scrapbook = (function () {

  var deleteButtons;
  var imageLinks;
  var imageCounter;

  return {

    init: function () {
      deleteButtons = document.getElementsByClassName('trash');
      imageLinks = document.getElementsByClassName('doodle_image_link');
      imageCounter = 0;

      this.bindEvents();
    },

    bindEvents: function () {
      for (var i = 0, l = deleteButtons.length; i < l; i++) {
        deleteButtons[i].addEventListener('click', this.deleteClickHandler.bind(this), false);
      }

      this.imageHandler(imageLinks[0]);
    },

    deleteClickHandler: function (e) {
      e.preventDefault();
      var li = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
      Utils.ajax({
        url: '/' + li.dataset.slug,
        method: 'DELETE',
        data: {
          slug: li.dataset.slug
        }
      }, function (res) {
        if (!res.success) {
          Utils.message(res.error, 'error');
        } else {
          li.parentNode.removeChild(li);
          Utils.message('Doodle deleted successfully.', 'success');
        }
      });
    },

    imageHandler: function (element) {
      var image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = element.dataset.image_url + '?c=' + Date.now();
      image.alt = element.dataset.image_alt;
      image.addEventListener('load', function () {
        element.className = element.className.replace(/\bloader\b/,'');
        element.appendChild(image);
        imageCounter++;
        if (imageCounter < imageLinks.length) {
          this.imageHandler(imageLinks[imageCounter]);
        }
      }.bind(this));
    }

  };

}());

if (document.getElementById('scrapbook')) {
  window.addEventListener('load', Scrapbook.init.bind(Scrapbook), false);
}
