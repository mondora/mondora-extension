var gulp = require("gulp");
var concat = require("gulp-concat");

var buildVendorScripts = function (dest) {
	var sources = [
		"bower_components/q/q.js",
		"bower_components/ddp.js/ddp.js",
		"bower_components/asteroid/dist/asteroid.js"
	];
	return gulp.src(sources)
		.pipe(concat("vendor.js"))
		.pipe(gulp.dest(dest));
};

gulp.task("build", function () {
	buildVendorScripts(".");
});
