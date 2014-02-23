function Doodle (doodle) {
  this.titleElement = document.getElementById('title');
  this.titleLength = 0; // Used to prevent shift keys etc. from registering as title changes.
  this.titlePlaceholder = this.titleElement.dataset.value;

  this.canvasElement = document.getElementById('tools_sketch');
  this.sketchElement = document.getElementById('sketch');
  this.tempCanvasElement = document.createElement('canvas');
  this.messageElement = document.getElementById('save_text');
  this.colorElement = document.getElementById('color');

  this.canvasElement.width = 1000; // For retina.
  this.canvasElement.height = 1000; // For retina.

  // Add temporary canvas attributes and add it to the page.
  this.tempCanvasElement.id = 'tmp_canvas';
  this.tempCanvasElement.width = this.canvasElement.width;
  this.tempCanvasElement.height = this.canvasElement.height;
  this.sketchElement.appendChild(this.tempCanvasElement);

  this.context = this.canvasElement.getContext('2d');
  this.tempContext = this.tempCanvasElement.getContext('2d');

  this.mouse = { x: 0, y: 0 };
  this.mouseStart = { x: 0, y: 0 };
  this.points = [];

  this.timer = null; // Used to buffer a save. Prevents a shit loads of requests per second.

  // Determine if we're creating a new doodle or editing an existing one.
  if (typeof doodle !== 'undefined') {
    this.doodle = doodle;
    this.titleElement.value = this.doodle.title || this.titlePlaceholder;
    this.titleElement.className = this.titleElement.value === this.titlePlaceholder ? 'placeholder' : '';
    this.titleLength = this.doodle.title.length;
    // Create a new Image object to allow us to draw it to the canvas (from base 64).
    var image = new Image();
    image.src = this.doodle.image;
    image.addEventListener('load', function () {
      this.context.drawImage(image, 0, 0, 1000, 1000);
    }.bind(this));
    this.initEvents();
  } else {
    this.initEvents();
  }
}

Doodle.prototype = {
  initEvents: function () {
    // onPaint is stored as a reference as binding creates a new function
    // each time, and we need to have a reference to onPaint to be able to
    // remove it from an event listener later on.
    this.onPaintHandler = this.onPaint.bind(this);

    // Save the doodle if anything's typed into the title field.
    this.titleElement.addEventListener('keyup', this.titleKeyupHandler.bind(this), false);
    this.titleElement.addEventListener('focus', this.titleFocusHandler.bind(this), false);
    this.titleElement.addEventListener('blur', this.titleBlurHandler.bind(this), false);
    
    // Capture mouse movements.
    this.tempCanvasElement.addEventListener('mousemove', this.mousemoveHandler.bind(this), false);
    this.tempCanvasElement.addEventListener('touchmove', this.mousemoveHandler.bind(this), false);
    
    // Draw it bitches.
    this.tempCanvasElement.addEventListener('mousedown', this.mousedownHandler.bind(this), false);
    this.tempCanvasElement.addEventListener('touchstart', this.mousedownHandler.bind(this), false);
    
    // Stop drawing, you. Stop it now!
    this.tempCanvasElement.addEventListener('mouseup', this.mouseupHandler.bind(this), false);
    this.tempCanvasElement.addEventListener('touchend', this.mouseupHandler.bind(this), false);
  },
  
  onPaint: function () {
    // Add current point to points array.
    this.points.push({
      x: this.mouse.x * 2,
      y: this.mouse.y * 2
    });
    
    // Sets up options for drawing such as line width, stroke color etc.
    if (this.points.length < 3) {
      var b = this.points[0];
      this.tempContext.lineWidth = 4; // Actual size is 2 but retina means it's doubled.
      this.tempContext.lineJoin = 'round';
      this.tempContext.lineCap = 'round';
      this.tempContext.strokeStyle = this.colorElement.value;
      this.tempContext.fillStyle = this.colorElement.value;
      this.tempContext.beginPath();
      this.tempContext.arc(b.x, b.y, this.tempContext.lineWidth / 2, 0, Math.PI * 2, !0);
      this.tempContext.fill();
      this.tempContext.closePath();
      return;
    }
    
    // Clear the temporary canvas before drawing.
    this.tempContext.clearRect(0, 0, this.tempCanvasElement.width, this.tempCanvasElement.height);
    
    // Draw it up.
    this.tempContext.beginPath();
    this.tempContext.moveTo(this.points[0].x, this.points[0].y);
    
    // Smooth it out.
    for (var i = 1; i < this.points.length - 2; i++) {
      var c = (this.points[i].x + this.points[i + 1].x) / 2;
      var d = (this.points[i].y + this.points[i + 1].y) / 2;
      this.tempContext.quadraticCurveTo(this.points[i].x, this.points[i].y, c, d);
    }

    this.tempContext.quadraticCurveTo(this.points[i].x, this.points[i].y, this.points[i + 1].x, this.points[i + 1].y);
    this.tempContext.stroke();
  },
  
  mousemoveHandler: function (e) {
    e.preventDefault();
    var xPos = 500 / (this.canvasElement.offsetWidth);
    var yPos = 500 / (this.canvasElement.offsetHeight);
    this.mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX * xPos : e.layerX * xPos;
    this.mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY * yPos : e.layerY * yPos;
  },
  
  mousedownHandler: function (e) {
    e.preventDefault();
    var xPos = 500 / (this.canvasElement.offsetWidth);
    var yPos = 500 / (this.canvasElement.offsetHeight);
    this.mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX * xPos : e.layerX * xPos;
    this.mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY * yPos : e.layerY * yPos;
    this.mouseStart.x = this.mouse.x * 2;
    this.mouseStart.y = this.mouse.y * 2;
    this.tempCanvasElement.addEventListener('mousemove', this.onPaintHandler, false);
    this.tempCanvasElement.addEventListener('touchmove', this.onPaintHandler, false);
    this.onPaint();
  },
  
  mouseupHandler: function () {
    this.messageElement.innerHTML = 'Saving...';

    // Save as soon as the drawing has stopped.
    this.bufferSave();

    this.tempCanvasElement.removeEventListener('mousemove', this.onPaintHandler, false);
    this.tempCanvasElement.removeEventListener('touchmove', this.onPaintHandler, false);
    
    // Write down to the real canvas.
    var image = new Image();
    image.src = this.tempCanvasElement.toDataURL();
    image.onload = function () {
      this.context.drawImage(image, 0, 0);
    }.bind(this);
    
    // Clear the temporary canvas.
    this.tempContext.clearRect(0, 0, this.tempCanvasElement.width, this.tempCanvasElement.height);
    
    this.points = [];
  },

  titleKeyupHandler: function (e) {
    if (e.target.value.length !== this.titleLength) {
      this.messageElement.innerHTML = 'Saving...';
      this.bufferSave();
      this.titleLength = e.target.value.length;
    }
  },
  
  titleFocusHandler: function (e) {
    if (this.titleElement.value === this.titlePlaceholder) {
      this.titleElement.value = '';
      this.titleElement.className = '';
    }
  },
  
  titleBlurHandler: function (e) {
    if (this.titleElement.value === '') {
      this.titleElement.value = this.titlePlaceholder;
      this.titleElement.className = 'placeholder';
    }
  },

  // Prevents saving every time a change is made. Only make them (at most) every 1 second.
  bufferSave: function () {
    clearTimeout(this.timer);
    this.timer = setTimeout(this.save.bind(this), 1000);
  },

  save: function () {
    var image = this.canvasElement.toDataURL();
    if (this.doodle) {
      doodles.ajax({
        method: 'POST',
        url: '/' + this.doodle.slug,
        data: {
          title: this.titleElement.value === this.titlePlaceholder ? '' : this.titleElement.value,
          image: image,
          checksum: sessionStorage.checksum ? sessionStorage.checksum : null
        }
      }, function (response) {
        if (response.success) {
          if (response.data) {
            this.doodle = response.data;
            sessionStorage.setItem('checksum', response.data.checksum);
            history.pushState(null, null, '/' + response.data.slug);
            doodles.utils.displayMessage('You didn\'t have permission to edit this doodle, so we\'ve <strong>copied it to your account</strong> for you.', 'info', 6);
          } else {
            // Data of a new doodle wasn't passed back, so the edit was accepted
            this.messageElement.innerHTML = 'Saved!';
            this.timer = setTimeout(function () {
              this.messageElement.innerHTML = '';
            }.bind(this), 3000);
          }
        } else {
          doodles.utils.displayMessage(response.error, 'error');
        }
      }.bind(this));
    } else {
      doodles.ajax({
        method: 'POST',
        url: '/new',
        data: {
          title: this.titleElement.value === this.titlePlaceholder ? '' : this.titleElement.value,
          image: image
        }
      }, function (response) {
        if (response.success) {
          this.doodle = response.data;
          sessionStorage.setItem('checksum', response.data.checksum);
          history.pushState(null, null, '/' + response.data.slug);
          this.messageElement.innerHTML = 'Saved!';
          this.timer = setTimeout(function () {
            this.messageElement.innerHTML = '';
          }.bind(this), 3000);
        } else {
          doodles.utils.displayMessage(response.error, 'error');
        }
      }.bind(this));
    }
  }
};