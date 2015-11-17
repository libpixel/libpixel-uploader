var urlAppend = require("util/url_append");

describe("util/url_append", function () {
  it("appends query string with a ? when there is no query string present", function () {
    var url = urlAppend("http://libpx.com/img/1.jpg", "width=200");
    expect(url).toEqual("http://libpx.com/img/1.jpg?width=200");
  });

  it("appends query string with a & when there is a query string present", function () {
    var url = urlAppend("http://libpx.com/img/2.jpg?width=200", "blur=15");
    expect(url).toEqual("http://libpx.com/img/2.jpg?width=200&blur=15");
  });
});
