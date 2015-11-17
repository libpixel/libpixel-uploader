var each = require("util/each");

module.exports = function (type, attributes) {
  var el = document.createElement(type);
  each(attributes, function (key, value) {
    el.setAttribute(key, value);
  });
  return el;
};
