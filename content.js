/**
 * Rate My Vandy Professor
 * JavaScript file to scrape information and replace it
 * Jamal Pace - jamal.pace@vanderbilt.edu
 */

var timeout = null;		// Necesssary for listener
var loc = "http://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=Vanderbilt+University&schoolID=4002&query=" + "gill%2C+lesley";

// Confirm that the extension is active
$("h1").append(" - Click to Run");

// Placeholder click to update function until infinite loop resolved
$("h1").click(function() {
    searchForProfessor();
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

function searchForProfessor() {
    chrome.runtime.sendMessage({
        action: 'xhr',
        method: 'POST',
        url: "http://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=Vanderbilt+University&schoolID=4002&query=gill%2C+lesley"
    }, function(response) {
        console.debug("Request received.");
        var page = response.response;
        console.debug(page);
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
	timeout = setTimeout(update, 500);
}, false); */