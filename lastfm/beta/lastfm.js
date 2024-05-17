/* global users */

// this script is under the MIT license (https://max.nekoweb.org/resources/license.txt)

var notPlaying = 0;
const getTrack = async (username, site) => {
  const BASE_URL = `https://lastfm-last-played.biancarosa.com.br/${username}/latest-song`;
  const request = await fetch(BASE_URL);
  const json = await request.json();

  let isPlaying = json.track["@attr"]?.nowplaying || false;

  let coverImageUrl = json.track.image[3]["#text"];
  if (!coverImageUrl || coverImageUrl === "") {
    coverImageUrl = "/images/NoArt.jpg";
  }

  if (!isPlaying) {
    notPlaying++;
    if (notPlaying == users.length) {
      document.getElementById("scrobbling").innerHTML =
        "<p>No one's listening to anything right now</p>";
    }
    document.getElementById("offline").innerHTML += `
            <div id="${username}-listening" class="listening">
            <img id="${username}-trackCover" class="trackCover" src="${coverImageUrl}">
            <div id="${username}-trackInfo" class="trackInfo">
            <h3><a href="https://last.fm/user/${username}" target="_blank">${username}</a> • <a href="https://${site}" target="_blank">${site}</a></h3>
            <h2 id="${username}-trackName" class="trackName">${json.track.name}</h2>
            <p id="${username}-artistName" class="artistName">${json.track.artist["#text"]}</p>
            <a id="${username}-searchButton" class="searchButton" href="https://www.google.com/search?q=${json.track.name}+${json.track.artist["#text"]}" target="_blank"> Search Song</a>
            </div>
            </div>
        `;
    return;
  }

  document.getElementById("scrobbling").innerHTML += `
        <div id="${username}-listening" class="listening">
        <img id="${username}-trackCover" class="trackCover" src="${coverImageUrl}">
        <div id="${username}-trackInfo" class="trackInfo">
        <h3><a href="https://last.fm/user/${username}" target="_blank">${username}</a> • <a href="https://${site}" target="_blank">${site}</a></h3>
        <h2 id="${username}-trackName" class="trackName">${json.track.name}</h2>
        <p id="${username}-artistName" class="artistName">${json.track.artist["#text"]}</p>
        <a id="${username}-searchButton" class="searchButton" href="https://www.google.com/search?q=${json.track.name}+${json.track.artist["#text"]}" target="_blank"> Search Song</a>
        </div>
        </div>
    `;
};

users.forEach((user) => {
  const username = user[0];
  const site = user[1];
  getTrack(username, site);
  notPlaying = 0;
});
