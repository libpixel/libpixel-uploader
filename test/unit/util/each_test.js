var each = require("util/each");

describe("util/each", function () {
  it("enumerates each key/value pair for a given object", function () {
    var input = { a: "a", b: "b" };
    var output = {};

    each(input, function (key, value) {
      output[key] = value;
    });

    expect(output).toEqual(input);
  });
});
