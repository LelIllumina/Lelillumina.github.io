/* global users */
/* exported notPlaying */
// Constants
const BASE_URL = "wss://scrobbled.tepiloxtl.net/ws/get_last_track/";
var notPlaying = 0;

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

      let onlineCounter = document.getElementById("counter");
      var scrobbling = document.getElementById("scrobbling");
      var online = scrobbling.querySelectorAll(".container").length;
      onlineCounter.textContent = online;
    };

    socket.onerror = function (error) {
      reject(error);
    };

    // Handle WebSocket close event
    socket.onclose = function () {
      console.log(`${username}'s WebSocket connection closed.`);
    };
  });
};

// Create Empty divs
function createEmptyDiv(username, site) {
  const loadingDiv = document.getElementById("loading");
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
  loadingDiv.appendChild(newUserDiv);
}

// Hydrate Empty Divs
function hydrateDiv(username, track, userOnline) {
  const scrobbling = document.getElementById("scrobbling");
  const offline = document.getElementById("offline");
  const userDiv = document.getElementById(username);

  if (!userDiv) return; // Check if the div exists

  var coverImgUrl = track.album.isnsfw
    ? nsfwFilter(track, username)
    : track.image[2]["#text"];

  if (
    coverImgUrl ===
    "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png"
  ) {
    coverImgUrl = "/images/NekoFM/NoArt.png";
  }

  const trackNameEl = userDiv.querySelector(`#${username}-trackName`);
  const artistNameEl = userDiv.querySelector(`#${username}-artistName`);
  const coverImgEl = userDiv.querySelector(`#${username}-trackCover`);

  trackNameEl.textContent = track.name;
  artistNameEl.textContent = track.artist.name;

  if (coverImgEl.src !== coverImgUrl) {
    coverImgEl.src = coverImgUrl ? coverImgUrl : "/images/NekoFM/NoArt.png";
  }

  if (userOnline) {
    scrobbling.appendChild(userDiv);
  } else {
    offline.appendChild(userDiv);
    notPlaying++;
  }

  // Update UI if nobody is scrobbling
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
    // Reset notPlaying counter
    notPlaying = 0;

    // Create the divs for each user first (using for...of to handle async properly)
    for (const [username, site] of users) {
      await createEmptyDiv(username, site);
    }

    // Connect to all WebSocket connections in parallel
    const connections = await Promise.all(
      users.map(([username]) => connectWebSocket(username))
    );

    console.log("All WebSocket connections established:", connections);
  } catch (error) {
    console.error("Error connecting to WebSockets:", error);
  }
}

// Start WebSocket connections for users
setupWebSocketConnections(users);
