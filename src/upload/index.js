var getJSON = require("requests/get_json");
var uploadWithXHR = require("upload/xhr");
var uploadWithIframe = require("upload/iframe");
var urlAppend = require("util/url_append");
var identifier = require("util/identifier");
var nextTick = require("util/next_tick");

function origin() {
  if (window.location.origin) {
    return window.location.origin;
  } else {
    return window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
  }
}

module.exports = function (options, start, progress, success, error) {
  var id = identifier();
  var messages = LibPixelUploader.messages;

  var cancelled = false,
      cancel = function() { cancelled = true; };

  var ret = {
    id: id,
    cancel: function () { cancel(); }
  };

  var match = options.element.value.match(/\.([0-9a-z]+)$/i);
  var extension = match ? match[1] : "";

  var acceptedExtensions = new RegExp("\\.(" + options.acceptedExtensions.join("|") + ")$", "i");

  if (options.required === false && options.element.value === "") {
    nextTick(function () {
      success({ id: id });
    });
    return ret;
  }

  if (options.element.value === "") {
    nextTick(function () {
      error({ id: id, message: messages.fileNotSelected });
    });
    return ret;
  }

  if (!acceptedExtensions.test(options.element.value)) {
    var message = messages.invalidExtension + " " + options.acceptedExtensions.join(", ");
    nextTick(function () {
      error({ id: id, message: message });
    });
    return ret;
  }

  var mode = options.mode || "auto";
  var useXHRUpload = (mode === "xhr" || (mode === "auto" && Object.prototype.hasOwnProperty.call(window, "FormData")));
  start({ id: id, progressSupported: useXHRUpload });

  var url = urlAppend("https://" + options.host + "/_uploader/" + options.source,
              "mode=" + (useXHRUpload ? "xhr" : "iframe") +
              "&origin=" + encodeURIComponent(origin()) +
              "&id=" + id +
              "&extension=" + extension
            );

  getJSON(url, function (err, data) {
    if (err) {
      error({ id: id });
      return;
    }
    var uploadFn = useXHRUpload ? uploadWithXHR : uploadWithIframe;

    if (!cancelled) {
      cancel = uploadFn(id, options.element, data.s3.url, data.parameters, progress, success, error);
    }
  });

  return ret;
};
