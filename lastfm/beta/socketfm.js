/* global users */
/* exported online */

// Constants
const BASE_URL = "wss://scrobbled.tepiloxtl.net/ws-bleeding/get_last_track/";

// Variables
var notPlaying = 0;
var online = 0;

// WebSocket connection function
const connectWebSocket = (username, site) => {
  const url = `${BASE_URL}${username}`;
  const socket = new WebSocket(url);

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const track = data.recenttracks.track[0];

    // Check user's online status
    const userOnline = track.nowplaying === "true";

    // Create or update user div
    updateUserDiv(username, site, track, userOnline);
    let onlineCounter = document.getElementById("counter");
    onlineCounter.textContent = online;
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
};

// Function to create or update user div based on online status
const updateUserDiv = (username, site, track, userOnline) => {
  const userDiv = document.getElementById(username);
  const offlineDiv = document.getElementById("offline");
  const scrobblingDiv = document.getElementById("scrobbling");

  if (userDiv) {
    userDiv.parentNode.removeChild(userDiv);
  }
  var coverImgUrl = track.image[2]["#text"];
  if (track.album.isnsfw == true) {
    if (localStorage.nsfw == "off") {
      coverImgUrl = track.image[2]["#text"];
    } else if (localStorage.nsfw == "blurred") {
      setTimeout(() => {
        document.getElementById(`${username}-trackCover`).style.filter =
          "blur(10px)";
      }, 1);
    } else if (localStorage.nsfw == "removed") {
      coverImgUrl = null;
    } else {
      coverImgUrl = null; // Ensure any other values also nullify the cover image.
    }
  } else {
    coverImgUrl = track.image[2]["#text"];
  }

  const newUserDiv = document.createElement("div");
  newUserDiv.id = username;
  newUserDiv.className = "container";
  newUserDiv.innerHTML = `
      <div id="${username}-songBox" class="listening">
        <img id="${username}-trackCover" class="trackCover" src="${coverImgUrl || "/images/NoArt.jpg"}" alt="">
        <div id="${username}-trackInfo" class="trackInfo">
          <h3 id="${username}-siteName" class="siteName"><a href="https://last.fm/user/${username}" target="_blank">${username}</a> • <a href="https://${site}" target="_blank">${site}</a></h3>
          <h2 id="${username}-trackName" class="trackName">${track.name}</h2>
          <p id="${username}-artistName" class="artistName">${track.artist.name}</p>
          <a id="${username}-searchButton" class="searchButton" href="https://www.google.com/search?q=${encodeURIComponent(track.name)}+${encodeURIComponent(track.artist.name)}" target="_blank"> Search Song</a>
        </div>
      </div>
  `;

  if (userOnline) {
    online++;
    scrobblingDiv.appendChild(newUserDiv);
  } else {
    notPlaying++;
    offlineDiv.appendChild(newUserDiv);

    if (notPlaying === users.length) {
      scrobblingDiv.innerHTML =
        "<p>No one's listening to anything right now</p>";
    } else {
      const pTag = scrobblingDiv.querySelector("p");
      if (pTag) {
        pTag.remove();
      }
    }
  }

  // Adjust font sizes if necessary
  adjustFontSizes(
    newUserDiv.querySelector(".trackInfo"),
    newUserDiv.querySelector(".listening"),
  );
};

// Function to adjust font sizes based on container dimensions
const adjustFontSizes = (trackInfoElement, songBox) => {
  const trackNameElement = trackInfoElement.querySelector(".trackName");
  const artistNameElement = trackInfoElement.querySelector(".artistName");

  if (
    trackInfoElement.offsetHeight > songBox.offsetHeight ||
    trackInfoElement.offsetWidth > songBox.offsetWidth
  ) {
    trackNameElement.style.fontSize = "60%";
    artistNameElement.style.fontSize = "60%";
  }
};

// Function to handle fallback cover image
// const fallbackCover = (track) => {
//   let coverImageUrl = track.image[2]["#text"];
//   if (
//     coverImageUrl ===
//     "https://lastfm.freetls.fastly.net/i/u/2a96cbd8b46e442fc41c2b86b821562f.png"
//   ) {
//     const musicBrainzEndpoint = `https://musicbrainz.org/ws/2/release-group/?query=artist:${encodeURIComponent(track.artist.name)} AND release:${encodeURIComponent(track.album.name)}&fmt=json`;

//     fetch(musicBrainzEndpoint, {
//       headers: {
//         "User-Agent": "NekoFM/1.0 (https://lel.nekoweb.org/lastfm/)",
//       },
//     })
//       .then((response) => response.json())
//       .then((json) => {
//         if (json.release_groups.length > 0) {
//           const coverArtUrl =
//             json.release_groups[0].covers.coverart.length > 0
//               ? json.release_groups[0].covers.coverart[0].file
//               : "https://lastfm.freetls.fastly.net/i/u/2a96cbd8b46e442fc41c2b86b821562f.png";
//           coverImageUrl = coverArtUrl;
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching track info:", error);
//       });
//   }
// };

// Initialize WebSocket connections for each user

// function convert(seconds) {
//   const min = Math.floor(seconds / 60);
//   const sec = seconds % 60;
//   return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
// }
// function listenedSoFar(json, artistName, trackName, userDiv) {
//   const trackInfoUrl = `https://scrobbled.tepiloxtl.net/rest/get_track_info?artist=${artistName}&track=${trackName}`;
//   const alternativeTrackInfoUrl = `https://scrobbled.tepiloxtl.net/rest/get_track_info?mbid=${json.recenttracks.track[0].mbid}`;

//   fetch(trackInfoUrl)
//     .then((response) => response.json())
//     .then((songDetails) => {
//       let lastfmUts = json.recenttracks.track[1].date.uts;
//       const duration = songDetails.track.duration;
//       const length = convert(parseInt(duration) / 1000);
//       const listened = Math.floor(Date.now() / 1000) - parseInt(lastfmUts);

//       let intervalId = setInterval(() => {
//         const currentListened =
//           Math.floor(Date.now() / 1000) - parseInt(lastfmUts);
//         let trackInfo = userDiv.querySelector(".trackInfo");
//         let pTag = trackInfo.querySelector("p");
//         if (pTag) {
//           pTag.textContent = `Time listened: ${convert(currentListened)}/${length}`;
//         } else {
//           let pTag = document.createElement("p");
//           pTag.textContent = `Time listened: ${convert(currentListened)}/${length}`;
//           trackInfo.appendChild(pTag);
//         }
//       }, 1000);

//       setTimeout(
//         () => {
//           clearInterval(intervalId);
//         },
//         (parseInt(duration) - listened) * 1000,
//       );
//     })
//     .catch((error) => {
//       console.error("Error fetching track info:", error);
//     });
// }

users.forEach(([username, site]) => {
  connectWebSocket(username, site);
});
