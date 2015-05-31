/**
 * Rate My Vandy Professors
 * JavaScript file to scrape information and replace it in Class Search
 */

var timeout = null;		            // Necesssary for listener
var isList = true;                  // True: in a list; False: in a modal
var names;                          // Set as global variable so any function can use it
// Find a way to make next two variables readable
var indicator = '<div class="contextMenuItem contextMenuDivider"><div class="contextItemHeader">Active</div><div class="contextItemBody"><img src="https://i.imgur.com/Dp6UoWh.png" /></div></div>';
var modal = '<div class="detailHeader" id="ratings">Ratings</div><div class="detailPanel"><center><a href="http://www.ratemyprofessors.com/ShowRatings.jsp?tid=1424588" target="_blank">View on RateMyProfessor</a></center><table class="availabilityNameValueTable"><tbody><tr><td colspan="2"><div class="listDivider"></div></td></tr><tr><td class="label">Helpfulness: </td><td>5.0</td></tr><tr><td class="label">Clarity: </td><td>4.9</td></tr><tr><td class="label">Easiness: </td><td>4.0</td></tr></tbody></table></div>'

// Confirm that the extension is active
$("#mainContextMenu").css("width", "auto");
$("#mainContextMenu .contextMenuItem").eq(0).before(indicator);

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
 * This function determines the type of data to retrieve, pushes it
 */
function update() {
    getProfessorNames();
    if (document.getElementById("ratings") == null) {
        $("#rightSection").append(modal);
    }
}

/**
 * This function gets the professor name from Class Search
 */
function getProfessorNames() {
    names = $(".classInstructor");
    for (var i = 0; i < names.length; i++) {
        if (!names[i].innerText.includes(" - ") && names[i].innerText != "" && !names[i].innerHTML.includes("<img")) {
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
    if (original.trim() in subs) {
        original = subs[original.trim()];
    }
    // Only take words immediately before and after comma (cuts off initials)
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
        var profLink = searchPage.querySelector(".listing.PROFESSOR");
        if (profLink != null) {
            profLink = profLink.getElementsByTagName("a")[0].getAttribute("href");
            findRating(profIndex, profName, profLink);
        } else {
            names[profIndex].innerText += " - N/A"; 
        }
    });
}

/**
 * This function builds on searchForProfessor visits the URL
 * and returns the overall rating for that professor
 */
function findRating(profIndex, profName, profLink) {
    chrome.runtime.sendMessage({
        action: "xhr",
        method: "POST",
        url: "http://www.ratemyprofessors.com" + profLink
    }, function(response) {
        var ratingPage = document.createElement("html");
        ratingPage.innerHTML = response.pageText;
        var profRating = ratingPage.querySelector("div.grade").innerText;
        var color = getColor(parseInt(profRating));
        if (!names[profIndex].innerText.includes(" - ")) {
            if (profRating != "0.0") {              // This only happens when there are no ratings
                names[profIndex].innerText += " - " + profRating;
                names[profIndex].style.color = color;
            } else {
                names[profIndex].innerText += " - N/A";
            }
        }
    });
}

/**
 * This function color-codes the ratings
 */
function getColor(profRating) {
    if (profRating >= 3.5) {
            return "#27AE60";                  // Green
        } else if (profRating < 2.5) {
            return "#E74C3C";                  // Red
        } else {
            return "#FF9800";                  // Yellow
        }
}