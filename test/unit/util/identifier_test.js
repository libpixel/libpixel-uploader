var identifier = require("util/identifier");

describe("util/identifier", function () {
  it("returns a string", function () {
    expect(identifier()).toEqual(jasmine.any(String));
  });

  it("returns a different string every time it is called", function () {
    expect(identifier()).not.toEqual(identifier());
  });
});
