/* global users */
/* exported notPlaying */

// TODO after optimization, pre make all siteboxs and then update them when you recieve data

// Constants
const BASE_URL = "wss://scrobbled.tepiloxtl.net/ws/get_last_track/";
var notPlaying = 0;

// WebSocket connection function
const connectWebSocket = (username) => {
  const url = `${BASE_URL}${username}`;
  const socket = new WebSocket(url);

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const track = data.recenttracks.track[0];

    // Check user's online status
    const userOnline = track.nowplaying === "true";

    hydrateDiv(username, track, userOnline);

    // Create or update user div
    // updateUserDiv(username, site, track, userOnline);
    let onlineCounter = document.getElementById("counter");
    var scrobbling = document.getElementById("scrobbling");
    var online = scrobbling.querySelectorAll(".container").length;
    onlineCounter.textContent = online;
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
};

// Create Empty divs
function createEmptyDiv(username, site) {
  const loadingDiv = document.getElementById("loading");
  const fragment = document.createDocumentFragment();
  const newUserDiv = document.createElement("div");
  newUserDiv.id = username;
  newUserDiv.className = "container";
  newUserDiv.innerHTML = `
    <div id="${username}-songBox" class="listening">
      <img id="${username}-trackCover" class="trackCover" src="/images/NekoFM/NoArt.jpg" alt="">
      <div id="${username}-trackInfo" class="trackInfo">
        <h3 id="${username}-siteName" class="siteName"><a href="https://last.fm/user/${username}" target="_blank">${username}</a> • <a href="https://${site}" target="_blank">${site}</a></h3>
        <h2 id="${username}-trackName" class="trackName">Track Name</h2>
        <p id="${username}-artistName" class="artistName">Artist Name</p>
        <a id="${username}-searchButton" class="searchButton" href="" target="_blank"> Search Song</a>
      </div>
    </div>
`;
  fragment.appendChild(newUserDiv);
  loadingDiv.appendChild(newUserDiv);
}

// Hydrate Empty Divs
function hydrateDiv(username, track, userOnline) {
  // Set userDiv and default cover image
  var scrobbling = document.getElementById("scrobbling");
  var offline = document.getElementById("offline");
  const userDiv = document.getElementById(username);
  if (track.album.isnsfw === true) {
    var coverImgUrl = nsfwFilter(track, username);
  } else {
    coverImgUrl = track.image[2]["#text"];
  }

  // Track elements
  const trackNameEl = userDiv.querySelector(`#${username}-trackName`);
  const artistNameEl = userDiv.querySelector(`#${username}-artistName`);
  const coverImgEl = userDiv.querySelector(`#${username}-trackCover`);

  trackNameEl.textContent = track.name;
  artistNameEl.textContent = track.artist.name;
  coverImgEl.src = coverImgUrl;

  if (userOnline) {
    scrobbling.appendChild(userDiv);
  } else {
    offline.appendChild(userDiv);
    notPlaying++;
  }
  if (notPlaying === users.length) {
    scrobbling.innerHTML = "<p>No one's listening to anything right now</p>";
  } else {
    const pTag = scrobbling.querySelector("p");
    if (pTag) {
      pTag.remove();
    }
  }
}
// NSFW Filter according to localStorage
function nsfwFilter(track, username) {
  const nsfwSetting = localStorage.nsfw;
  const defaultCoverImg = track.image[2]["#text"];
  const trackCover = document.getElementById(`${username}-trackCover`);

  switch (nsfwSetting) {
    case "off":
      return defaultCoverImg;
    case "blurred":
      setTimeout(() => {
        trackCover.style.filter = "blur(10px)";
      }, 1);
      return defaultCoverImg;
    case "removed":
    default:
      return null;
  }
}

users.forEach(([username, site]) => {
  createEmptyDiv(username, site);
  connectWebSocket(username);
});
