var path = require("path");

describe("Upload via iframe", function() {
  it("can be configured with { mode: 'iframe' }", function() {
    return browser
      .url("/upload_via_iframe.html")
      .chooseFile("#file", path.resolve(__dirname, "../support/images/hills.jpg"))
      .click("#submit")
      .waitForExist("#loaded")
      .getElementSize("img").then(function (size) {
        expect(size.width).toEqual(1110);
        expect(size.height).toEqual(740);
      });
  });
});
