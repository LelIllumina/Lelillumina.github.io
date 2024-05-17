// function convert(seconds) {
//   const min = Math.floor(seconds / 60);
//   const sec = seconds % 60;
//   return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
// }

// const username = "LelIllumina";
// const API_KEY = "9335bc28942537e8ebe836f495f69ba8";
// const scrobbleUrl = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${API_KEY}&limit=1&format=json`;

// fetch(scrobbleUrl)
//   .then((response) => response.json())
//   .then((data) => {
//     const [, ...tracks] = data.recenttracks.track;

//     tracks.forEach((track) => {
//       const artistName = track.artist['#text'];
//       const name = track.name;
//       const lastfmUts = track.date.uts;

//       const trackInfoUrl = `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${API_KEY}&artist=${artistName}&track=${name}&format=json`;

//       fetch(trackInfoUrl)
//         .then((response) => response.json())
//         .then((songDetails) => {
//           const duration = songDetails.track.duration;
//           const length = convert(parseInt(duration) / 1000);
//           const listened = Math.floor(Date.now() / 1000) - parseInt(lastfmUts);

//           console.log("Track:", name);
//           console.log("Artist:", artistName);

//           let intervalId = setInterval(() => {
//               const currentListened = Math.floor(Date.now() / 1000) - parseInt(lastfmUts);
//             console.log(`Time listened: ${convert(currentListened)}/${length}`, '\r');
//           }, 1000);

//           setTimeout(() => {
//             clearInterval(intervalId);
//           }, (parseInt(duration) - listened) * 1000);
//         })
//         .catch((error) => {
//           console.error("Error fetching track info:", error);
//         });
//     });
//   })
//   .catch((error) => {
//     console.error("Error fetching recent tracks:", error);
//   });
