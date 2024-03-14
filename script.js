document.addEventListener("DOMContentLoaded", function () {
  //  stats from api
  //  taken from https://max.nekoweb.org/resources/nekoweb-stats/

  // this script is under the MIT license (https://max.nekoweb.org/resources/license.txt)

  const username = "lel"; // Put your Nekoweb username here

  const getStats = async () => {
    const request = await fetch(
      `https://nekoweb.org/api/site/info/${username}`,
    );
    const json = await request.json();

    const updated = new Date(json.updated_at).toLocaleDateString("en-GB"); // Formats Last Updated text
    const created = new Date(json.created_at).toLocaleDateString("en-GB"); // Formats Creation Date text

    document.getElementById("created").innerHTML =
      `<em>Created</em>: ${created}`;
    document.getElementById("updated").innerHTML =
      `<em>Updated</em>: ${updated}`;
    document.getElementById("visitors").innerHTML =
      `<em>Visits</em>: ${json.views}`;
    document.getElementById("followers").innerHTML =
      `<em>Followers</em>: ${json.followers}`;
  };
  getStats();

  // also edited from max's https://webring.nekoweb.org/onionring-widget.js

  // === ONIONRING-WIDGET ===
  //Changing graphics cuz they look cooler

  var tag = document.getElementById(ringID); //find the widget on the page

  thisSite = window.location.href; //get the url of the site we're currently on
  thisIndex = null;

  // go through the site list to see if this site is on it and find its position
  for (i = 0; i < sites.length; i++) {
    if (thisSite.startsWith(sites[i][0])) {
      //we use startswith so this will match any subdirectory, users can put the widget on multiple pages
      thisIndex = i;
      break; //when we've found the site, we don't need to search any more, so stop the loop
    }
  }
  // go through the extras list to see if this site is on it, and find what website is it an extra for
  for (i = 0; i < extras.length; i++) {
    if (thisSite.startsWith(extras[i][0])) {
      for (s = 0; s < sites.length; s++) {
        if (sites[s][0] === extras[i][1]) {
          thisIndex = s;
          break;
        }
      }
    }
    break;
  }

  function randomSite() {
    otherSites = sites.slice(); //create a copy of the sites list
    otherSites.splice(thisIndex, 1); //remove the current site so we don't just land on it again
    randomIndex = Math.floor(Math.random() * otherSites.length);
    location.href = otherSites[randomIndex][0];
  }

  //if we didn't find the site in the list, the widget displays a warning instead
  if (thisIndex == null) {
    tag.insertAdjacentHTML(
      "afterbegin",
      `
<table>
  <tr>
    <td>This site isn't part of ${ringName} yet. If you're the owner, make sure to do Control+F5, otherwise talk to Max!</td>
  </tr>
</table>
  `,
    );
  } else {
    //find the 'next' and 'previous' sites in the ring. this code looks complex
    //because it's using a shorthand version of an if-else statement to make sure
    //the first and last sites in the ring join together correctly
    previousIndex = thisIndex - 1 < 0 ? sites.length - 1 : thisIndex - 1;
    nextIndex = thisIndex + 1 >= sites.length ? 0 : thisIndex + 1;

    indexText = "";
    //if you've chosen to include an index, this builds the link to that
    if (useIndex) {
      indexText = `<a href='${indexPage}'>index</a> | `;
    }

    randomText = "";
    //if you've chosen to include a random button, this builds the link that does that
    if (useRandom) {
      randomText = `<a href='javascript:void(0)' onclick='randomSite()'><img src="images/Nekowebring/cat.png" alt="Random Site"></a>`;
    }

    //this is the code that displays the widget - EDIT THIS if you want to change the structure
    tag.insertAdjacentHTML(
      "afterbegin",
      `
  <table>
    <tr>
      <td class='webring-prev'><a href='${sites[previousIndex][0]}'><img src="images/Nekowebring/prev.png" alt="Previous Site"></a></td>
      <td style="text-align: center;" class='webring-info'><a href='${indexPage}'><img src="images/Nekowebring/nekowebring.png" alt="NekoWebRing Index"></a></br>
      <span class='webring-links'>
        ${randomText}
      <td class='webring-next'><a href='${sites[nextIndex][0]}'><img src="images/Nekowebring/next.png" alt="Next Site"></a></td>
    </tr>
  </table>
  `,
    );
  }
});
