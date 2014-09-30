var gulp	= require("gulp");
var concat	= require("gulp-concat");
var pp		= require("gulp-preprocess");
var mkdirp	= require("mkdirp");
var exec	= require("child_process").exec;
var Q		= require("q");

var buildVendorScripts = function (dest) {
	console.log("Building vendor scripts");
	console.log(dest);
	var deferred = Q.defer();
	gulp.src([
		"bower_components/q/q.js",
		"bower_components/ddp.js/src/ddp.js",
		"bower_components/asteroid/dist/asteroid.chrome.js",
		"bower_components/asteroid/dist/plugins/twitter-login.js"
	])
		.pipe(concat("vendor.js"))
		.pipe(gulp.dest(dest))
		.on("end", function () {
			deferred.resolve();
		});
	return deferred.promise;
};

var buildScripts = function (dest, target) {
	console.log("Building scripts");
	var deferred = Q.defer();
	gulp.src("ext/js/*.js")
		.pipe(pp({
			context: {
				TARGET: target
			}
		}))
		.pipe(gulp.dest(dest))
		.on("end", function () {
			deferred.resolve();
		});
	return deferred.promise;
};

var buildStyles = function (dest) {
	console.log("Building styles");
	var deferred = Q.defer();
	gulp.src("ext/css/*.css")
		.pipe(gulp.dest(dest))
		.on("end", function () {
			deferred.resolve();
		});
	return deferred.promise;
};

var buildImages = function (dest) {
	console.log("Building images");
	var deferred = Q.defer();
	gulp.src("ext/img/*")
		.pipe(gulp.dest(dest))
		.on("end", function () {
			deferred.resolve();
		});
	return deferred.promise;
};

var buildManifest = function (dest) {
	console.log("Building manifest");
	var deferred = Q.defer();
	gulp.src("ext/manifest.json")
		.pipe(gulp.dest(dest))
		.on("end", function () {
			deferred.resolve();
		});
	return deferred.promise;
};

gulp.task("buildProd", function () {
	return Q()
		.then(function () {
			mkdirp.sync("builds/prod/js");
			mkdirp.sync("builds/prod/css");
			mkdirp.sync("builds/prod/img");
		})
		.then(function () {
			return buildVendorScripts("builds/prod/js/");
		})
		.then(function () {
			return buildScripts("builds/prod/js/", "prod");
		})
		.then(function () {
			return buildStyles("builds/prod/css/");
		})
		.then(function () {
			return buildImages("builds/prod/img/");
		})
		.then(function () {
			return buildManifest("builds/prod/");
		})
		.then(function () {
			exec("rm builds/mondora-extension.zip");
			exec("cd builds/ && zip -r mondora-extension.zip prod/");
		});
});

gulp.task("buildTest", function () {
	return Q()
		.then(function () {
			mkdirp.sync("builds/test/js");
			mkdirp.sync("builds/test/css");
			mkdirp.sync("builds/test/img");
		})
		.then(function () {
			return buildVendorScripts("builds/test/js/");
		})
		.then(function () {
			return buildScripts("builds/test/js/", "test");
		})
		.then(function () {
			return buildStyles("builds/test/css/");
		})
		.then(function () {
			return buildImages("builds/test/img/");
		})
		.then(function () {
			return buildManifest("builds/test/");
		});
});

gulp.task("default", ["buildTest", "buildProd"]);
