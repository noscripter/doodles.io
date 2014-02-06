init_sketch();
function init_sketch(){
  var canvas = document.querySelector('#tools_sketch');
  var ctx = canvas.getContext('2d');
  var sketch = document.querySelector('#sketch');
  var sketch_style = getComputedStyle(sketch);
  canvas.width = parseInt(sketch_style.getPropertyValue('width'));
  canvas.height = parseInt(sketch_style.getPropertyValue('height'));
  var tool = 'brush';
  jQuery('.container button').on('click', function () {
    tmp_canvas.style.display = 'block';
    tool = jQuery(this).attr('id');
    console.log(tool);

  });
  var tmp_canvas = document.createElement('canvas');
  var tmp_ctx = tmp_canvas.getContext('2d');
  tmp_canvas.id = 'tmp_canvas';
  tmp_canvas.width = canvas.width;
  tmp_canvas.height = canvas.height;

  sketch.appendChild(tmp_canvas);


  var mouse = {
    x: 0,
    y: 0
  };
  var start_mouse = {
    x: 0,
    y: 0
  };
  var last_mouse = {
    x: 0,
    y: 0
  };

  document.querySelector('#eraser').onclick = function () {
    if (this.checked)
      tool = 'eraser';

    // Hide Tmp Canvas
    tmp_canvas.style.display = 'none';
  };
  /* Mouse Capturing Work */
  tmp_canvas.addEventListener('mousemove', function (e) {

    mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
    mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
  }, false);


  /* Drawing on Paint App */
  tmp_canvas.addEventListener('mousedown', function (e) {

    mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
    mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

    start_mouse.x = mouse.x;
    start_mouse.y = mouse.y;

      tmp_canvas.addEventListener('mousemove', onBrushPaint, false);
      onBrushPaint();


  }, false);

  tmp_canvas.addEventListener('mouseup', function () {
    tmp_canvas.removeEventListener('mousemove', onBrushPaint, false);
    tmp_canvas.removeEventListener('mousemove', onPaint, false);
  
    // Writing down to real canvas now
    ctx.drawImage(tmp_canvas, 0, 0);
    // Clearing tmp canvas
    tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

    ppts = [];


  }, false);
  canvas.addEventListener('mousemove', function (e) {
    mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
    mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
  }, false);

  canvas.addEventListener('mousedown', function (e) {
    canvas.addEventListener('mousemove', onErase, false);

    mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
    mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

    ppts.push({
      x: mouse.x,
      y: mouse.y
    });

    onErase();
  }, false);

  canvas.addEventListener('mouseup', function () {
    canvas.removeEventListener('mousemove', onErase, false);

    // Emptying up Pencil Points
    ppts = [];
  }, false);



    var onPaint = function() {
    tmp_ctx.lineWidth = $('#selWidth').val();
    tmp_ctx.lineJoin = 'round';
    tmp_ctx.lineCap = 'round';
    tmp_ctx.strokeStyle = $('#selColor').val();
    tmp_ctx.fillStyle = $('#selColor').val();

      // Tmp canvas is always cleared up before drawing.
      tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
      
      var x = Math.min(mouse.x, start_mouse.x);
      var y = Math.min(mouse.y, start_mouse.y);
      var width = Math.abs(mouse.x - start_mouse.x);
      var height = Math.abs(mouse.y - start_mouse.y);
      
      textarea.style.left = x + 'px';
      textarea.style.top = y + 'px';
      textarea.style.width = width + 'px';
      textarea.style.height = height + 'px';
      
      textarea.style.display = 'block';
    };
  var onErase = function () {

    // Saving all the points in an array
    ppts.push({
      x: mouse.x,
      y: mouse.y
    });

    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    ctx.lineWidth = 6;

    if (ppts.length < 3) {
      var b = ppts[0];
      ctx.beginPath();
      //ctx.moveTo(b.x, b.y);
      //ctx.lineTo(b.x+50, b.y+50);
      ctx.arc(b.x, b.y, ctx.lineWidth / 2, 0, Math.PI * 2, !0);
      ctx.fill();
      ctx.closePath();

      return;
    }

    // Tmp canvas is always cleared up before drawing.
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(ppts[0].x, ppts[0].y);

    for (var i = 1; i < ppts.length - 2; i++) {
      var c = (ppts[i].x + ppts[i + 1].x) / 2;
      var d = (ppts[i].y + ppts[i + 1].y) / 2;

      ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
    }

    // For the last 2 points
    ctx.quadraticCurveTo(
      ppts[i].x,
      ppts[i].y,
      ppts[i + 1].x,
      ppts[i + 1].y);
    ctx.stroke();

  };
  


  // Pencil Points
  var ppts = [];

  var onBrushPaint = function () {

    ppts.push({
      x: mouse.x,
      y: mouse.y
    });

    if (ppts.length < 3) {
      var b = ppts[0];
      tmp_ctx.lineWidth = 2;
      tmp_ctx.lineJoin = 'round';
      tmp_ctx.lineCap = 'round';
      tmp_ctx.strokeStyle = $('#selColor').val();
      tmp_ctx.fillStyle = $('#selColor').val();
      tmp_ctx.beginPath();
      //ctx.moveTo(b.x, b.y);
      //ctx.lineTo(b.x+50, b.y+50);
      tmp_ctx.arc(b.x, b.y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
      tmp_ctx.fill();
      tmp_ctx.closePath();

      return;
    }

    // Tmp canvas is always cleared up before drawing.
    tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

    tmp_ctx.beginPath();
    tmp_ctx.moveTo(ppts[0].x, ppts[0].y);

    for (var i = 1; i < ppts.length - 2; i++) {
      var c = (ppts[i].x + ppts[i + 1].x) / 2;
      var d = (ppts[i].y + ppts[i + 1].y) / 2;

      tmp_ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
    }

    // For the last 2 points
    tmp_ctx.quadraticCurveTo(
      ppts[i].x,
      ppts[i].y,
      ppts[i + 1].x,
      ppts[i + 1].y);
    tmp_ctx.stroke();

  };    
}