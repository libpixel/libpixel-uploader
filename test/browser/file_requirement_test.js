describe("Upload file requirements", function() {
  it("requires file selection by default", function() {
    return browser
      .url("/upload_with_add_event_listeners.html")
      .click("#submit")
      .waitForExist("#error")
      .getText("#error").then(function (text) {
        expect(text).toEqual("You must select a file to upload");
      });
  });

  it("doesn't require file with { required: false } option", function() {
    return browser
      .url("/upload_without_file_required.html")
      .click("#submit")
      .url(function (err, url) {
        expect(url.value).toMatch("done.html");
      });
  });
});
