var LibPixelUploader = require("../../src/index.js");

describe("LibPixelUploader", function() {
  it("exposes messages", function() {
    var m = LibPixelUploader.messages;
    expect(m.fileNotSelected).toBeDefined();
    expect(m.invalidExtension).toBeDefined();
  });
});
