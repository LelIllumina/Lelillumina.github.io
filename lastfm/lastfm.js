// this script is under the MIT license (https://max.nekoweb.org/resources/license.txt)
                        
const getTrack = async (username, site) => {
    const BASE_URL = `https://lastfm-last-played.biancarosa.com.br/${username}/latest-song`;
    const request = await fetch(BASE_URL);
    const json = await request.json();
    let status

    let isPlaying = json.track['@attr']?.nowplaying || false;

    if(!isPlaying) {
        // Trigger if a song isn't playing
        return;
    }

    document.getElementById("scrobbling").innerHTML += `
    <div id="listening">
    <img id="trackCover" src="${json.track.image[3]['#text']}">
    <div id="trackInfo">
    <h3><a href="https://last.fm/user/${username}" target="_blank">${username}</a> • <a href="https://${site}" target="_blank">${site}</a></h3>
    <h2 id="trackName">${json.track.name}</h2>
    <p id="artistName">${json.track.artist['#text']}</p>
    <a id="searchButton" href="https://www.google.com/search?q=${json.track.name}+${json.track.artist['#text']}" target="_blank"> Search Song</a>
    </div>
    </div>
    `
};

users.forEach((user) => {
    const username = user[0];
    const site = user[1];
    getTrack(username, site);
});

setInterval(() => { users.forEach((user) => {
    const username = user[0];
    const site = user[1];
    getTrack(username, site);
});; }, 10000);