/**
 * Rate My Vandy Professors
 * JavaScript file to scrape information and replace it in Class Search
 */

import { restricted } from './restricted';
import { subs } from './subs';

const BASE_URL: string = 'http://www.ratemyprofessors.com';
const BASE_SEARCH_URL: string = 'http://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=Vanderbilt+University&schoolID=4002&query=';
const GREEN: string = '#27AE60';
const YELLOW: string = '#FF9800';
const RED: string = '#E74C3C';
// Use the same loading indicator that the page already does; don't host our own
const LOADING_INDICATOR: string = '<img src="https://webapp.mis.vanderbilt.edu/more/images/loading.gif">';
// The divs that contain possible locations for professor names to populate
const $COURSE_LIST_AREAS: HTMLElement[] = [
  document.getElementById('searchClassSectionsResults'),
  document.getElementById('studentCart_content'),
  document.getElementById('enrolledClassSections_content'),
];

// @ts-ignore
chrome.runtime.sendMessage({ action: 'showIcon' });

// Watch each of the areas where professor names may appear for changes. When detected, rate each professor.
const getOverallScoresObserver: MutationObserver = new MutationObserver(rateProfessorsOnPage);
$COURSE_LIST_AREAS.forEach(area => getOverallScoresObserver.observe(area, { childList: true }));

/**
 * Rates each of the professors currently in view.
 */
function rateProfessorsOnPage() {
  const professorNodes: NodeListOf<Element> = getProfessorNodes();
  // Group nodes by professor name. This way, only one API call needs to be made per professor, then that score
  // is assigned to each of the nodes with that professor
  const groupedProfessorNodes = groupProfessors(professorNodes);
  Object.keys(groupedProfessorNodes).forEach(async name => {
    try {
      if (isValidProfessor(name) && isUnratedProfessor(name)) {
        groupedProfessorNodes[name].forEach(setIsLoading);
        const score = await getProfessorId(name).then(getOverallScore);
        groupedProfessorNodes[name].forEach(node => setScore(name, node, score));
      } else if (isUnratedProfessor(name)) {
        groupedProfessorNodes[name].forEach(node => setInvalidScore(name, node));
      }
    } catch (err) {
      groupedProfessorNodes[name].forEach(node => setInvalidScore(name, node));
    }
  });
}

/**
 * Returns an array of nodes of each search result's professor field
 */
function getProfessorNodes(): NodeListOf<Element> {
  return document.getElementsByClassName('classInstructor');
}

/**
 * Gets the part of the URL that needs to be appended to the base URL to reach the professor's page
 * Example return: '/ShowRatings.jsp?tid=2301025'
 */
function getProfessorId(profName: string): Promise<string> {
  const config = {
    action: 'searchForProfessor',
    method: 'POST',
    url: BASE_SEARCH_URL + convertName(profName)
  };

  return new Promise((resolve, reject) => {
    // @ts-ignore
    chrome.runtime.sendMessage(config, res => {
      if (res.profId) {
        resolve(res.profId);
      } else {
        reject('Search result not found');
      }
    });
  });
}

/**
 * Scrapes the RMP page for the professor at <profId> for their overall score and returns it
 */
function getOverallScore(profId: string): Promise<number> {
  const config = {
    action: 'getOverallScore',
    method: 'POST',
    url: BASE_URL + profId,
  };

  return new Promise((resolve, reject) => {
    // @ts-ignore
    chrome.runtime.sendMessage(config, res => {
      if (res.profRating) {
        if (res.profRating === '0.0' || res.profRating.includes('Grade received')) {
          reject('Professor not rated');
        } else {
          resolve(parseFloat(res.profRating));
        }
      } else {
        reject('No rating found');
      }
    });
  });
}

/**
 * Converts a name from it's notation as shown in the search results to a form
 * that can be appended to the base RateMyProfessors URL in order to emulate
 * a search.
 */
function convertName(original: string): string {
  const regex = /\w+(, )\w+/g;
  const temp: RegExpExecArray = regex.exec(original);
  if (temp[0].trim() in subs) {
    temp[0] = subs[temp[0].trim()];
  }
  return encodeURIComponent(temp[0]);
}

/**
 * Returns a color based on <rating>. These numbers match the values on RateMyProfessors.com
 */
function getColor(rating: number): string {
  // TODO: search SPAN, scroll to "Alpren, Francis". The rating is 3.4 but the color is red.
  if (rating >= 3.5) {
    return GREEN;
  }
  if (rating < 2.5) {
    return RED;
  }
  return YELLOW;
}

/**
 * Given an array of elements, groups them by professor name and returns an object
 * where the key represents the professor name and the value is an array of the nodes
 * that correspond to that professor.
 * 
 * Slight modification of https://stackoverflow.com/questions/14446511/what-is-the-most-efficient-method-to-groupby-on-a-javascript-array-of-objects
 */
function groupProfessors(vals: NodeListOf<Element>): { [key: string]: HTMLElement[] } {
  return Array.from(vals).reduce((ret, val) => {
    (ret[val.textContent.trim()] = ret[val.textContent.trim()] || []).push(val);
    return ret;
  }, {});
}

/**
 * Returns TRUE if the professor is a single, non-Staff professor. Staff professors and
 * courses with multiple professors return FALSE.
 */
function isValidProfessor(name: string): boolean {
  return (name !== '' && !name.includes('Staff') && !name.includes(' | ') && !restricted.includes(name));
}

/**
 * Return TRUE if the professor is not already rated or is in the process of being rated.
 * FALSE otherwise.
 */
function isUnratedProfessor(name: string): boolean {
  return !name.includes(' - ');
}

/**
 * Adds 'N/A' as the score to professor on the search page
 */
function setInvalidScore(name: string, node: HTMLElement) {
  setScore(name, node);
}

/**
 * Appends the loading indicator next to professor names in the results list
 */
function setIsLoading(node: HTMLElement) {
  node.innerHTML = node.innerHTML + ' - ' + LOADING_INDICATOR;
}

/**
 * Adds the score and changes the color of the professor on the search page
 */
function setScore(name: string, node: HTMLElement, score?: number) {
  if (score) {
    node.textContent = name + ' - ' + score.toFixed(1);
    node.style.color = getColor(score);
  } else {
    node.textContent = name + ' - N/A';
  }
}
