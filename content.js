/**
 * Rate My Vandy Professor
 * JavaScript file to scrape information and replace it
 * Jamal Pace - jamal.pace@vanderbilt.edu
 */

var timeout = null;		// Necesssary for listener
var xhr = new XMLHttpRequest();

// Confirm that the extension is active
$("h1").append(" - RMVP Active");

function requestInfo() {
	var search = "http://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=Vanderbilt+University&schoolID=4002&query=" + "gill%2C+lesley";
	console.debug(search);
}

/**
 * This method replaces the professors' names with the ratings
 */
function update() {
    console.debug("listener fired.");
    $(".classInstructor").replaceWith('<td class="classInstructor">Placeholder</td>');	// Replaces in table
    $("table.meetingPatternTable tr:gt(0) td:gt(3)").replaceWith("Placeholder");		// Replaces in modal
    //requestInfo();
}

/**
 * Every second, checks to see if AJAX executes (if page changes any)
 * This allows the extension to update even though the URL never changes
 */
document.addEventListener("DOMSubtreeModified", function() {
    if (timeout) {
        clearTimeout(timeout);
    }
	timeout = setTimeout(update, 500);
}, false);