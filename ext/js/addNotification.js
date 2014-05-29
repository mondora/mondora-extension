var text = document.createElement("div");
text.id = "mnd-extension-text";
text.innerHTML = "Importing .";
var overlay = document.createElement("div");
overlay.id = "mnd-extension-overlay";
overlay.appendChild(text);
var body = document.querySelector("body");
body.appendChild(overlay);
window.MONDORA_EXTENSION_INTERVAL = window.setInterval(function () {
	var txt = text.innerHTML;
	if (txt === "Importing ." || txt === "Importing . .") {
		text.innerHTML = txt +  " .";
	} else {
		text.innerHTML = "Importing .";
	}
}, 500);
