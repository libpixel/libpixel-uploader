var path = require("path");
var webpack = require("webpack");

module.exports = {
	cache: true,
	entry: {
		uploader: "./src/index.js",
	},
	output: {
		path: path.join(__dirname, "dist"),
		publicPath: "dist/",
		filename: "[name].js",
		library: "LibPixelUploader",
		libraryTarget: "var"
	},
	resolve: {
		root: path.join(__dirname, "src")
	},
	plugins: []
};
