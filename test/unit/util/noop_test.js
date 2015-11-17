var noop = require("util/noop");

describe("util/noop", function () {
  it("is an empty function", function () {
    expect(noop.toString()).toEqual(function () {}.toString());
  });
});
