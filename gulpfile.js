var gulp	= require("gulp");
var concat	= require("gulp-concat");
var pp		= require("gulp-preprocess");
var mkdirp	= require("mkdirp");
var exec	= require("child_process").exec;

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

var buildScripts = function (dest, target) {
	return gulp.src("ext/js/*.js")
		.pipe(pp({
			context: {
				TARGET: target
			}
		}))
		.pipe(gulp.dest(dest));
};

var buildStyles = function (dest) {
	return gulp.src("ext/css/*.css")
		.pipe(gulp.dest(dest));
};

var buildImages = function (dest) {
	return gulp.src("ext/img/*")
		.pipe(gulp.dest(dest));
};

var buildManifest = function (dest) {
	return gulp.src("ext/manifest.json")
		.pipe(gulp.dest(dest));
};

gulp.task("buildProd", function () {
	mkdirp.sync("builds/prod/js");
	mkdirp.sync("builds/prod/css");
	mkdirp.sync("builds/prod/img");

	buildVendorScripts("builds/prod/js/");
	buildScripts("builds/prod/js/", "prod");
	buildStyles("builds/prod/css/");
	buildImages("builds/prod/img/");
	buildManifest("builds/prod/");

	exec("rm builds/mondora-extension.zip");
	exec("cd builds/ && zip -r mondora-extension.zip prod/");
});

gulp.task("buildTest", function () {
	mkdirp.sync("builds/test/js");
	mkdirp.sync("builds/test/css");
	mkdirp.sync("builds/test/img");

	buildVendorScripts("builds/test/js/");
	buildScripts("builds/test/js/", "test");
	buildStyles("builds/test/css/");
	buildImages("builds/test/img/");
	buildManifest("builds/test/");
});

gulp.task("default", ["buildTest", "buildProd"]);
