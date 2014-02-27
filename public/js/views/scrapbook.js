var Scrapbook = (function () {

  var deleteButtons;

  return {

    init: function () {
      deleteButtons = document.getElementsByClassName('delete_button');

      this.bindEvents();
    },

    bindEvents: function () {
      for (var i = 0, l = deleteButtons.length; i < l; i++) {
        deleteButtons[i].addEventListener('click', this.deleteClickHandler.bind(this), false);
      }
    },

    deleteClickHandler: function (e) {
      Utils.ajax({
        url: '/' + e.target.parentNode.dataset.slug,
        method: 'DELETE',
        data: {
          slug: e.target.parentNode.dataset.slug
        }
      }, function (res) {
        if (!res.success) {
          Utils.message(res.error, 'error');
        } else {
          e.target.parentNode.parentNode.removeChild(e.target.parentNode);
          Utils.message('Doodle deleted successfully.', 'success');
        }
      });
    }

  };

}());

if (document.getElementById('scrapbook')) {
  window.addEventListener('load', Scrapbook.init.bind(Scrapbook), false);
}
