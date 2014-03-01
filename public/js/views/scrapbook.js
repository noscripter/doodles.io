var Scrapbook = (function () {

  var deleteButtons;

  return {

    init: function () {
      deleteButtons = document.getElementsByClassName('trash');

      this.bindEvents();
    },

    bindEvents: function () {
      for (var i = 0, l = deleteButtons.length; i < l; i++) {
        deleteButtons[i].addEventListener('click', this.deleteClickHandler.bind(this), false);
      }
    },

    deleteClickHandler: function (e) {
      var li = e.target.parentNode.parentNode.parentNode.parentNode;
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
    }

  };

}());

if (document.getElementById('scrapbook')) {
  window.addEventListener('load', Scrapbook.init.bind(Scrapbook), false);
}
