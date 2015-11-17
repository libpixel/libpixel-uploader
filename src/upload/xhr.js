var each = require("util/each");

module.exports = function (id, element, url, data, progress, success, error) {
  var xhr = new XMLHttpRequest();
  var fd = new FormData();
  var file = element.files[0];

  each(data, function (key, value) {
    fd.append(key, value);
  });

  fd.append("file", file);

  xhr.upload.addEventListener("progress", function(e) {
    var event = {
      id: id,
      loaded: e.loaded,
      total: e.total
    };

    if (e.lengthComputable) {
      event.percentage = e.loaded / e.total;
    }

    progress(event);
  }, false);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 0) { return; } // Aborted request.
      if (xhr.status >= 200 && xhr.status < 300) {
        success({ id: id, key: data.key });
      } else {
        error({ id: id });
      }
    }
  };

  xhr.open("POST", url, true);
  xhr.send(fd);

  return function () {
    xhr.abort();
  };
};
