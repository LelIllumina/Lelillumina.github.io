import { users } from "./users.js";

// Constants
const BASE_URL = "wss://scrobbled.tepiloxtl.net/ws/get_last_track/";
let notPlaying = 0;
const userArray = document.createDocumentFragment();

// Set total counter
const totalCounter = document.getElementById("total");
totalCounter.textContent = users.length;

// Connect WebSocket
const connectWebSocket = (username) => {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${username}`;
    const socket = new WebSocket(url);

    socket.onopen = () => resolve(socket);
    socket.onmessage = (event) => handleWebSocketMessage(username, event);
    socket.onerror = (error) => reject(error);
  });
};

// Handle WebSocket message
function handleWebSocketMessage(username, event) {
  const data = JSON.parse(event.data);
  const track = data.recenttracks.track[0];
  const userOnline = track.nowplaying === "true";

  hydrateDiv(username, track, userOnline);
  updateOnlineCounter();
}

// Update the online user counter
function updateOnlineCounter() {
  const onlineCounter = document.getElementById("counter");
  const scrobbling = document.getElementById("scrobbling");
  const online = scrobbling.querySelectorAll(".container").length;
  onlineCounter.textContent = online;
}

// Create a new div for a user
function createEmptyDiv(username, site) {
  const fragment = createUserFragment(username, site);
  userArray.append(fragment);
}

// Create a user fragment
function createUserFragment(username, site) {
  const fragment = document.createDocumentFragment();
  const newUserDiv = document.createElement("div");
  newUserDiv.id = username;
  newUserDiv.className = "container";
  newUserDiv.innerHTML = /* HTML */ `
    <div class="listening" id="${username}-songBox">
      <img
        class="trackCover"
        id="${username}-trackCover"
        src="/images/NekoFM/loading.png"
        alt=""
        height="150"
        width="150"
      />
      <div class="trackInfo" id="${username}-trackInfo">
        <h3 class="siteName" id="${username}-siteName">
          <a href="https://last.fm/user/${username}" target="_blank"
            >${username}</a
          >
          • <a href="https://${site}" target="_blank">${site}</a>
        </h3>
        <h2 class="trackName" id="${username}-trackName">Loading...</h2>
        <p class="artistName" id="${username}-artistName">Loading...</p>
        <a
          class="searchButton"
          id="${username}-searchButton"
          href=""
          target="_blank"
          >Search Song</a
        >
      </div>
    </div>
  `;
  fragment.append(newUserDiv);
  return fragment;
}

// Update a user's div with track details
function hydrateDiv(username, track, userOnline) {
  const userDiv = document.getElementById(username);
  const scrobbling = document.getElementById("scrobbling");
  const offline = document.getElementById("offline");

  const coverImgUrl = getCoverImage(track, username);

  updateTrackDetails(userDiv, track, coverImgUrl);

  if (userOnline) {
    moveUserToScrobbling(userDiv, scrobbling);
  } else {
    moveUserToOffline(userDiv, offline);
  }

  updateScrobblingStatus();
}

// Get cover image URL with NSFW filtering
function getCoverImage(track, username) {
  const isNsfw = track.album.isnsfw;
  let coverImgUrl = isNsfw
    ? nsfwFilter(track, username)
    : track.image[2]["#text"];

  if (
    coverImgUrl ===
    "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png"
  ) {
    coverImgUrl = "/images/NekoFM/NoArt.svg";
  }
  return coverImgUrl || "/images/NekoFM/NoArt.svg";
}

// Update track details in a user div
function updateTrackDetails(userDiv, track, coverImgUrl) {
  const coverImgEl = userDiv.querySelector(`#${userDiv.id}-trackCover`);
  const trackNameEl = userDiv.querySelector(`#${userDiv.id}-trackName`);
  const artistNameEl = userDiv.querySelector(`#${userDiv.id}-artistName`);

  coverImgEl.src = coverImgUrl;
  coverImgEl.alt = track.name;
  trackNameEl.textContent = track.name;
  artistNameEl.textContent = track.artist.name;
}

// Move user to scrobbling section
function moveUserToScrobbling(userDiv, scrobbling) {
  scrobbling.append(userDiv);
}

// Move user to offline section
function moveUserToOffline(userDiv, offline) {
  offline.append(userDiv);
  notPlaying++;
}

// Update the status of the scrobbling section
function updateScrobblingStatus() {
  const scrobbling = document.getElementById("scrobbling");

  if (notPlaying === users.length) {
    scrobbling.innerHTML =
      "<p id='noUsers'>No one's listening to anything right now</p>";
  } else {
    const noUsers = document.getElementById("noUsers");
    if (noUsers) {
      noUsers.remove();
    }
  }
}

// Apply NSFW filter
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
    default:
      return "/images/NekoFM/NSFWCOVER.png";
  }
}

// Setup WebSocket connections for all users
async function setupWebSocketConnections(users) {
  try {
    createUserDivs(users);

    const connections = await Promise.all(
      users.map(([username]) => connectWebSocket(username)),
    );

    console.log("All WebSocket connections established:", connections);
  } catch (error) {
    console.error("Error connecting to WebSockets:", error);
  }
}

// Create divs for all users
function createUserDivs(users) {
  for (const [username, site] of users) {
    createEmptyDiv(username, site);
  }
  const loadingDiv = document.getElementById("loading");
  loadingDiv.append(userArray);
}

// Initialize
setupWebSocketConnections(users);
