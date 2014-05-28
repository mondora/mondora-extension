var text = document.createElement("div");
text.id = "mnd-extension-text";
text.innerHTML = "Importing...";
var overlay = document.createElement("div");
overlay.id = "mnd-extension-overlay";
overlay.appendChild(text);
var body = document.querySelector("body");
body.appendChild(overlay);
