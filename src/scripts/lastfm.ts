(async () =>
  new Promise((resolve, reject) => {
    const socket = new WebSocket(
      "wss://scrobbled.tepiloxtl.net/ws/get_last_track/lelillumina",
    );

    socket.onopen = () => {
      resolve(socket);
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const track = data.recenttracks.track[0];

      const status = document.getElementById(
        "lastfm-status",
      ) as HTMLHeadingElement;

      // Check user's online status
      status.textContent =
        track.nowplaying === "false" ? "Last Played" : "Now Playing";

      // Check if Album Cover is NSFW
      let coverImgUrl = track.album.isnsfw
        ? "/images/NekoFM/NSFWCOVER.png"
        : track.image[2]["#text"];

      if (
        coverImgUrl ===
        "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png"
      ) {
        coverImgUrl = "/images/NekoFM/NoArt.svg";
      }

      // Track elements
      const userDiv = document.getElementById("songBox") as HTMLDivElement;
      const trackNameEl = userDiv.querySelector(
        "#trackName",
      ) as HTMLHeadingElement;
      const artistNameEl = userDiv.querySelector(
        "#artistName",
      ) as HTMLParagraphElement;
      const coverImgEl = userDiv.querySelector(
        "#trackCover",
      ) as HTMLImageElement;

      trackNameEl.textContent = track.name;
      artistNameEl.textContent = `by ${track.artist.name}`;
      coverImgEl.src = coverImgUrl || "/images/NekoFM/NoArt.png";
    };

    socket.onerror = (error) => {
      reject(error);
    };
  }))();
