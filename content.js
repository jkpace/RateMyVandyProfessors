/**
 * Rate My Vandy Professors
 * JavaScript file to scrape information and replace it in Class Search
 */

var timeout = null;		            // Necesssary for listener

// Find a way to make next two variables readable
var anchorIndicator = '<div class="contextMenuItem contextMenuDivider"><div class="contextItemHeader">Active</div><div class="contextItemBody"><img src="https://i.imgur.com/Dp6UoWh.png" /></div></div>';
var modal = '<div class="detailHeader" id="ratingsLabel">Ratings</div><div class="detailPanel" id="ratings"><center id="modalLink">View on RateMyProfessor</center><table class="availabilityNameValueTable"><tbody><tr><td colspan="2"><div class="listDivider"></div></td></tr><tr><td class="label">Helpfulness: </td><td id="helpfulness"><img src="https://webapp.mis.vanderbilt.edu/more/images/loading.gif"></td></tr><tr><td class="label">Clarity: </td><td id="clarity"><img src="https://webapp.mis.vanderbilt.edu/more/images/loading.gif"></td></tr><tr><td class="label">Easiness: </td><td id="easiness"><img src="https://webapp.mis.vanderbilt.edu/more/images/loading.gif"></td></tr></tbody></table></div>';
var LOADING_GIF_TAG = '<img src="https://acad.app.vanderbilt.edu/more/images/loading.gif">'

// Show user that the extension is active
$("#mainContextMenu").css("width", "auto");
$("#mainContextMenu .contextMenuItem").eq(0).before(anchorIndicator);

/**
 * Checks the DOM for changes ten times per second
 * This allows the extension to update even though the URL never changes
 */
document.addEventListener("DOMSubtreeModified", function() {
    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(update, 100);
}, false);

/**
 * Searches through results page + modal window for professor names
 */
function update() {
    getProfessorNames();
    if (document.getElementById("ratings") == null) {
        $("#rightSection").append(modal);
        var teacher = $("table.meetingPatternTable div").last().text().trim();
        if (teacher != "" && !teacher.includes("Staff")) {
            // RegEx to remove everything before "Primary"
            teacher = /.+?(?= [(])/g.exec(teacher)[0];
            getModalUrl(teacher);
        } else {
            setNoRatingsAvailable();
        }
    }
}

/**
 * Gets the professor name from Class Search
 */
function getProfessorNames() {
    names = $(".classInstructor");
    for (var i = 0; i < names.length; i++) {
        // Make sure current name isn't already rated/being rated
        if (!names[i].innerText.includes(" - ") && names[i].innerText != "" && !names[i].innerHTML.includes("<img")) {
            if (names[i].innerText.includes("Staff") || names[i].innerText.includes(" | ")) {
                names[i].innerText += " - N/A";
            } else {
                names[i].innerHTML += LOADING_GIF_TAG;
                searchForProfessor(i);
            }
        }
    }
}

/**
 * Emulates  the RMP search page then outputs the
 * specific ID for that professor at Vanderbilt
 */
function searchForProfessor(profIndex) {
    var profName = names[profIndex].innerText;
    chrome.runtime.sendMessage({
        action: "searchForProfessor",
        method: "POST",
        url: "http://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=Vanderbilt+University&schoolID=4002&query=" + convertName(profName)
    }, function(response) {
        if (response.profLink != null) {
            getOverallScore(profIndex, profName, response.profLink);
        } else {
            names[profIndex].innerText += " - N/A";
        }
    });
}

/**
 * Changes the original name into one that can be searched
 */
function convertName(original) {
    original = original.trim();
    if (original in subs) {
        original = subs[original].replace(", ", "%2C+");
        return original;
    }
    // regex to change names to LAST, FIRST (no middle initial) format
    var temp = /\w+(, )\w+/g.exec(original);
    // checking again; make more efficient later
    if (temp[0].trim() in subs) {
        temp[0] = subs[temp[0].trim()];
    }
    return temp[0].replace(", ", "%2C+");
}

/**
 * Builds on searchForProfessor, visits the URL
 * and returns the overall rating for that professor
 */
function getOverallScore(profIndex, profName, profLink) {
    chrome.runtime.sendMessage({
        action: "getOverallScore",
        method: "POST",
        url: "http://www.ratemyprofessors.com" + profLink
    }, function(response) {
        if (!names[profIndex].innerText.includes(" - ")) {
            // Ignore requests with no ratings
            if (response.profRating == "0.0" || response.profRating.includes("Grade Received")) {
                names[profIndex].innerText += " - N/A";
            } else {
                names[profIndex].innerText += " - " + response.profRating;
                names[profIndex].style.color = getColor(parseFloat(response.profRating));
            }
        }
    });
}

/**
 * Gets professor name form modal window and returns their URL from RMP
 */
function getModalUrl(teacher) {
    teacher = convertName(teacher);
  chrome.runtime.sendMessage({
    action: "searchForProfessor",
    method: "POST",
    url: "http://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=Vanderbilt+University&schoolID=4002&query=" + teacher
  }, function(response) {
    if (response.profLink != null) {
        var linkToPage = "http://www.ratemyprofessors.com" + response.profLink;
        $("#modalLink").wrap('<a href="' + linkToPage + '" target="_blank" />');
        getOtherScores(response.profLink);
    } else {
        setNoRatingsAvailable();
    }
  });
}

/**
 * Gets the professor's ratings from a modal window
*/
function getOtherScores(profLink) {
    chrome.runtime.sendMessage({
        action: "getOtherScores",
        method: "POST",
        url: "http://www.ratemyprofessors.com" + profLink
    }, function(response) {
        // Workaround for teacher in RMP, but no ratings yet
        if (response.otherScores.length > 0) {
            $("#helpfulness").text(response.otherScores[0]);
            $("#clarity").text(response.otherScores[1]);
            $("#easiness").text(response.otherScores[2]);
        } else {
            setNoRatingsAvailable();
        }
    })
}

/**
 * Changes values in modal windows to show that no ratings are available
*/
function setNoRatingsAvailable() {
    $("#modalLink").text("No ratings available");
    $("#helpfulness").text("N/A");
    $("#clarity").text("N/A");
    $("#easiness").text("N/A");
}

/**
 * Color-codes the ratings
 */
function getColor(profRating) {
    if (profRating >= 3.5) {
        return "#27AE60";   // Green
    } else if (profRating < 2.5) {
        return "#E74C3C";   // Red
    } else {
        return "#FF9800";   // Yellow
    }
}
