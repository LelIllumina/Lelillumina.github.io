// === ONIONRING-WIDGET ===
//Changing graphics cuz they look cooler

const tag = document.getElementById(ringID); // Find the widget on the page

const thisSite = window.location.href; // Get the URL of the site we're currently on
let thisIndex = null; // Initialize thisIndex

// Go through the site list to see if this site is on it and find its position
for (let i = 0; i < sites.length; i++) {
  if (thisSite.startsWith(sites[i][0])) {
    // We use startsWith so this will match any subdirectory; users can put the widget on multiple pages
    thisIndex = i;
    break; // When we've found the site, we don't need to search anymore, so stop the loop
  }
}

// Go through the extras list to see if this site is on it, and find what website it is an extra for
for (i = 0; i < extras.length; i++) {
  if (thisSite.startsWith(extras[i][0])) {
    for (let s = 0; s < sites.length; s++) {
      if (sites[s][0] === extras[i][1]) {
        thisIndex = s;
        break;
      }
    }
    break;
  }
}

// eslint-disable-next-line no-unused-vars
function randomSite() {
  const otherSites = sites.slice(); // Create a copy of the sites list
  otherSites.splice(thisIndex, 1); // Remove the current site so we don't just land on it again
  const randomIndex = Math.floor(Math.random() * otherSites.length);
  location.href = otherSites[randomIndex][0];
}

// If we didn't find the site in the list, the widget displays a warning instead
if (thisIndex === null) {
  tag.insertAdjacentHTML(
    "afterbegin",
    `
<table>
  <tr>
    <td>This site isn't part of ${ringName} yet. If you're the owner, make sure to do Control+F5, otherwise talk to Max!</td>
  </tr>
</table>
  `
  );
} else {
  // Find the 'next' and 'previous' sites in the ring
  const previousIndex = thisIndex - 1 < 0 ? sites.length - 1 : thisIndex - 1;
  const nextIndex = thisIndex + 1 >= sites.length ? 0 : thisIndex + 1;

  let randomText = "";
  // If you've chosen to include a random button, this builds the link that does that
  if (useRandom) {
    randomText =
      "<span onclick=\"randomSite()\"><img src='/assets/images/Nekowebring/cat.png' alt='Random Site' height='13' width='16' ></span>";
  }

  // This is the code that displays the widget - EDIT THIS if you want to change the structure
  tag.insertAdjacentHTML(
    "afterbegin",
    `<table>
      <tr>
        <td class="webring-prev">
          <a href="${sites[previousIndex][0]}">
            <img
              src="/assets/images/Nekowebring/prev.png"
              alt="Previous Site"
              height="44"
              width="19"
          /></a>
        </td>
        <td style="text-align: center" class="webring-info">
          <a href="${indexPage}">
            <img
              src="/assets/images/Nekowebring/nekowebring.png"
              alt="NekoWebRing Index"
              height="20"
              width="88"
          /></a>
        </td>
        <span class="webring-links">${randomText}</span>

        <td class="webring-next">
          <a href="${sites[nextIndex][0]}"
            ><img
              src="/assets/images/Nekowebring/next.png"
              alt="Next Site"
              height="44"
              width="19"
          /></a>
        </td>
      </tr>
    </table>
  `
  );
}
