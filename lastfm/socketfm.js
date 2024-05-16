/* global users */
// WebSocket API (scrobbled) by tepiloxtl

var notPlaying = 0;
var userOnline;
const getTrack = (username, site) => {
  const BASE_URL = `wss://scrobbled.tepiloxtl.net/ws/get_last_track/${username}`;
  const ws = new WebSocket(BASE_URL);

  // ws.onopen = () => {
  //   console.log("WebSocket connection opened");
  // };

  ws.onmessage = (event) => {
    const json = JSON.parse(event.data);
    // console.log("Received JSON data for", username, json);

    // Check if user is online or offline
    if (
      Object.prototype.hasOwnProperty.call(json.recenttracks.track[0], "@attr")
    ) {
      userOnline = true; // User is online
    } else {
      userOnline = false; // User is offline
    }

    // Move divs between offline and scrobbling sections
    if (userOnline) {
      // Move user from offline to scrobbling
      const offlineDiv = document.getElementById("offline");
      const scrobblingDiv = document.getElementById("scrobbling");
      const userDiv = offlineDiv.querySelector(`#${username}`);
      if (userDiv) {
        offlineDiv.removeChild(userDiv);
        scrobblingDiv.appendChild(userDiv);
      }
    } else {
      // Move user from scrobbling to offline
      const scrobblingDiv = document.getElementById("scrobbling");
      const offlineDiv = document.getElementById("offline");
      const userDiv = scrobblingDiv.querySelector(`#${username}`);
      if (userDiv) {
        scrobblingDiv.removeChild(userDiv);
        offlineDiv.appendChild(userDiv);
      }
    }

    let userDiv = document.getElementById(`${username}`);

    // Set placeholder CoverImage if it dosent exist
    let coverImageUrl = json.recenttracks.track[0].image[2]["#text"];
    if (!coverImageUrl || coverImageUrl === "") {
      coverImageUrl = "/images/NoArt.jpg";
    }

    // Check if user is scrobbling
    if (
      Object.prototype.hasOwnProperty.call(json.recenttracks.track[0], "@attr")
    ) {
      if (userDiv) {
        // Get current values
        const currentTrackName =
          userDiv.querySelector(".trackName").textContent;
        const currentArtistName =
          userDiv.querySelector(".artistName").textContent;
        const currentCoverImageUrl = userDiv.querySelector(".trackCover").src;

        // Check if values are different
        if (
          currentTrackName !== json.recenttracks.track[0].name ||
          currentArtistName !== json.recenttracks.track[0].artist.name ||
          currentCoverImageUrl !== coverImageUrl
        ) {
          // Update the existing div
          userDiv.querySelector(".trackCover").src = coverImageUrl;
          userDiv.querySelector(".trackName").textContent =
            json.recenttracks.track[0].name;
          userDiv.querySelector(".artistName").textContent =
            json.recenttracks.track[0].artist.name;
          userDiv.querySelector(".searchButton").href =
            `https://www.google.com/search?q=${json.recenttracks.track[0].name}+${json.recenttracks.track[0].artist.name}`;
        }
      } else {
        // Create new div for user
        document.getElementById("scrobbling").innerHTML += `
        <div id="${username}" class="listening">
        <img id="${username}-trackCover" class="trackCover" src="${coverImageUrl}" alt="${json.recenttracks.track[0].album["#text"]}">
        <div id="${username}-trackInfo" class="trackInfo">
        <h3><a href="https://last.fm/user/${username}" target="_blank">${username}</a> • <a href="https://${site}" target="_blank">${site}</a></h3>
        <h2 id="${username}-trackName" class="trackName">${json.recenttracks.track[0].name}</h2>
        <p id="${username}-artistName" class="artistName">${json.recenttracks.track[0].artist.name}</p>
        <a id="${username}-searchButton" class="searchButton" href="https://www.google.com/search?q=${json.recenttracks.track[0].name}+${json.recenttracks.track[0].artist.name}" target="_blank"> Search Song</a>
        </div>
        </div>
        `;
      }
      return;
    } else {
      // Check if everyone is offline and display notice
      notPlaying++;
      document.addEventListener("DOMContentLoaded", () => {
        if (notPlaying == users.length) {
          document.getElementById("scrobbling").innerHTML =
            "<p>No one's listening to anything right now</p>";
        } else {
          // Remove the "No one's listening to anything right now" message if it's not needed
          const pTag = document.getElementById("scrobbling").querySelector("p");
          if (pTag) {
            pTag.remove();
          }
        }
      });
      // Create new div for offline user
      document.getElementById("offline").innerHTML += `
             <div id="${username}" class="listening">
            <img id="${username}-trackCover" class="trackCover" src="${coverImageUrl}" alt="${json.recenttracks.track[0].album["#text"]}">
            <div id="${username}-trackInfo" class="trackInfo">
            <h3><a href="https://last.fm/user/${username}" target="_blank">${username}</a> • <a href="https://${site}" target="_blank">${site}</a></h3>
            <h2 id="${username}-trackName" class="trackName">${json.recenttracks.track[0].name}</h2>
            <p id="${username}-artistName" class="artistName">${json.recenttracks.track[0].artist.name}</p>
            <a id="${username}-searchButton" class="searchButton" href="https://www.google.com/search?q=${json.recenttracks.track[0].name}+${json.recenttracks.track[0].artist.name}" target="_blank"> Search Song</a>
            </div>
            </div>
    `;
      return;
    }
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
