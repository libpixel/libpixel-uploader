var nextTick = require("util/next_tick");

describe("util/next_tick", function () {
  it("runs given function asynchronously", function (done) {
    nextTick(done);
  });
});
