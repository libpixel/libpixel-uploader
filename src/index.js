var upload = require("upload");
var addEventListener = require("events/add_event_listener");
var removeEventListener = require("events/remove_event_listener");
var findAncestor = require("dom/find_ancestor");
var make = require("dom/make");
var noop = require("util/noop");
var err = require("util/error");
var messages = require("messages");
var constants = require("constants");

var LibPixelUploader = function (options) {
  if (options.element === undefined) {
    err("'element' option is required");
  }
  if (options.host === undefined) {
    err("'host' option is required");
  }
  if (options.source === undefined) {
    err("'source' option is required");
  }

  var element = options.element,
      startCallback = noop,
      progressCallback = noop,
      successCallback = noop,
      errorCallback = noop,
      afterSuccess = noop,
      afterError = noop,
      uploads = {},
      state,
      currentUploadID;

  if (typeof element === "string") {
    element = document.querySelector(element);
  } else if (element.jquery) {
    element = element[0];
  }

  if (!(element && element.nodeName.toLowerCase() === "input" && element.type === "file")) {
    err("'element' must be an input element of type='file'");
  }

  var elementName = element.name;

  function onStart() {
    state = "uploading";
    startCallback.apply(null, arguments);
  }

  function onProgress(event) {
    if (event.id !== currentUploadID) { return; }
    progressCallback.apply(null, arguments);
  }

  function onSuccess(event) {
    uploads[event.id] = { key: event.key };
    if (event.id !== currentUploadID) { return; }
    state = "done";
    successCallback.apply(null, arguments);
    afterSuccess.apply(null, arguments);
  }

  function onError(event) {
    if (event.id !== currentUploadID) { return; }
    state = "error";
    errorCallback.apply(null, arguments);
    afterError.apply(null, arguments);
  }

  function uploadFn() {
    var uploadInfo = upload({
      element: element,
      host: options.host,
      source: options.source,
      mode: options.mode,
      required: options.required,
      acceptedExtensions: options.acceptedExtensions || constants.ACCEPTED_EXTENSIONS
    }, onStart, onProgress, onSuccess, onError);

    if (currentUploadID) {
      var cancel = uploads[currentUploadID].cancel;
      if (cancel) { cancel(); }
    }

    currentUploadID = uploadInfo.id;
    uploads[currentUploadID] = { cancel: uploadInfo.cancel };
  }

  var uploader = {
    start: function (callback) {
      startCallback = callback;
      return uploader;
    },
    progress: function (callback) {
      progressCallback = callback;
      return uploader;
    },
    success: function (callback) {
      successCallback = callback;
      return uploader;
    },
    error: function (callback) {
      errorCallback = callback;
      return uploader;
    },
    upload: function () {
      if (state === undefined || state === "error") {
        uploadFn();
      }
      return uploader;
    },
    addEventListeners: function (aelOptions) {
      if (!elementName) {
        err("'element' must have a name attribute when using addEventListeners()");
      }

      aelOptions = aelOptions || {};

      var form = findAncestor(element, "form");

      if (form === null) {
        err("'element' must be within a form element when using addEventListeners()");
      }

      var button = form.querySelector("[type=submit]");

      addEventListener(form, "submit", true, function finishUpload() {
        removeEventListener(form, "submit", finishUpload);

        button.disabled = true;

        var errored = false;

        afterSuccess = function (event) {
          if (errored) { return; }

          if (event.key) {
            form.appendChild(make("input", {
              type: "hidden",
              name: elementName,
              value: event.key
            }));
          }

          element.removeAttribute("name");
          button.disabled = false;
          make("form").submit.call(form);
        };

        afterError = function () {
          errored = true;
          button.disabled = false;
          addEventListener(form, "submit", true, finishUpload);
        };

        if (state === undefined || state === "error") {
          uploadFn();
        } else if (state === "done") {
          afterSuccess({ key: uploads[currentUploadID].key });
        }
      });

      if (aelOptions.autoStart) {
        addEventListener(element, "change", false, function () {
          uploadFn();
        });
      }

      return uploader;
    }
  };

  return uploader;
};

LibPixelUploader.messages = messages;

module.exports = LibPixelUploader;
