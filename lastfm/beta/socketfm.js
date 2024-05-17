/* global users */
// WebSocket API (scrobbled) by tepiloxtl

var notPlaying = 0;
var userOnline;
const getTrack = (username, site) => {
  const BASE_URL = `wss://scrobbled.tepiloxtl.net/ws-bleeding/get_last_track/${username}`;
  const ws = new WebSocket(BASE_URL);

  // ws.onopen = () => {
  //   console.log("WebSocket connection opened");
  // };

  ws.onmessage = (event) => {
    const json = JSON.parse(event.data);
    // console.log("Received JSON data for", username, json);

    // Check if user is online or offline
    if (json.recenttracks.track[0].nowplaying == "true") {
      userOnline = true; // User is online
    } else {
      userOnline = false; // User is offline
    }

    // Move divs between offline and scrobbling sections
    let offlineDiv = document.getElementById("offline");
    let scrobblingDiv = document.getElementById("scrobbling");
    let userDiv = document.getElementById(`${username}`);

    // Remove user div from any existing location
    if (userDiv) {
      if (offlineDiv.contains(userDiv)) {
        offlineDiv.removeChild(userDiv);
      }
      if (scrobblingDiv.contains(userDiv)) {
        scrobblingDiv.removeChild(userDiv);
      }
    }

    // Create or update user div
    if (!userDiv) {
      userDiv = document.createElement("div");
      userDiv.id = `${username}`;
      userDiv.className = "container";
      userDiv.innerHTML = `
      <div id="${username}-songBox" class="listening">
        <img id="${username}-trackCover" class="trackCover" src="" alt="">
        <div id="${username}-trackInfo" class="trackInfo">
          <h3><a href="https://last.fm/user/${username}" target="_blank">${username}</a> • <a href="https://${site}" target="_blank">${site}</a></h3>
          <h2 id="${username}-trackName" class="trackName"></h2>
          <p id="${username}-artistName" class="artistName"></p>
          <a id="${username}-searchButton" class="searchButton" href="" target="_blank"> Search Song</a>
        </div>
        </div>
      `;
    }

    // Set placeholder CoverImage if it doesn't exist
    let coverImageUrl = json.recenttracks.track[0].image[2]["#text"];
    if (!coverImageUrl || coverImageUrl === "") {
      coverImageUrl = "/images/NoArt.jpg";
    }

    if (userOnline) {
      // Update the existing div
      userDiv.querySelector(".trackCover").src = coverImageUrl;
      userDiv.querySelector(".trackName").textContent =
        json.recenttracks.track[0].name;
      userDiv.querySelector(".artistName").textContent =
        json.recenttracks.track[0].artist.name;
      userDiv.querySelector(".searchButton").href =
        `https://www.google.com/search?q=${encodeURIComponent(json.recenttracks.track[0].name)}+${encodeURIComponent(json.recenttracks.track[0].artist.name)}`;
      scrobblingDiv.appendChild(userDiv);
    } else {
      notPlaying++;
      userDiv.querySelector(".trackCover").src = coverImageUrl;
      userDiv.querySelector(".trackName").textContent =
        json.recenttracks.track[0].name;
      userDiv.querySelector(".artistName").textContent =
        json.recenttracks.track[0].artist.name;
      userDiv.querySelector(".searchButton").href =
        `https://www.google.com/search?q=${encodeURIComponent(json.recenttracks.track[0].name)}+${encodeURIComponent(json.recenttracks.track[0].artist.name)}`;
      offlineDiv.appendChild(userDiv);

      // Check if everyone is offline and display notice
      document.addEventListener("DOMContentLoaded", () => {
        if (notPlaying === users.length) {
          scrobblingDiv.innerHTML =
            "<p>No one's listening to anything right now</p>";
        } else {
          const pTag = scrobblingDiv.querySelector("p");
          if (pTag) {
            pTag.remove();
          }
        }
      });
    }
    // Get the track info element by its id
    const trackInfoElement = userDiv.querySelector(".trackInfo");
    const songBox = userDiv.querySelector(".listening");
    const trackNameElement = userDiv.querySelector(".trackName");
    const artistNameElement = userDiv.querySelector(".artistName");

    if (trackInfoElement.offsetHeight > songBox.offsetHeight) {
      trackNameElement.style.fontSize = "60%";
      artistNameElement.style.fontSize = "60%";
    }
    if (trackInfoElement.offsetWidth > songBox.offsetWidth) {
      trackNameElement.style.fontSize = "60%";
      artistNameElement.style.fontSize = "60%";
    }

    // TODO add musicbrainz as backup covert art provider
    // if (
    //   coverImageUrl ==
    //   "https://lastfm.freetls.fastly.net/i/u/2a96cbd8b46e442fc41c2b86b821562f.png"
    // ) {
    // const musicBrainzEndpoint = `https://musicbrainz.org/ws/2/release-group/?query=artist:${encodeURIComponent(
    //   json.recenttracks.track[0].artist.name,
    // )} AND release:${encodeURIComponent(json.recenttracks.track[0].album.name)}&fmt=json`;

    // fetch(musicBrainzEndpoint, {
    //   headers: {
    //     "User-Agent": "NekoFM/1.0 (https://lel.nekoweb.org/lastfm/)",
    //   },
    // }).then((response) => {
    //   const jsonBrainz = response.json();

    //   console.log(jsonBrainz);
    // });
    // }
  };
  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  // ws.onclose = () => {
  //   console.log("WebSocket connection closed");
  // };
};

// Get LastFM username and Nekoweb URL
users.forEach((user) => {
  const username = user[0];
  const site = user[1];
  getTrack(username, site);
});
