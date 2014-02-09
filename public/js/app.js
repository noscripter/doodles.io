function Doodle () {
  // Canvas variables.
  this.canvas = document.getElementById('tools_sketch');
  this.context = this.canvas.getContext('2d');
  this.sketch = document.getElementById('sketch');
  this.style = getComputedStyle(this.sketch);
  
  // Canvas dimensions.
  this.canvas.width = parseInt(this.style.getPropertyValue('width')) * 2; // For retina.
  this.canvas.height = parseInt(this.style.getPropertyValue('height')) * 2; // For retina.
  
  // Temporary canvas variables.
  this.canvas_temp = document.createElement('canvas');
  this.context_temp = this.canvas_temp.getContext('2d');
  this.canvas_temp.id = 'tmp_canvas';
  
  // Temporary canvas dimensions.
  this.canvas_temp.width = this.canvas.width;
  this.canvas_temp.height = this.canvas.height;
  this.sketch.appendChild(this.canvas_temp);
  
  // Mouse variables.
  this.mouse = { x: 0, y: 0 };
  this.mouse_start = { x: 0, y: 0 };
  
  // Store the mouse points when drawing.
  this.points = [];

  this.timer = null;

  // Determines if we're editing an existing doodle or creating a new one.
  if (existingDoodle) {
    document.getElementById('title').value = existingDoodle.title;
    var image = new Image();
    image.src = existingDoodle.image;
    image.onload = function () {
      this.context.drawImage(image, 0, 0, 1000, 1000);
    }.bind(this);
    this.titleLength = existingDoodle.title.length;
    this.initEvents();
  } else {
    this.titleLength = 0;
    this.initEvents();
  }
}

Doodle.prototype = {
  initEvents: function () {
    // onPaint is stored as a reference as binding creates a new function
    // each time, and we need to have a reference to onPaint to be able to
    // remove it from an event listener later on.
    var onPaint = this.onPaint.bind(this);
    var title = document.getElementById('title');

    title.addEventListener('keyup', function (e) {
      if (e.target.value.length !== this.titleLength) {
        document.getElementById('save_text').innerHTML = 'Saving...';
        this.bufferSave();
        this.titleLength = e.target.value.length;
      }
    }.bind(this), false);
    
    // Capture mouse movements.
    this.canvas_temp.addEventListener('mousemove', function (e) {
      this.mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
      this.mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
    }.bind(this), false);
    
    // Draw it bitches.
    this.canvas_temp.addEventListener('mousedown', function (e) {
      this.mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
      this.mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
      this.mouse_start.x = this.mouse.x * 2;
      this.mouse_start.y = this.mouse.y * 2;
      this.canvas_temp.addEventListener('mousemove', onPaint, false);
      this.onPaint();
    }.bind(this), false);
    
    // Stop drawing, you. Stop it now!
    this.canvas_temp.addEventListener('mouseup', function () {
      document.getElementById('save_text').innerHTML = 'Saving...';
      // Save as soon as the drawing has stopped.
      this.bufferSave();

      this.canvas_temp.removeEventListener('mousemove', onPaint, false);
      
      // Write down to the real canvas.
      var image = new Image();
      image.src = this.canvas_temp.toDataURL();
      image.onload = function () {
        this.context.drawImage(image, 0, 0);
      }.bind(this);
      
      // Clear the temporary canvas.
      this.context_temp.clearRect(0, 0, this.canvas_temp.width, this.canvas_temp.height);
      
      this.points = [];
    }.bind(this), false);
  },
  
  onPaint: function () {
    // Add current point to points array.
    this.points.push({
      x: this.mouse.x * 2,
      y: this.mouse.y * 2
    });
    
    // Sets up options for drawing such as line width, stroke color etc.
    if (this.points.length < 3) {
      var b = this.points[0],
          color = document.getElementById('color');
      this.context_temp.lineWidth = 4; // Actual size is 2 but retina means it's doubled.
      this.context_temp.lineJoin = 'round';
      this.context_temp.lineCap = 'round';
      this.context_temp.strokeStyle = color.value;
      this.context_temp.fillStyle = color.value;
      this.context_temp.beginPath();
      this.context_temp.arc(b.x, b.y, this.context_temp.lineWidth / 2, 0, Math.PI * 2, !0);
      this.context_temp.fill();
      this.context_temp.closePath();
      return;
    }
    
    // Clear the temporary canvas before drawing.
    this.context_temp.clearRect(0, 0, this.canvas_temp.width, this.canvas_temp.height);
    
    // Draw it up.
    this.context_temp.beginPath();
    this.context_temp.moveTo(this.points[0].x, this.points[0].y);
    
    // Smooth it out.
    for (var i = 1; i < this.points.length - 2; i++) {
      var c = (this.points[i].x + this.points[i + 1].x) / 2,
          d = (this.points[i].y + this.points[i + 1].y) / 2;
      this.context_temp.quadraticCurveTo(this.points[i].x, this.points[i].y, c, d);
    }
    
    // Better not leave those last two points out.
    this.context_temp.quadraticCurveTo(this.points[i].x, this.points[i].y, this.points[i + 1].x, this.points[i + 1].y);
    this.context_temp.stroke();
  },

  // Prevents saving every time a change is made. Only make them (at most) every 1 second.
  bufferSave: function () {
    clearTimeout(this.timer);
    this.timer = setTimeout(this.save.bind(this), 1000);
  },

  save: function () {
    var title = document.getElementById('title').value;
    var image = this.canvas.toDataURL();

    // Only save a new one if we're not editing an existing doodle.
    if (!existingDoodle) {
      $.post('/new', {
        title: title,
        image: image
      }).done(function (response) {
        existingDoodle = {
          title: response.data.title,
          slug: response.data.slug,
          image: response.data.image,
          _id: response.data._id
        };
        history.pushState(null, null, '/' + response.data.slug);
        document.getElementById('save_text').innerHTML = 'Saved!';
        this.timer = setTimeout(function () {
          document.getElementById('save_text').innerHTML = '';
        }.bind(this), 2000);
      }.bind(this));
    } else {
      $.post('/' + existingDoodle.slug, {
        title: title,
        image: image
      }).done(function (response) {
        document.getElementById('save_text').innerHTML = 'Saved!';
        this.timer = setTimeout(function () {
          document.getElementById('save_text').innerHTML = '';
        }.bind(this), 2000);
      }.bind(this));
    }
  }
};

var doodle = new Doodle();