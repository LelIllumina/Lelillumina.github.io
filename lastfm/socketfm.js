// WebSocket API (scrobbled) by tepiloxtl

var notPlaying = 0;
const getTrack = (username, site) => {
  const BASE_URL = `wss://scrobbled.tepiloxtl.net/ws/get_last_track/${username}`;
  const ws = new WebSocket(BASE_URL);

  // ws.onopen = () => {
  //   console.log("WebSocket connection opened");
  // };

  ws.onmessage = (event) => {
    const json = JSON.parse(event.data);
    // console.log("Received JSON data for", username, json);

    let existingDiv = document.getElementById(`${username}-listening`);
    // let offlineDiv = document.getElementById("offline");

    // Set placeholder CoverImage if it dosent exist
    let coverImageUrl = json.recenttracks.track[0].image[2]["#text"];
    if (!coverImageUrl || coverImageUrl === "") {
      coverImageUrl = "/images/NoArt.jpg";
    }

    // Check if user is scrobbling
    if (json["recenttracks"]["track"][0].hasOwnProperty("@attr")) {
      if (existingDiv) {
        // Update the existing div
        existingDiv.querySelector(".trackCover").src = coverImageUrl;
        existingDiv.querySelector(".trackName").textContent =
          json.recenttracks.track[0].name;
        existingDiv.querySelector(".artistName").textContent =
          json.recenttracks.track[0].artist.name;
        existingDiv.querySelector(
          ".searchButton"
        ).href = `https://www.google.com/search?q=${json.recenttracks.track[0].name}+${json.recenttracks.track[0].artist.name}`;
      } else {
        // Create new div for user
        document.getElementById("scrobbling").innerHTML += `
        <div id="${username}-listening" class="listening">
        <img id="${username}-trackCover" class="trackCover" src="${coverImageUrl}">
        <div id="${username}-trackInfo" class="trackInfo">
        <h3><a href="https://last.fm/user/${username}" target="_blank">${username}</a> • <a href="https://${site}" target="_blank">${site}</a></h3>
        <h2 id="${username}-trackName" class="trackName">${json.recenttracks.track[0].name}</h2>
        <p id="${username}-artistName" class="artistName">${json.recenttracks.track[0].artist.name}</p>
        <a id="${username}-searchButton" class="searchButton" href="https://www.google.com/search?q=${json.recenttracks.track[0].name}+${json.recenttracks.track[0].artist.name}" target="_blank"> Search Song</a>
        </div>
        </div>
        `;
        // TODO move user div from offline section if they come online and vice versa
        // if (offlineDiv.querySelector(`#${username}-listening`)) {
        //   offlineDiv.querySelector(`#${username}-listening`).remove();
        // }
      }
      return;
    } else {
      // Check if everyone is offline and display notice
      notPlaying++;
      if (notPlaying == users.length) {
        document.getElementById("scrobbling").innerHTML =
          "<p>No one's listening to anything right now</p>";
      }
      // Create new div for offline user
      document.getElementById("offline").innerHTML += `
             <div id="${username}-listening" class="listening">
            <img id="${username}-trackCover" class="trackCover" src="${coverImageUrl}">
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
