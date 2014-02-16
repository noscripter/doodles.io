/**
 * A miniture library to handle cross-platform ajax requests.
 */
doodles.ajax = (function () {
  
  // The various xhr factories used by different browsers.
  var factories = [
    function () { return new XMLHttpRequest() },
    function () { return new ActiveXObject("Msxml2.XMLHTTP") },
    function () { return new ActiveXObject("Msxml3.XMLHTTP") },
    function () { return new ActiveXObject("Microsoft.XMLHTTP") }
  ];
  
  /**
   * The AJAX function.
   */
  var ajax = function (options, callback) {
    
    var method = options.method || 'GET';
    var xhr = createXHRObj();
    if (!xhr) {
      return callback({
        success: false,
        error: 'Unable to create XMLHttpRequest Object'
      });
    }
    
    // Error handling for no URL.
    if (!options.url) {
      return callback({
        success: false,
        error: 'No URL specified'
      });
    }
    
    xhr.open(method, options.url, true);
    
    // Set request header if method is POST.
    if (method === 'POST') {
      xhr.setRequestHeader('Content-type', 'application/json');
    }
    
    xhr.send(options.data ? JSON.stringify(options.data) : null);
    
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          return callback(xhr.responseText);
        } else {
          return callback({
            success: false,
            error: 'HTTP error ' + xhr.status
          })
        }
      }
    }
  }
  
  /**
   * Create the xhr to use, depending on the browser.
   */
  var createXHRObj = function () {
    var xhr = false;
    for (var i = 0, l = factories.length; i < l; i++) {
        try { xhr = factories[i](); }
        catch (e) { continue; }
        break;
    }
    return xhr;
  };
  
  // Expose only the ajax function.
  return ajax;
  
}());
