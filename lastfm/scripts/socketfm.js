/* global users */
/* exported notPlaying */
// Constants
const BASE_URL = "wss://scrobbled.tepiloxtl.net/ws/get_last_track/";
let notPlaying = 0;

const totalCounter = document.getElementById("total");
totalCounter.textContent = users.length;

// WebSocket connection function
const connectWebSocket = (username) => {
  return new Promise(function (resolve, reject) {
    const url = `${BASE_URL}${username}`;
    const socket = new WebSocket(url);

    socket.onopen = function () {
      resolve(socket);
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const track = data.recenttracks.track[0];

      // Check user's online status
      const userOnline = track.nowplaying === "true";

      hydrateDiv(username, track, userOnline);

      // Create or update user div
      // updateUserDiv(username, site, track, userOnline);
      const onlineCounter = document.getElementById("counter");
      const scrobbling = document.getElementById("scrobbling");
      const online = scrobbling.querySelectorAll(".container").length;
      onlineCounter.textContent = online;
    };

    socket.onerror = function (error) {
      reject(error);
    };
  });
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
      <img id="${username}-trackCover" class="trackCover" src="/images/NekoFM/NoArt.png" alt="">
      <div id="${username}-trackInfo" class="trackInfo">
        <h3 id="${username}-siteName" class="siteName"><a href="https://last.fm/user/${username}" target="_blank">${username}</a> • <a href="https://${site}" target="_blank">${site}</a></h3>
        <h2 id="${username}-trackName" class="trackName">Track Name</h2>
        <p id="${username}-artistName" class="artistName">Artist Name</p>
        <a id="${username}-searchButton" class="searchButton" href="" target="_blank"> Search Song</a>
      </div>
    </div>
`;
  fragment.appendChild(newUserDiv);
  loadingDiv.appendChild(fragment);
}

// Hydrate Empty Divs
function hydrateDiv(username, track, userOnline) {
  // Set userDiv and default cover image
  const scrobbling = document.getElementById("scrobbling");
  const offline = document.getElementById("offline");
  const userDiv = document.getElementById(username);
  let coverImgUrl = track.album.isnsfw
    ? nsfwFilter(track, username)
    : track.image[2]["#text"];

  if (
    coverImgUrl ===
    "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png"
  ) {
    coverImgUrl = "/images/NekoFM/NoArt.png";
  }

  // Track elements
  const coverImgEl = userDiv.querySelector(`#${username}-trackCover`);
  const trackNameEl = userDiv.querySelector(`#${username}-trackName`);
  const artistNameEl = userDiv.querySelector(`#${username}-artistName`);

  coverImgEl.src = coverImgUrl ? coverImgUrl : "/images/NekoFM/NoArt.png";
  trackNameEl.textContent = track.name;
  artistNameEl.textContent = track.artist.name;

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
      return "/images/NekoFM/NSFWCOVER.png";
  }
}

async function setupWebSocketConnections(users) {
  try {
    // Create the divs for each user first
    await users.forEach(([username, site]) => {
      createEmptyDiv(username, site);
    });

    // Connect to all WebSocket connections in parallel
    const connections = await Promise.all(
      users.map(([username]) => connectWebSocket(username))
    );

    console.log("All WebSocket connections established:", connections);
  } catch (error) {
    console.error("Error connecting to WebSockets:", error);
  }
}

setupWebSocketConnections(users);
