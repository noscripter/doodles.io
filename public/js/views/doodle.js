var Doodle = (function () {

  var titleLength;
  var titleElement;
  var titlePlaceholder;

  var canvasElement;
  var tempCanvasElement;
  var imageElement;
  var messageElement;

  var colorElements;
  var color;

  var context;
  var tempContext;

  var mouse;
  var mouseStart;
  var points;

  var timer;

  var onPaintHandler;

  return {

    init: function () {
      titleElement = document.getElementById('doodle_title');
      titleLength = 0;
      titlePlaceholder = titleElement.dataset.value;

      canvasElement = document.getElementById('doodle_canvas');
      imageElement = document.getElementById('doodle_image');
      tempCanvasElement = document.createElement('canvas');
      messageElement = document.getElementById('save_text');

      colorElements = document.getElementsByClassName('color_element');
      color = 'blue';

      canvasElement.width = 1000;
      canvasElement.height = 1000;

      tempCanvasElement.id = 'doodle_canvas_temp';
      tempCanvasElement.width = canvasElement.width;
      tempCanvasElement.height = canvasElement.height;
      imageElement.appendChild(tempCanvasElement);

      context = canvasElement.getContext('2d');
      tempContext = tempCanvasElement.getContext('2d');

      mouse = { x: 0, y: 0 };
      mouseStart = { x: 0, y: 0 };
      points = [];

      timer = null;

      // Holds a reference to a bound function.
      onPaintHandler;

      // Check to see if we're editing or creating a doodle.
      if (typeof currentDoodle !== 'undefined') {
        titleElement.value = currentDoodle.title || titlePlaceholder;
        titleElement.className = titleElement.value === titlePlaceholder ? 'placeholder' : '';
        titleLength = currentDoodle.title.length;

        // Create a new Image object to allow us to draw the image to the canvas.
        var image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = currentDoodle.image;
        image.addEventListener('load', function () {
          context.drawImage(image, 0, 0, 1000, 1000);
        });
        this.bindEvents();
      } else {
        this.bindEvents();
      }
    },

    bindEvents: function () {
      onPaintHandler = this.onPaint.bind(this);

      // Save the doodle if anything's typed into the title field.
      titleElement.addEventListener('keyup', this.titleKeyupHandler.bind(this), false);
      titleElement.addEventListener('focus', this.titleFocusHandler.bind(this), false);
      titleElement.addEventListener('blur', this.titleBlurHandler.bind(this), false);

      // Capture mouse movements.
      tempCanvasElement.addEventListener('mousemove', this.mousemoveHandler.bind(this), false);
      tempCanvasElement.addEventListener('touchmove', this.mousemoveHandler.bind(this), false);

      // Draw it bitches.
      tempCanvasElement.addEventListener('mousedown', this.mousedownHandler.bind(this), false);
      tempCanvasElement.addEventListener('touchstart', this.mousedownHandler.bind(this), false);

      // Stop drawing.
      tempCanvasElement.addEventListener('mouseup', this.mouseupHandler.bind(this), false);
      tempCanvasElement.addEventListener('touchend', this.mouseupHandler.bind(this), false);

      // Add event listeners for each colour selectable.
      for (var i = 0; i < colorElements.length; i++) {
        colorElements[i].addEventListener('click', this.colorElementClickHandler.bind(this), false);
      }
    },

    onPaint: function () {
      points.push({
        x: mouse.x * 2,
        y: mouse.y * 2
      });

      // Setup options for drawing (line width, stroke color etc.).
      if (points.length < 3) {
        var b = points[0];
        tempContext.lineWidth = 4;
        tempContext.lineJoin = 'round';
        tempContext.lineCap = 'round';
        tempContext.strokeStyle = color;
        tempContext.fillStyle = color;
        tempContext.beginPath();
        tempContext.arc(b.x, b.y, tempContext.lineWidth / 2, 0, Math.PI * 2, !0);
        tempContext.fill();
        tempContext.closePath();
        return;
      }

      tempContext.clearRect(0, 0, tempCanvasElement.width, tempCanvasElement.height);
      tempContext.beginPath();
      tempContext.moveTo(points[0].x, points[0].y);

      for (var i = 1; i < points.length - 2; i++) {
        var c = (points[i].x + points[i + 1].x) / 2;
        var d = (points[i].y + points[i + 1].y) / 2;
        tempContext.quadraticCurveTo(points[i].x, points[i].y, c, d);
      }

      tempContext.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
      tempContext.stroke();
    },

    mousemoveHandler: function (e) {
      e.preventDefault();

      var xPos = 500 / canvasElement.offsetWidth;
      var yPos = 500 / canvasElement.offsetHeight;

      mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX * xPos : e.layerX * xPos;
      mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY * yPos : e.layerY * yPos;
    },

    mousedownHandler: function (e) {
      e.preventDefault();

      var xPos = 500 / canvasElement.offsetWidth;
      var yPos = 500 / canvasElement.offsetHeight;

      mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX * xPos : e.layerX * xPos;
      mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY * yPos : e.layerY * yPos;

      mouseStart.x = mouse.x * 2;
      mouseStart.y = mouse.y * 2;

      tempCanvasElement.addEventListener('mousemove', onPaintHandler, false);
      tempCanvasElement.addEventListener('touchmove', onPaintHandler, false);

      this.onPaint();
    },

    mouseupHandler: function () {
      messageElement.innerHTML = 'Saving...';

      // Save as soon as the drawing has stopped.
      this.bufferSave();

      tempCanvasElement.removeEventListener('mousemove', onPaintHandler, false);
      tempCanvasElement.removeEventListener('touchmove', onPaintHandler, false);

      // Write down to the real canvas.
      var image = new Image();
      image.src = tempCanvasElement.toDataURL();
      image.onload = function () {
        context.drawImage(image, 0, 0);
      }

      points = [];
    },

    titleKeyupHandler: function (e) {
      if (e.target.value.length !== titleLength) {
        messageElement.innerHTML = 'Saving...';
        this.bufferSave();
        titleLength = e.target.value.length;
      }
    },

    titleFocusHandler: function (e) {
      if (titleElement.value === titlePlaceholder) {
        titleElement.value = '';
        titleElement.className = '';
      }
    },

    titleBlurHandler: function (e) {
      if (titleElement.value === '') {
        titleElement.value = titlePlaceholder;
        titleElement.className = 'placeholder';
      }
    },

    colorElementClickHandler: function (e) {
      e.preventDefault();
      color = e.target.dataset.color;
    },

    bufferSave: function () {
      clearTimeout(timer);
      timer = setTimeout(this.save.bind(this), 1000);
    },

    save: function () {
      var image = canvasElement.toDataURL();
      var options = {
        method: 'POST',
        data: {
          title: titleElement.value === titlePlaceholder ? '' : titleElement.value,
          image: image
        }
      };

      if (typeof currentDoodle !== 'undefined') {
        options.url = '/' + currentDoodle.slug;
        options.data.checksum = sessionStorage.checksum ? sessionStorage.checksum : null;
        options.data.parent = currentDoodle.slug;
        this.update(options);
      } else {
        options.url = '/new';
        this.create(options);
      }
    },

    update: function (options) {
      Utils.ajax(options, function (response) {
        if (response.success) {
          if (response.data) {
            currentDoodle = response.data;
            sessionStorage.setItem('checksum', response.data.checksum);
            history.pushState(null, null, '/' + response.data.slug);
            Utils.message('You didn\'t have permission to edit this doodle, so we\'ve <strong>copied it to your account</strong> for you.', 'success', 6);
          } else {
            // Data of a new doodle wasn't passed back, so the edit was accepted.
            Utils.message('Doodle updated successfully.', 'success');
            messageElement.innerHTML = '';
          }
        } else {
          Utils.message(response.error, 'error');
        }
      });
    },

    create: function (options) {
      Utils.ajax(options, function (response) {
        if (response.success) {
          currentDoodle = response.data;
          sessionStorage.setItem('checksum', response.data.checksum);
          history.pushState(null, null, '/' + response.data.slug);
          Utils.message('Doodle created successfully.', 'success');
          messageElement.innerHTML = '';
        } else {
          Utils.message(response.error, 'error');
        }
      });
    }

  };

})();

if (document.getElementById('doodle')) {
  window.addEventListener('load', Doodle.init.bind(Doodle));
}
