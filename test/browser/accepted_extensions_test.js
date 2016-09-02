var path = require("path");

describe("Upload acceptedExtensions", function() {
  it("rejects files not in the extension list", function() {
    return browser
      .url("/upload_with_accepted_extensions.html")
      .chooseFile("#file", path.resolve(__dirname, "../support/images/hills.jpg"))
      .click("#submit")
      .waitForExist("#error")
      .getText("#error").then(function (text) {
        expect(text).toEqual("File must have one of the following extensions: png, ico");
      });
  });

  it("accepts files in the extension list", function() {
    return browser
      .url("/upload_with_accepted_extensions.html")
      .chooseFile("#file", path.resolve(__dirname, "../support/images/favicon.ico"))
      .click("#submit")
      .waitForExist("#loaded")
      .getElementSize("img").then(function (size) {
        expect(size.width).toEqual(64);
        expect(size.height).toEqual(64);
      });
  });
});
