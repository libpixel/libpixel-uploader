var addEventListener = require("../events/add_event_listener");
var removeEventListener = require("../events/remove_event_listener");
var make = require("../dom/make");
var urlAppend = require("../util/url_append");
var identifier = require("../util/identifier");

function getJSONWithXHR(url, callback) {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(null, JSON.parse(xhr.responseText));
      } else {
        callback(true, null);
      }
    }
  };

  xhr.open("GET", url, true);
  xhr.send();
}

function getJSONWithScript(url, callback) {
  var callbackName = "LibPixelUploader" + identifier();

  var script = make("script", {
    src: urlAppend(url, "callback=" + callbackName)
  });

  addEventListener(script, "error", false, function onerror() {
    removeEventListener(script, "error", onerror);
    document.body.removeChild(script);
    callback(true, null);
  });

  window[callbackName] = function(data) {
    callback(null, data);
    document.body.removeChild(script);
  };

  document.body.appendChild(script);
}

module.exports = function (url, callback) {
  if ("withCredentials" in new XMLHttpRequest()) {
    getJSONWithXHR(url, callback);
  } else {
    getJSONWithScript(url, callback);
  }
};
