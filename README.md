# LibPixel Uploader

A client-side JavaScript library that makes uploading images to S3 easier than
any alternative.

[LibPixel](http://libpixel.com) will handle all the complexity of S3 request
signing and server-side redirects. You won't even need to add a blank page to
your website just to support older browsers. All that has been done for you. In
fact you won't need to touch your server-side code at all.

It supports pretty much every browser starting with IE 8, it weighs only 2.7KB
(minified + gzipped), and has no dependencies.

## Getting started

If you use NPM in your project you can install and require the library:

```
$ npm install libpixel-uploader
```

```js
var LibPixelUploader = require("libpixel-uploader");
```

Alternatively, you can download a release and include it in your page:

```html
<script src="/path/to/libpixel-uploader.min.js"></script>
```

In your LibPixel account, all you need is a source configured with
your S3 bucket, and uploads enabled.

Your S3 bucket needs to be configured for CORS. You can find the CORS
configuration [here](#cors), and instructions on how to configure it from the
[S3 User Guide](http://docs.aws.amazon.com/AmazonS3/latest/UG/EditingBucketPermissions.html).

Assuming your source's path is `/eu-west-1/uploads` and your LibPixel domain is
`test.libpx.com`, you'd configure the uploader as:

```js
var uploader = LibPixelUploader({
  host: "test.libpx.com",
  source: "eu-west-1/uploads",
  element: "#file-input"
});
```

See the [Options](#options) section for details on all the possible uploader
options.

## Uploading

On your page will be a form which will be used to upload the images. Once the
user has selected a file, there are two ways of triggering the file upload:
automatically and manually.

### Automatically

The automatic way binds event listeners to the file input's form and uploads the
image when the form submission is triggered. You can use this option
by calling `addEventListeners()` on the uploader object:

```js
uploader.addEventListeners();
```

So as soon as the form is submitted, the upload to S3 will automatically start.

Behind the scenes, this is what the LibPixel Uploader does for you:

- When the user triggers the form submission:
  - Image upload starts.
  - The actual form submission is cancelled.
  - The submit button is disabled.
- When the upload finishes:
  - A hidden input is appended to the form with the same name attribute as the
    original file input. The value of this input is the S3 key of the uploaded
    object.
  - The original file input's name attribute is removed.
  - The submit button is re-enabled.
  - The form submission is triggered.

The uploader does not automatically create a progress bar, or show errors, but
instead gives options to listen to progress events, errors, and other events, so
that you can hook your own UI elements that match your design. See the
[Events](#events) section for details on all available events.

It's also possible to automatically start the image uploads as soon as the user
chooses a file, by using the `autoStart` option:

```js
uploader.addEventListeners({ autoStart: true });
```

If the user chooses another file before uploading, it guarantees that you'll
receive the key of the final image that was chosen. A previous upload in
progress will be cancelled. If the user submits the form before the upload has
finished, the actual form submission will be delayed until the upload finishes,
as without the `autoStart` option.

### Manually

Sometimes you'll want to trigger the file upload yourself, for example when not
using a form, or when the flow of events described above doesn't suit your
needs.

To manually trigger an upload, just call `upload()` on the uploader object:

```js
uploader.upload();
```

For this to work, the file element must already have a file selected, otherwise
either nothing will happen or the error callback will be called depending on the
`required` option setting.

<div id="options"></div>
## Options

### element

The file input where the user selects the image to upload. Can be defined in one
of the following ways:

1. String (CSS selector that uniquely identifies the file input).
2. An `HTMLInputElement` object, for example, returned by
   `document.querySelector`.
3. A jQuery object (e.g. `$("#file-input")`).

### source

The LibPixel source path, without the leading `/` (e.g. `"us-east-1/userimages"`
or `"eu-west-1/uploads"`).

### host

The LibPixel host, without a protocol (e.g. `"test.libpx.com"`).

### required

Whether choosing a file is required when submitting the form when using
`addEventListeners()` or when calling `upload()`. Default is `true` (file is
required).

If no file is set and the form is submitted with `required` set to `true`, then
the error callback will be called.

If `required` is set to `false`, then the form can be submitted without a file
set, and any other fields in the form will be submitted to your server without
any interference by the LibPixel Uploader.

### mode

By default the LibPixel Uploader will upload files via XHR, except when the
`FormData` interface is not supported (e.g. IE 8/9). In these cases, it will
automatically fall back to an iframe transport mode, where progress events are
not supported.

You usually don't want to modify this option, except when testing the iframe
transport mode during development, and don't want to switch to an older and
unsupported browser.

Possible options are:

- `"auto"` (default)
- `"xhr"`
- `"iframe"`

<div id="events"></div>
## Events

Event listeners are defined by calling functions on the uploader object which
take callback functions:

```js
uploader.progress(function (event) {
  // handle progress
});
```

Each event listener definition function returns the upload object, so you can
chain multiple event callback definitions if you want:

```js
uploader.start(function (event) {
  // handle start
}).progress(function (event) {
  // handle progress
});
```

### start

Called every time an upload starts, once per selected file.

The event object contains the following keys:

- `id`: string that uniquely identifies this upload. The same string is passed
  to all events for the same file.
- `progressSupported`: whether progress events will be sent. Some older browsers
  may not support progress events, in which case this will be `false`.

### progress

Called whenever a progress update for the upload is available.

The event object contains the following keys:

- `id`: string that uniquely identifies this upload.
- `loaded`: number of bytes transferred.
- `total`: number of bytes to be transferred in total (i.e. file size).
- `percentage`: percentage of upload completed (between `0.0` and `1.0`).

### success

Called every time an upload finishes successfully, once per selected file.

The event object contains the following keys:

- `id`: string that uniquely identifies this upload.
- `key`: S3 object key of the uploaded file.

### error

Called whenever an error occurs.

The event object contains the following keys:

- `id`: string that uniquely identifies this upload.
- `message`: message describing the error, in English. See [I18n](#i18n) to
  learn how to customize these messages.

<div id="i18n"></div>
## I18n

If you wish to customize the error messages, you can modify the
`LibPixelUploader.messages` object:

```js
LibPixelUploader.messages.fileNotSelected = "You must select a file to upload";
```

*Important:* you must always modify the `messages` object, and never reassign
it.

The available message keys and their default values are:
```js
{
  fileNotSelected: "You must select a file to upload",
  invalidExtension: "File must have one of the following extensions:"
}
```

<div id="cors"></div>
## AWS S3 CORS configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>POST</AllowedMethod>
        <MaxAgeSeconds>3000</MaxAgeSeconds>
        <AllowedHeader>*</AllowedHeader>
    </CORSRule>
</CORSConfiguration>
```

## Contributing

If you wish to contribute, start by getting the project up and
running. You'll need a recent version of Node.js. After cloning the GitHub repo
you'll need to install all the development dependencies with NPM:

```
$ npm install
```

This project uses [gulp.js](http://gulpjs.com) for automating tasks. The defined
tasks for development are:

- `gulp server`: starts a development server on port 9090 which automatically
  rebuilds and serves the latest version at
  http://localhost:9090/dist/uploader.js.
- `gulp watch`: watches for changes runs the build task on every change.
- `gulp build`: creates a development (non-minified) version in
  `dist/uploader.js`.
- `gulp dist`: creates a production (minified) version in
  `dist/uploader.min.js`.

### Testing

There are both unit tests and end-to-end tests that run in real browser
environments (via Sauce Labs with Selenium).

Unit tests can be run locally with [Karma](http://karma-runner.github.io/):

```
$ gulp test:unit
```

End-to-end tests require a [Sauce Labs](https://saucelabs.com) account and Sauce
Connect.

Set the `SAUCE_USERNAME` and `SAUCE_ACCESS_KEY` environment variables to contain
your credentials and export them.

You must start Sauce Connect with the following options:

```
$ sc -u $SAUCE_USERNAME -k $SAUCE_ACCESS_KEY -N --direct-domains "*.libpx.com"
```

Once Sauce Connect is ready, the tests can be run with:

```
$ gulp test:browser
```

The browser tests are setup to run on the following browsers:

- Firefox
- Chrome
- IE 8, 9, 10, and 11.

Unfortunately the Safari Selenium WebDriver doesn't support file uploads via a
file input, so it must be manually tested.

## License

The MIT License.
