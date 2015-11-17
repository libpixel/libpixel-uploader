var path = require("path");

describe("Manual upload", function() {
  it("can be triggered with upload()", function() {
    return browser
      .url("/upload_manual.html")
      .chooseFile("#file", path.resolve(__dirname, "../support/images/hills.jpg"))
      .execute("uploader.upload();")
      .waitForExist("#loaded")
      .getElementSize("img").then(function (size) {
        expect(size.width).toEqual(1110);
        expect(size.height).toEqual(740);
      });
  });
});
