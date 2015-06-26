// This background file serves as a workaround for mixed content in Chrome
chrome.runtime.onMessage.addListener(function(request, sender, callback) {
	var xhr = new XMLHttpRequest();
	var method = request.method ? request.method.toUpperCase() : 'GET';
	xhr.open(method, request.url, true);
	if (method == "POST") {
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	}
	xhr.send(request.data);
	if (request.action == "xhr") {
		xhr.onload = function() {
            callback({pageText: xhr.responseText});
        }
		xhr.onerror = function() {
			console.debug("[ERROR: xhr]");
			callback();
		}
		return true;
	} else if (request.action == "searchForProfessor") {
		xhr.onload = function() {
			var searchPage = document.createElement("html");
	        searchPage.innerHTML = xhr.responseText;
	        var profLink = searchPage.querySelector(".listing.PROFESSOR");
	        if (profLink != null) {
	            profLink = profLink.getElementsByTagName("a")[0].getAttribute("href");
	        }
	        callback({profLink: profLink});
		}
		xhr.onerror = function() {
			console.debug("[ERROR: searchForProfessor]");
			callback();
		}
		return true;
	} else if (request.action == "getOverallScore") {
		xhr.onload = function() {
			var ratingPage = document.createElement("html");
	        ratingPage.innerHTML = xhr.responseText;
	        var profRating = ratingPage.querySelector("div.grade").innerText;
	        callback({profRating: profRating});
		}
		xhr.onerror = function() {
			console.debug("[ERROR]: getOverallScore");
			callback();
		}
		return true;
	} else if (request.action == "getOtherScores") {
		xhr.onload = function() {
			var otherRatingPage = document.createElement("html");
			ratingPage.innerHTML = xhr.responseText;
			var allRatings = ratingPage.querySelectorAll(".rating").innerText;
			var otherRatings = new Array(3);
			for (var i = 0; i < 2; i++) {
				otherRatings[i] = allRatings[i];
			}
			callback({otherRatings: otherRatings});
		}
		xhr.onerror = function() {
			console.debug("[ERROR: getOtherScores]");
			callback();
		}
		return true;
	}
});
