export interface Image {
  "#text": string;
}

export interface Artist {
  name: string;
}

export interface Album {
  isnsfw: boolean;
}

export interface Track {
  name: string;
  nowplaying: string;
  album: Album;
  image: Image[];
  artist: Artist;
}

export interface RecentTracks {
  track: Track[];
}

export interface LastFmData {
  recenttracks: RecentTracks;
}

const WS_URL = "wss://scrobbled.tepiloxtl.net/ws/get_last_track/lelillumina";
const DEFAULT_NO_ART = "/images/NekoFM/NoArt.svg";
const DEFAULT_NSFW_COVER = "/images/NekoFM/NSFWCOVER.png";
const LASTFM_DEFAULT_IMG = "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png";

const lastFmStatus = document.getElementById("lastfm-status") as HTMLHeadingElement;
const songBox = document.getElementById("songBox") as HTMLDivElement;

const trackNameEl = songBox.querySelector("#trackName") as HTMLHeadingElement;
const artistNameEl = songBox.querySelector("#artistName") as HTMLParagraphElement;
const coverImgEl = songBox.querySelector("#trackCover") as HTMLImageElement;

async function openWebSocket(url: string): Promise<WebSocket> {
  const socket = new WebSocket(url);
  await new Promise<void>((resolve, reject) => {
    socket.addEventListener("open", () => resolve());
    socket.addEventListener("error", (err) => reject(err));
  });
  return socket;
}

function handleMessage(event: MessageEvent) {
  let data: LastFmData;
  try {
    data = JSON.parse(event.data);
  } catch (error) {
    console.error("Failed to parse message:", error);
    return;
  }

  const track = data.recenttracks.track[0];
  if (!track) return;

  // Update online status display
  lastFmStatus.textContent = track.nowplaying === "false" ? "Last Played" : "Now Playing";

  // Determine cover image URL based on NSFW flag and default art fallback
  let coverImgUrl = track.album.isnsfw ? DEFAULT_NSFW_COVER : track.image[2]["#text"];
  if (coverImgUrl === LASTFM_DEFAULT_IMG) coverImgUrl = DEFAULT_NO_ART;

  // Update track details in DOM
  trackNameEl.textContent = track.name;
  artistNameEl.textContent = `by ${track.artist.name}`;
  coverImgEl.src = coverImgUrl || DEFAULT_NO_ART;
}

export async function initLastFmSocket() {
  try {
    const socket = await openWebSocket(WS_URL);
    socket.addEventListener("message", handleMessage);
  } catch (error) {
    console.error("WebSocket connection error:", error);
  }
}

// Initialize connection immediately
initLastFmSocket();
