// this script is under the MIT license (https://max.nekoweb.org/resources/license.txt)
                        
const USERNAME = "LelIllumina"; // Put your LastFM username here
const BASE_URL = `https://lastfm-last-played.biancarosa.com.br/${USERNAME}/latest-song`;

const getTrack = async () => {
    const request = await fetch(BASE_URL);
    const json = await request.json();
    let status

    let isPlaying = json.track['@attr']?.nowplaying || false;

    if(!isPlaying) {
        // Trigger if a song isn't playing
        return;
    } else {
        // Trigger if a song is playing
    }

    // Values:
    // COVER IMAGE: json.track.image[1]['#text']
    // TITLE: json.track.name
    // ARTIST: json.track.artist['#text']

    document.getElementById("listening").innerHTML = `
    <img id="trackCover" src="${json.track.image[3]['#text']}">
    <div id="trackInfo">
    <h3>${USERNAME}</h3>
    <h2 id="trackName">${json.track.name}</h2>
    <p id="artistName">${json.track.artist['#text']}</p>
    <a id="searchButton" href="https://www.google.com/search?q=${json.track.name}+${json.track.artist['#text']}" target="_blank"> Search Song</a>
    </div>
    `
};

getTrack();
setInterval(() => { getTrack(); }, 10000);