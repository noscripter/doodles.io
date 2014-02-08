function Doodle () {
  // Canvas variables.
  this.canvas = document.getElementById('tools_sketch');
  this.context = this.canvas.getContext('2d');
  this.sketch = document.getElementById('sketch');
  this.style = getComputedStyle(this.sketch);
  
  // Canvas dimensions.
  this.canvas.width = parseInt(this.style.getPropertyValue('width'));
  this.canvas.height = parseInt(this.style.getPropertyValue('height'));
  
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
  
  // Initialise the doodle's events.
  this.initEvents();
}

Doodle.prototype = {
  initEvents: function () {
    // onPaint is stored as a reference as binding creates a new function
    // each time, and we need to have a reference to onPaint to be able to
    // remove it from an event listener later on.
    var onPaint = this.onPaint.bind(this);
    var saveButton = document.getElementById('save');
    
    // Capture mouse movements.
    this.canvas_temp.addEventListener('mousemove', function (e) {
      this.mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
      this.mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
    }.bind(this), false);
    
    // Draw it bitches.
    this.canvas_temp.addEventListener('mousedown', function (e) {
      this.mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
      this.mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
      this.mouse_start.x = this.mouse.x;
      this.mouse_start.y = this.mouse.y;
      this.canvas_temp.addEventListener('mousemove', onPaint, false);
      this.onPaint();
    }.bind(this), false);
    
    // Stop drawing, you. Stop it now!
    this.canvas_temp.addEventListener('mouseup', function () {
      this.canvas_temp.removeEventListener('mousemove', onPaint, false);
      
      // Write down to the real canvas.
      this.context.drawImage(this.canvas_temp, 0, 0);
      
      // Clear the temporary canvas.
      this.context_temp.clearRect(0, 0, this.canvas_temp.width, this.canvas_temp.height);
      
      this.points = [];
    }.bind(this), false);

    // Save the current drawing.
    save.addEventListener('click', function (e) {
      e.preventDefault();
      this.save();
    }.bind(this));
  },
  
  onPaint: function () {
    // Add current point to points array.
    this.points.push({
      x: this.mouse.x,
      y: this.mouse.y
    });
    
    // Sets up options for drawing such as line width, stroke color etc.
    if (this.points.length < 3) {
      var b = this.points[0],
          color = document.getElementById('color');
      this.context_temp.lineWidth = 2;
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

  save: function () {
    var title = document.getElementById('title').value;
    var image = this.canvas.toDataURL();

    $.post('/new', {
      title: title,
      image: image
    }).done(function (data) {
      alert('Success!');
    });
  }
};

var doodle = new Doodle();