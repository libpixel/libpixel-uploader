var path = require("path");

describe("Upload with addEventListeners({ autoStart: true })", function() {
  it("allows submitting before upload finishes", function() {
    return browser
      .url("/upload_with_add_event_listeners_auto_start.html")
      .chooseFile("#file", path.resolve(__dirname, "../support/images/hills.jpg"))
      .click("#submit")
      .waitForExist("#loaded")
      .getElementSize("img").then(function (size) {
        expect(size.width).toEqual(1110);
        expect(size.height).toEqual(740);
      });
  });

  it("allows submitting after upload finishes", function() {
    return browser
      .url("/upload_with_add_event_listeners_auto_start.html")
      .chooseFile("#file", path.resolve(__dirname, "../support/images/hills.jpg"))
      .waitForExist("#done")
      .click("#submit")
      .waitForExist("#loaded")
      .getElementSize("img").then(function (size) {
        expect(size.width).toEqual(1110);
        expect(size.height).toEqual(740);
      });
  });

  it("allows choosing another file after first upload finishes", function() {
    return browser
      .url("/upload_with_add_event_listeners_auto_start.html")
      .chooseFile("#file", path.resolve(__dirname, "../support/images/hills.jpg"))
      .waitForExist("#done")
      .chooseFile("#file", path.resolve(__dirname, "../support/images/bridge.jpg"))
      .click("#submit")
      .waitForExist("#loaded")
      .getElementSize("img").then(function (size) {
        expect(size.width).toEqual(800);
        expect(size.height).toEqual(800);
      });
  });

  it("allows choosing another file while first upload is in progress", function() {
    return browser
      .url("/upload_with_add_event_listeners_auto_start.html")
      .chooseFile("#file", path.resolve(__dirname, "../support/images/hills.jpg"))
      .waitForExist("#started")
      .chooseFile("#file", path.resolve(__dirname, "../support/images/bridge.jpg"))
      .click("#submit")
      .waitForExist("#loaded")
      .getElementSize("img").then(function (size) {
        expect(size.width).toEqual(800);
        expect(size.height).toEqual(800);
      });
  });
});
