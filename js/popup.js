window.onload = function () {

	var loginButton = document.getElementById("loginButton");
	var logoutButton = document.getElementById("logoutButton");
	var importButton = document.getElementById("importButton");

	if (loginButton) {
		loginButton.addEventListener("click", function () {
			chrome.runtime.sendMessage(null, "login");
			window.close();
		}, false);
	}

	if (logoutButton) {
		logoutButton.addEventListener("click", function () {
			chrome.runtime.sendMessage(null, "logout");
			window.close();
		}, false);
	}

	if (importButton) {
		importButton.addEventListener("click", function () {
			chrome.runtime.sendMessage(null, "import");
			window.close();
		}, false);
	}

};
