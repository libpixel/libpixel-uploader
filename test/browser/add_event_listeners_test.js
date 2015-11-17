var path = require("path");

describe("Upload with addEventListeners()", function() {
  it("uploads file automatically on submit", function() {
    return browser
      .url("/upload_with_add_event_listeners.html")
      .chooseFile("#file", path.resolve(__dirname, "../support/images/hills.jpg"))
      .click("#submit")
      .waitForExist("#loaded")
      .getElementSize("img").then(function (size) {
        expect(size.width).toEqual(1110);
        expect(size.height).toEqual(740);
      });
  });

  it("allows another file to be chosen before submitting", function() {
    return browser
      .url("/upload_with_add_event_listeners.html")
      .chooseFile("#file", path.resolve(__dirname, "../support/images/hills.jpg"))
      .chooseFile("#file", path.resolve(__dirname, "../support/images/bridge.jpg"))
      .click("#submit")
      .waitForExist("#loaded")
      .getElementSize("img").then(function (size) {
        expect(size.width).toEqual(800);
        expect(size.height).toEqual(800);
      });
  });
});
