// This background file serves as a workaround for mixed content in Chrome

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
	if (request.action == "xhr") {
		var xhr = new XMLHttpRequest();
		var method = request.method ? request.method.toUpperCase() : 'GET';
		xhr.onload = function() {
            callback({pageText: xhr.responseText});
        }
		xhr.onerror = function() {
			console.log("[ERROR]");
			callback();
		}
		xhr.open(method, request.url, true);
		if (method == 'POST') {
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		}
		xhr.send(request.data);
		return true;
	}
});