import { users } from "./users.ts";

// ----- Interfaces & Constants -----
interface ImageData {
  "#text": string;
}

interface Artist {
  name: string;
}

interface Album {
  isnsfw: boolean;
}

interface Track {
  name: string;
  nowplaying: string;
  album: Album;
  image: ImageData[];
  artist: Artist;
}

interface RecentTracks {
  track: Track[];
}

interface LastFmData {
  recenttracks: RecentTracks;
}

const BASE_URL = "wss://scrobbled.tepiloxtl.net/ws/get_last_track/";
const DEFAULT_LOADING_IMG = "/images/NekoFM/loading.png";
const DEFAULT_NO_ART = "/images/NekoFM/NoArt.svg";
const DEFAULT_NSFW_COVER = "/images/NekoFM/NSFWCOVER.png";
const LASTFM_DEFAULT_IMG = "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png";

// ----- Cached DOM Elements -----
const totalCounter = document.getElementById("total") as HTMLHeadingElement;
const scrobblingSection = document.getElementById("scrobbling") as HTMLDivElement;
const offlineSection = document.getElementById("offline") as HTMLDivElement;
const loadingDiv = document.getElementById("loading") as HTMLDivElement;
totalCounter.textContent = users.length.toString();

const userFragment = document.createDocumentFragment();

// ----- WebSocket Connection -----
const connectWebSocket = (username: string): Promise<WebSocket> =>
  new Promise((resolve, reject) => {
    const socket = new WebSocket(`${BASE_URL}${username}`);
    socket.addEventListener("open", () => resolve(socket));
    socket.addEventListener("message", (event) => handleWebSocketMessage(username, event));
    socket.addEventListener("error", (error) => reject(error));
  });

// ----- Message Handling -----
function handleWebSocketMessage(username: string, event: MessageEvent) {
  let data: LastFmData;
  try {
    data = JSON.parse(event.data);
  } catch (error) {
    console.error("Error parsing JSON for user", username, error);
    return;
  }

  const track = data.recenttracks.track[0];
  if (!track) return;

  const userOnline = track.nowplaying === "true";
  hydrateUserDiv(username, track, userOnline);
  updateOnlineCounter();
}

// ----- DOM Update Helpers -----
function updateOnlineCounter() {
  const onlineCount = scrobblingSection.querySelectorAll(".container").length;
  const onlineCounter = document.getElementById("counter") as HTMLHeadingElement;
  onlineCounter.textContent = onlineCount.toString();
}

function createUserDiv(username: string, site: string): void {
  const div = document.createElement("div");
  div.id = username;
  div.className = "container";
  div.innerHTML = /* html */ `
    <div
      class="listening"
      id="${username}-songBox"
    >
      <img
        class="trackCover"
        id="${username}-trackCover"
        src="${DEFAULT_LOADING_IMG}"
        alt=""
        height="150"
        width="150"
      />
      <div class="trackInfo" id="${username}-trackInfo">
        <h3 class="siteName" id="${username}-siteName">
          <a href="https://last.fm/user/${username}" target="_blank"
            >${username}</a
          >
          • <a href="https://${site}" target="_blank">${site}</a>
        </h3>
        <h2 class="trackName" id="${username}-trackName">Loading...</h2>
        <p class="artistName" id="${username}-artistName">Loading...</p>
        <a
          class="searchButton"
          id="${username}-searchButton"
          href=""
          target="_blank"
          >Search Song</a
        >
      </div>
    </div>
  `;
  userFragment.append(div);
}

function hydrateUserDiv(username: string, track: Track, userOnline: boolean) {
  const userDiv = document.getElementById(username) as HTMLDivElement;
  const coverImgUrl = getCoverImage(track, username);
  updateTrackDetails(userDiv, track, coverImgUrl);

  if (userOnline) {
    scrobblingSection.append(userDiv);
  } else {
    offlineSection.append(userDiv);
  }
  updateScrobblingStatus();
}

function getCoverImage(track: Track, username: string): string {
  const defaultCover = track.image[2]["#text"];
  const coverImgUrl = track.album.isnsfw ? applyNSFWFilter(track, username, defaultCover) : defaultCover;

  return coverImgUrl === LASTFM_DEFAULT_IMG ? DEFAULT_NO_ART : coverImgUrl || DEFAULT_NO_ART;
}

function updateTrackDetails(userDiv: HTMLElement, track: Track, coverImgUrl: string) {
  const coverImgEl = userDiv.querySelector(`#${userDiv.id}-trackCover`) as HTMLImageElement;
  const trackNameEl = userDiv.querySelector(`#${userDiv.id}-trackName`) as HTMLDivElement;
  const artistNameEl = userDiv.querySelector(`#${userDiv.id}-artistName`) as HTMLDivElement;

  coverImgEl.src = coverImgUrl;
  coverImgEl.alt = track.name;
  trackNameEl.textContent = track.name;
  artistNameEl.textContent = track.artist.name;
}

function updateScrobblingStatus() {
  // If no users are in the scrobbling section, show a placeholder message.
  const currentOnline = scrobblingSection.querySelectorAll(".container").length;
  const noUsersMessage = document.getElementById("noUsers");

  if (currentOnline === 0 && !noUsersMessage) {
    const p = document.createElement("p");
    p.id = "noUsers";
    p.textContent = "No one's listening to anything right now";
    scrobblingSection.append(p);
  } else if (currentOnline > 0 && noUsersMessage) {
    noUsersMessage.remove();
  }
}

// ----- NSFW Filter -----
import NekofmSettingsManager from "./settings/setSettings.ts";

function applyNSFWFilter(track: Track, username: string, defaultCover: string): string {
  const settings = NekofmSettingsManager.getSettings();
  const trackCover = document.getElementById(`${username}-trackCover`) as HTMLElement;
  if (!settings.nsfw || settings.nsfw === "off") return defaultCover;

  switch (settings.nsfw) {
    case "blurred":
      setTimeout(() => {
        if (trackCover) trackCover.style.filter = "blur(10px)";
      }, 1);
      return defaultCover;
    default:
      return DEFAULT_NSFW_COVER;
  }
}

// Ensure you're using default settings if no saved settings exist:
const currentSettings = NekofmSettingsManager.getSettings();

// ----- Setup Connections -----
async function setupWebSocketConnections(users: { username: string; site: string; customCSS: boolean }[]) {
  createUserDivs(users);
  try {
    const connections = await Promise.all(users.map((user) => connectWebSocket(user.username)));
    console.log("WebSocket connections established:", connections);
  } catch (error) {
    console.error("Error connecting to WebSockets:", error);
  }
}

function createUserDivs(users: { username: string; site: string; customCSS: boolean }[]) {
  for (const { username, site } of users) {
    createUserDiv(username, site);
  }
  loadingDiv.append(userFragment);
}

// ----- Initialization -----
setupWebSocketConnections(users);
