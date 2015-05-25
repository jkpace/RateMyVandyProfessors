/**
 * Rate My Vandy Professor
 * JavaScript file to scrape information and replace it
 * Jamal Pace - jamal.pace@vanderbilt.edu
 */

var timeout = null;		            // Necesssary for listener
var nameFilter = /\w+(, )\w+/g;     // RegEx to change names into searchable terms
var loc = "http://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=Vanderbilt+University&schoolID=4002&query=" + "gill%2C+lesley";

// Confirm that the extension is active
$("h1").append(' - Click to run');

// Placeholder click to update function until infinite loop resolved
$("h1").click(function() {
    console.debug(convertName("Casagrande, Vivien A. | Calkins, David J."));
})

/**
 * This method gets the professor name from Class Search
 */
function getProfessorNames() {
    var names = $(".classInstructor");
    console.debug(names);
    for (var i = 0; i < names.length; i++) {
        if (names[i].innerText != "Staff") {
            console.debug(names[i].innerText);
        }
    }
}

/**
 * This method changes the original name into one that can be searched
 */
function convertName(original) {
    var temp = /\w+(, )\w+/g.exec(original);
    return temp[0].replace(", ", "%2C+");
}

/**
 * This method emulates the RMP search page then outputs 
 * the specific ID for that professor at Vanderbilt
 */
function searchForProfessor() {
    chrome.runtime.sendMessage({
        action: 'xhr',
        method: 'POST',
        url: "http://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=Vanderbilt+University&schoolID=4002&query=gill%2C+lesley"
    }, function(response) {
        var searchPage = document.createElement('html');
        searchPage.innerHTML = response.response;
        var profLink = searchPage.getElementsByClassName("listing PROFESSOR")[0].getElementsByTagName("a")[0].getAttribute("href");
        console.debug(profLink);
    });
    return profLink;
}

/**
 * This method builds on searchForProfessor by "clicking" by
 * finding the teacher's rating from RMP and returning it.
 */
function findRating() {
    chrome.runtime.sendMessage({
        action: 'xhr',
        method: 'POST',
        url: "http://www.ratemyprofessors.com" + "/ShowRatings.jsp?tid=1543230"
    }, function(response) {
        console.debug("Request received.");
        var ratingPage = document.createElement('html');
        ratingPage.innerHTML = response.response;
        var profRating = ratingPage.getElementsByClassName("grade")[0].innerText;
        console.debug("This teacher's rating is " + profRating);
    });
}

/**
 * This method replaces the professors' names with the ratings
 */
function update() {
    console.debug("listener fired.");
    $(".classInstructor").wrap('<a href="http://www.google.com/"></a>');	                            // Replaces in table
    $("table.meetingPatternTable tr:gt(0) td:gt(3)").wrap('<a href="http://www.google.com/"></a>')		// Replaces in modal
}

/**
 * Every second, checks to see if AJAX executes (if page changes any)
 * This allows the extension to update even though the URL never changes
 */
/* document.addEventListener("DOMSubtreeModified", function() {
    if (timeout) {
        clearTimeout(timeout);
    }
	timeout = setTimeout([METHOD TO RUN HERE], 500);
}, false); */