# RateMyVandyProfessor
RateMyVandyProfessor is a Google Chrome extension that puts RateMyProfessors ratings directly into Vanderbilt Class Search. It works by obtaining the names of each of the professors in Class Search, searching RateMyProfessors for the name, then returning and appending the <strong>overall score</strong> next to the name in the original webpage.
<img src="http://i.imgur.com/ZcAiofW.png">
#Known Issues
<ul>
  <li>Does not account for teachers with the same name (e.g. there is a "William Robinson" in both EECE and HIST).</li>
  <li>Does not load results automatically; text must be clicked for ratings to be displayed.</li>
  <li>Only works on search pages; results not loaded in modal window.</li>
  <li>Cannot be easily disabled from Google Chrome's address bar.</li>
  <li>Professors with zero ratings currently have a score of 0.0 instead of N/A.</li>
  <li>A number of professors have different names in Class Search than they do in RateMyProfessors, so results are not returned.</li>
</ul>
#Future Considerations
<ul>
  <li>Provide a breakdown of each of the ratings (helpfulness, clarity, easiness).</li>
  <li>Create a separate column with ratings for a cleaner look.</li>
  <li>Wait until all results are loaded before putting them into Class Search.</li>
</ul>
