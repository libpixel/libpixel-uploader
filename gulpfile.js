var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");
var webdriver = require("gulp-webdriver");
var Server = require("karma").Server;
var path = require("path");

gulp.task("default", ["server"]);

gulp.task("watch", ["build"], function () {
	gulp.watch(["src/**/*"], ["build"]);
});

gulp.task("dist", function (callback) {
  var myConfig = Object.create(webpackConfig);

	myConfig.plugins = myConfig.plugins.concat(
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			mangle: true,
			compress: true,
			mangleProperties: true
		})
	);

  webpack(myConfig, function(err, stats) {
		if(err) { throw new gutil.PluginError("dist", err); }
		gutil.log("[dist]", stats.toString({
			colors: true
		}));
		callback();
	});
});

var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = "sourcemap";
myDevConfig.debug = true;

var devCompiler = webpack(myDevConfig);

gulp.task("build", function (callback) {
	devCompiler.run(function(err, stats) {
		if (err) { throw new gutil.PluginError("build", err); }
		gutil.log("[build]", stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task("server", function () {
	var myConfig = Object.create(webpackConfig);
	myConfig.devtool = "eval";
	myConfig.debug = true;

	new WebpackDevServer(webpack(myConfig), {
		publicPath: "/" + myConfig.output.publicPath,
		stats: {
			colors: true
		}
	}).listen(9090, "localhost", function (err) {
		if (err) { throw new gutil.PluginError("server", err); }
		gutil.log("[server]", "http://localhost:9090/dist/uploader.js");
	});
});

gulp.task("test-server", function () {
	var express = require("express");
	var app = express();
	app.use(express.static(path.resolve(__dirname, ".")));
	var server = app.listen();
	process.env.testServerPort = server.address().port;
});

gulp.task("test:browser", ["build", "test-server"], function () {
	gulp.src("./test/wdio.conf.js").pipe(webdriver({
		wdioBin: "./node_modules/webdriverio/bin/wdio"
	}));
});

gulp.task("test:unit", function (done) {
  new Server({
    configFile: path.join(__dirname, "/test/karma.conf.js"),
    singleRun: true
  }, done).start();
});
