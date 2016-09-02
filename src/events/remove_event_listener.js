var eventListeners = require("events/store");

module.exports = function (element, type, listener) {
  var counter = 0;

  while (counter < eventListeners.length) {
    var eventListener = eventListeners[counter];

    if (eventListener.element === element && eventListener.type === type && eventListener.listener.toString() === listener.toString()) {
      if (element.addEventListener === undefined) {
        element.detachEvent("on" + type, eventListener.wrapper);
      } else {
        element.removeEventListener(type, eventListener.wrapper);
      }

      eventListeners.splice(counter, 1);
      break;
    }

    ++counter;
  }
};
