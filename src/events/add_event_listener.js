var eventListeners = require("events/store");

module.exports = function (element, type, preventDefault, listener) {
  var wrapper;

  if (element.addEventListener === undefined) {
    wrapper = function () {
      listener.apply(null, arguments);
      if (preventDefault) {
        return false;
      }
    };
    element.attachEvent("on" + type, wrapper);
  } else {
    wrapper = function (event) {
      if (preventDefault) {
        event.preventDefault();
      }
      listener.apply(null, arguments);
    };
    element.addEventListener(type, wrapper);
  }

  eventListeners.push({ element: element, type: type, listener: listener, wrapper: wrapper });
};
