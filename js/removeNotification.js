var notification = document.getElementById("mnd-extension-overlay");
notification.parentElement.removeChild(notification);
window.clearInterval(window.MONDORA_EXTENSION_INTERVAL);
