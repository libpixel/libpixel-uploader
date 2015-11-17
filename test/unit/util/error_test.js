var error = require("util/error");

describe("util/error", function () {
  it("throws an error with 'LibPixelUploader: ' as a prefix", function () {
    expect(function () {
      error("oh noes!");
    }).toThrowError("LibPixelUploader: oh noes!");
  });
});
