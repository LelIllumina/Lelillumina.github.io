/* global ringID, sites, extras, ringName, useIndex, indexPage, useRandom */

//  stats from api
//  taken from https://max.nekoweb.org/resources/nekoweb-stats/

// this script is under the MIT license (https://max.nekoweb.org/resources/license.txt)

let username = "lel"; // <<<--- Insert your username here!

(async () => {
  try {
    const request = await fetch(
      `https://nekoweb.org/api/site/info/${username}`
    );
    const json = await request.json();

    const updated = new Date(json.updated_at).toLocaleDateString(); // Formats Last Updated text
    const created = new Date(json.created_at).toLocaleDateString(); // Formats Creation Date text

    if (document.getElementById("created"))
      document.getElementById("created").innerHTML =
        `<em>Created</em>: ${created}`;
    if (document.getElementById("updated"))
      document.getElementById("updated").innerHTML =
        `<em>Updated</em>: ${updated}`;
    if (document.getElementById("visitors"))
      document.getElementById("visitors").innerHTML =
        `<em>Visits</em>: ${json.views}`;
    if (document.getElementById("followers"))
      document.getElementById("followers").innerHTML =
        `<em>Followers</em>: ${json.followers}`;
  } catch (error) {
    console.error(error);
    // If you wish to insert some fallback here, you may do so!
  }
})();

// Scrobbled Widget
const lastfmWidget = () => {
  return new Promise(function (resolve, reject) {
    const socket = new WebSocket(
      "wss://scrobbled.tepiloxtl.net/ws/get_last_track/lelillumina"
    );

    socket.onopen = function () {
      resolve(socket);
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const track = data.recenttracks.track[0];

      // Check user's online status
      const status = document.getElementById("lastfm-status");

      status.textContent =
        track.nowplaying === "false" ? "Last Played" : "Now Playing";

      // check if NSFW
      var coverImgUrl = track.album.isnsfw
        ? "/images/NekoFM/NSFWCOVER.png"
        : track.image[2]["#text"];

      if (
        coverImgUrl ===
        "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png"
      ) {
        coverImgUrl = "/images/NekoFM/NoArt.png";
      }

      // Track elements
      const userDiv = document.getElementById("songBox");
      const trackNameEl = userDiv.querySelector(`#trackName`);
      const artistNameEl = userDiv.querySelector(`#artistName`);
      const coverImgEl = userDiv.querySelector(`#trackCover`);

      trackNameEl.textContent = track.name;
      artistNameEl.textContent = "by " + track.artist.name;
      coverImgEl.src = coverImgUrl ? coverImgUrl : "/images/NekoFM/NoArt.png";
    };

    socket.onerror = function (error) {
      reject(error);
    };
  });
};
lastfmWidget();

// See what day it is + 1
const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const d = new Date();
let dayIndex = d.getDay() + 1; // Get the index of the next day

if (dayIndex === 7) {
  // If it's Saturday, set dayIndex to 0 (Sunday)
  dayIndex = 0;
}

// All of the lights
let day = weekday[dayIndex];
window.onload = function () {
  var taglines = [
    "NENENENEKO WEBBB!!!",
    "Welcome to Lel Island!",
    "Lel is out there to get you!",
    "I may be dumb, but youre mean and thats worse",
    "who says i can think",
    "Report any bugs to me plssss :33333",
    "im gonna hide something sinister here",
    "THIS IS AN 18+ SITE, NO KIDS ALLOWED TIME TO GET 𝓯𝓻𝓮𝓪𝓴𝔂",
    "who here has Nekoweb",
    "Happy " + day + "!",
    "Assalamualaikum Brothers...",
    "Who up nekoing they web rn",
    "In the Nekoweb",
    "Strait up Webbing it",
    "hehe",
    "Lets justr say, my websait",
    "i am not good",
    "please sleep",
    "erm.. what the web",
    "one day i will sleep on time",
    "TODAY IS THE DAY",
    "I am the bone of my sword",
    "and I, am SHIROU FUCKING EMIYA",
    "i fuckin love fate",
    "arcuied my beloved, saber my beloved",
    "My tummy hurts",
    "I dont even like minecraft",
    "BREAKING NEWS: i erm, i forgor...",
    "I don't know",
    "Listen to susumu hirasawa",
    "10 seconds ago is crazy",
    "Now on atabook :3",
    "tagging my line rn",
    "New project mouthwash vid :D",
    "Got the FLACs flaccing",
    "The FLACs are now mp4s",
    "I may or may not have forgotten about this",
    "Hakunon My Beloved",
  ];
  var randomIndex = Math.floor(Math.random() * taglines.length);
  document.getElementById("tagline").innerHTML = taglines[randomIndex];
};

// also edited from max's https://webring.nekoweb.org/onionring-widget.js

// === ONIONRING-WIDGET ===
//Changing graphics cuz they look cooler

var tag = document.getElementById(ringID); // Find the widget on the page

var thisSite = window.location.href; // Get the URL of the site we're currently on
var thisIndex = null; // Initialize thisIndex

// Go through the site list to see if this site is on it and find its position
for (var i = 0; i < sites.length; i++) {
  if (thisSite.startsWith(sites[i][0])) {
    // We use startsWith so this will match any subdirectory; users can put the widget on multiple pages
    thisIndex = i;
    break; // When we've found the site, we don't need to search anymore, so stop the loop
  }
}

// Go through the extras list to see if this site is on it, and find what website it is an extra for
for (i = 0; i < extras.length; i++) {
  if (thisSite.startsWith(extras[i][0])) {
    for (var s = 0; s < sites.length; s++) {
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
  var otherSites = sites.slice(); // Create a copy of the sites list
  otherSites.splice(thisIndex, 1); // Remove the current site so we don't just land on it again
  var randomIndex = Math.floor(Math.random() * otherSites.length);
  location.href = otherSites[randomIndex][0];
}

// If we didn't find the site in the list, the widget displays a warning instead
if (thisIndex == null) {
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
  var previousIndex = thisIndex - 1 < 0 ? sites.length - 1 : thisIndex - 1;
  var nextIndex = thisIndex + 1 >= sites.length ? 0 : thisIndex + 1;

  var indexText = "";
  // If you've chosen to include an index, this builds the link to that
  if (useIndex) {
    indexText = `<a href='${indexPage}'>`;
  }

  var randomText = "";
  // If you've chosen to include a random button, this builds the link that does that
  if (useRandom) {
    randomText = `<span onclick='randomSite()'><img src="images/Nekowebring/cat.png" alt="Random Site"></span>`;
  }

  // This is the code that displays the widget - EDIT THIS if you want to change the structure
  tag.insertAdjacentHTML(
    "afterbegin",
    `
  <table>
    <tr>
      <td class='webring-prev'><a href='${sites[previousIndex][0]}'><img src="images/Nekowebring/prev.png" alt="Previous Site"></a></td>
      <td style="text-align: center;" class='webring-info'>${indexText}<img src="images/Nekowebring/nekowebring.png" alt="NekoWebRing Index"></a></br>
      <span class='webring-links'>
        ${randomText}
      <td class='webring-next'><a href='${sites[nextIndex][0]}'><img src="images/Nekowebring/next.png" alt="Next Site"></a></td>
    </tr>
  </table>
  `
  );
}
