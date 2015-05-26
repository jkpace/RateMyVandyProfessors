/**
 * Rate My Vandy Professor
 * JavaScript file to scrape information and replace it in Class Search
 */

var timeout = null;		            // Necesssary for listener
var names;                          // Set as global variable so any function can use it

// Confirm that the extension is active
$("h1").append(" - Extension active");

/**
 * Every second, checks to see if AJAX executes (if page changes any)
 * This allows the extension to update even though the URL never changes
 */
document.addEventListener("DOMSubtreeModified", function() {
    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(update, 1000);
}, false);

/**
 * This is a test function to test the auto-updater
 */
function update() {
    getProfessorNames();
    $("table.meetingPatternTable tr[1] td[4]").wrap('<a href="http://www.google.com/"></a>')       // Replaces in modal
}

/**
 * This function gets the professor name from Class Search
 */
function getProfessorNames() {
    names = $(".classInstructor");
    for (var i = 0; i < names.length; i++) {
        if (!names[i].innerText.includes(" - ")) {
            if (!names[i].innerText.includes("Staff")) {
                names[i].innerHTML += '<img src="https://webapp.mis.vanderbilt.edu/more/images/loading.gif">'
                searchForProfessor(i, names[i].innerText);
            } else {
                names[i].innerText += " - N/A";
            }
        }
    }
}

/**
 * This function changes the original name into one that can be searched
 */
function convertName(original) {
    var temp = /\w+(, )\w+/g.exec(original);
    return temp[0].replace(", ", "%2C+");
}

/**
 * This function emulates the RMP search page then outputs 
 * the specific ID for that professor at Vanderbilt
 */
function searchForProfessor(profIndex, profName) {
    chrome.runtime.sendMessage({
        action: "xhr",
        method: "POST",
        url: "http://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=Vanderbilt+University&schoolID=4002&query=" + convertName(profName)
    }, function(response) {
        var searchPage = document.createElement("html");
        searchPage.innerHTML = response.pageText;
        var profLink = searchPage.getElementsByClassName("listing PROFESSOR")[0];
        if (typeof(profLink) != "undefined") {
            profLink = profLink.getElementsByTagName("a")[0].getAttribute("href");
            findRating(profIndex, profName, profLink);
        } else {
            names[profIndex].innerText += " - N/A";
        }
    });
}

/**
 * This function builds on searchForProfessor by "clicking" by
 * finding the teacher's rating from RMP and returning it.
 */
function findRating(profIndex, profName, profLink) {
    chrome.runtime.sendMessage({
        action: "xhr",
        method: "POST",
        url: "http://www.ratemyprofessors.com" + profLink
    }, function(response) {
        var ratingPage = document.createElement("html");
        ratingPage.innerHTML = response.pageText;
        var profRating = ratingPage.getElementsByClassName("grade")[0].innerText;
        if (parseInt(profRating) > 4.0) {
            var color = "#27AE60";                  // Green
        } else if (parseInt(profRating) < 3.0) {
            var color = "#E74C3C";                  // Red
        } else {
            var color = "#FF9800";                  // Yellow
        }
        if (!names[profIndex].innerText.includes(" - ")) {
            if (profRating != "0.0") {
                names[profIndex].innerText += " - " + profRating;
            } else {
                names[profIndex].innerText += " - N/A";
            }
        }
    });
}