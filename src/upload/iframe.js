var each = require("util/each");
var addEventListener = require("events/add_event_listener");
var removeEventListener = require("events/remove_event_listener");
var make = require("dom/make");
var constants = require("constants");
var identifier = require("util/identifier");
var noop = require("util/noop");

module.exports = function (id, element, url, data, progress, success, error) {
  var name = "uploader-iframe-" + identifier();

  var iframe = make("iframe", {
    id: name,
    name: name,
    /* jshint -W107 */
    src: "javascript:false;"
  });
  iframe.style.display = "none";

  addEventListener(iframe, "load", false, function onload() {
    removeEventListener(iframe, "load", onload);

    var form = make("form", {
      enctype: "multipart/form-data",
      method: "post",
      action: url,
      target: name
    });
    form.style.display = "none";
    document.body.appendChild(form);

    each(data, function (name, value) {
      form.appendChild(make("input", {
        type: "hidden",
        name: name,
        value: value
      }));
    });

    var ff = element;
    var ffClone = ff.cloneNode(true);
    ffClone.disabled = true;
    ff.name = "file";
    ff.parentNode.replaceChild(ffClone, ff);
    form.appendChild(ff);

    var timeouts = {};

    addEventListener(iframe, "load", false, function onload2() {
      removeEventListener(iframe, "load", onload2);
      timeouts.success = setTimeout(function() {
        document.body.removeChild(iframe);
        error({ id: id });
      }, 1000);
    });

    form.submit();
    ffClone.parentNode.replaceChild(ff, ffClone);

    addEventListener(window, "message", false, function onmessage(event) {
      if (/^https?:\/\/[a-z]+\.libpx\.com$/i.test(event.origin) && event.data === data.key) {
        if (timeouts.success === undefined) {
          var eventCopy = {
            origin: event.origin,
            data: event.data
          };
          setTimeout(function () {
            onmessage(eventCopy);
          }, 100);
          return;
        }
        clearTimeout(timeouts.success);
        ffClone.disabled = false;
        removeEventListener(window, "message", onmessage);
        document.body.removeChild(iframe);
        success({ id: id, key: data.key });
      }
    }, false);
  });

  document.body.appendChild(iframe);

  return noop;
};
