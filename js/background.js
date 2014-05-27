var ceres = new Asteroid("localhost:3000");
var Posts = ceres.createCollection("posts");

ceres.on("login", function () {
	chrome.browserAction.setIcon({path: "../img/icon.png"});
	chrome.browserAction.setPopup({popup: "../html/popup-loggedin.html"});
});

ceres.on("logout", function () {
	chrome.browserAction.setIcon({path: "../img/icon-bw.png"});
	chrome.browserAction.setPopup({popup:"../html/popup-loggedout.html"});
});

chrome.runtime.onMessage.addListener(function (msg, sender) {
	if (msg === "login") {
		ceres.loginWithTwitter();
	}
	if (msg === "logout") {
		ceres.logout();
	}
	if (msg === "import") {
		chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
			var tab = tabs[0];
			ceres.call("addPostFromExternalSource", tab.url).result.then(function (id) {
				var url = "http://localhost:8080/#!/post/" + id + "/edit";
				chrome.tabs.update(tab.id, {url: url});
			}, function (err) {
				console.log(err);
			});
		});
	}
});
