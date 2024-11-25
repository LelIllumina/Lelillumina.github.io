//  stats from api
//  taken from https://maxpixels.moe/resources/nekoweb-stats/

// this script is under the MIT license (https://maxpixels.moe/resources/license.txt)

(async () => {
  try {
    const request = await fetch("https://nekoweb.org/api/site/info/lel");
    const json = await request.json();

    const updated = new Date(json.updated_at).toLocaleDateString(); // Formats Last Updated text
    const created = new Date(json.created_at).toLocaleDateString(); // Formats Creation Date text

    document.getElementById("created").innerHTML =
      `<em>Created</em>: ${created}`;
    document.getElementById("updated").innerHTML =
      `<em>Updated</em>: ${updated}`;
    document.getElementById("visitors").innerHTML =
      `<em>Visits</em>: ${json.views}`;
    document.getElementById("followers").innerHTML =
      `<em>Followers</em>: ${json.followers}`;
  } catch (error) {
    console.error(error);
    // If you wish to insert some fallback here, you may do so!
  }
})();

// Scrobbled Widget
(async function () {
  return new Promise(function (resolve, reject) {
    const socket = new WebSocket(
      "wss://scrobbled.tepiloxtl.net/ws/get_last_track/lelillumina"
    );

    socket.onopen = function () {
      resolve(socket);
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const track = data.recenttracks.track[0];

      // Check user's online status
      const status = document.getElementById("lastfm-status");

      status.textContent =
        track.nowplaying === "false" ? "Last Played" : "Now Playing";

      // check if NSFW
      let coverImgUrl = track.album.isnsfw
        ? "/assets/images/NekoFM/NSFWCOVER.png"
        : track.image[2]["#text"];

      if (
        coverImgUrl ===
        "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png"
      ) {
        coverImgUrl = "/assets/images/NekoFM/NoArt.png";
      }

      // Track elements
      const userDiv = document.getElementById("songBox");
      const trackNameEl = userDiv.querySelector("#trackName");
      const artistNameEl = userDiv.querySelector("#artistName");
      const coverImgEl = userDiv.querySelector("#trackCover");

      trackNameEl.textContent = track.name;
      artistNameEl.textContent = "by " + track.artist.name;
      coverImgEl.src = coverImgUrl || "/assets/images/NekoFM/NoArt.png";
    };

    socket.onerror = function (error) {
      reject(error);
    };
  });
})();

(function () {
  const taglines = [
    "NENENENEKO WEBBB!!!",
    "Welcome to Lel Island!",
    "Lel is out there to get you!",
    "I may be dumb, but youre mean and thats worse",
    "who says i can think",
    "Report any bugs to me plssss :33333",
    "im gonna hide something sinister here",
    "THIS IS AN 18+ SITE, NO KIDS ALLOWED TIME TO GET 𝓯𝓻𝓮𝓪𝓴𝔂",
    "who here has Nekoweb",
    "Assalamualaikum Brothers...",
    "Who up nekoing they web rn",
    "In the Nekoweb",
    "Strait up Webbing it",
    "hehe",
    "Lets justr say, my websait",
    "i am not good",
    "please sleep",
    "erm.. what the web",
    "one day i will sleep on time",
    "TODAY IS THE DAY",
    "I am the bone of my sword",
    "and I, am SHIROU FUCKING EMIYA",
    "i fuckin love fate",
    "arcuied my beloved, saber my beloved",
    "My tummy hurts",
    "I dont even like minecraft",
    "BREAKING NEWS: i erm, i forgor...",
    "I don't know",
    "Listen to susumu hirasawa",
    "10 seconds ago is crazy",
    "Now on atabook :3",
    "tagging my line rn",
    "New project mouthwash vid :D",
    "Got the FLACs flaccing",
    "The FLACs are now mp4s",
    "I may or may not have forgotten about this",
    "Hakunon My Beloved",
    `The War of 1812 was fought by the United States and its allies against the United Kingdom and its allies in North America. It began when the United States declared war on Britain on 18 June 1812. Although peace terms were agreed upon in the December 1814 Treaty of Ghent, the war did not officially end until the peace treaty was ratified by the United States Congress on 17 February 1815.[11][12]

Anglo-American tensions stemmed from long-standing differences over territorial expansion in North America and British support for Tecumseh's confederacy, which resisted U.S. colonial settlement in the Old Northwest. In 1807, these tensions escalated after the Royal Navy began enforcing tighter restrictions on American trade with France and impressed sailors who were originally British subjects, even those who had acquired American citizenship.[13] Opinion in the U.S. was split on how to respond, and although majorities in both the House and Senate voted for war, they were divided along strict party lines, with the Democratic-Republican Party in favour and the Federalist Party against.[d][14] News of British concessions made in an attempt to avoid war did not reach the U.S. until late July, by which time the conflict was already underway.

At sea, the Royal Navy imposed an effective blockade on U.S. maritime trade, while between 1812 and 1814 British regulars and colonial militia defeated a series of American invasions on Upper Canada.[15] The April 1814 abdication of Napoleon allowed the British to send additional forces to North America and reinforce the Royal Navy blockade, crippling the American economy.[16] In August 1814, negotiations began in Ghent, with both sides wanting peace; the British economy had been severely impacted by the trade embargo, while the Federalists convened the Hartford Convention in December to formalize their opposition to the war.

In August 1814, British troops captured Washington, before American victories at Baltimore and Plattsburgh in September ended fighting in the north. In the Southeastern United States, American forces and Indian allies defeated an anti-American faction of the Muscogee. In early 1815, American troops led by Andrew Jackson repulsed a major British attack on New Orleans, which occurred during the ratification process of the signing of the Treaty of Ghent, which brought an end to the conflict.[17] `,
  ];
  const randomIndex = Math.floor(Math.random() * taglines.length);
  document.getElementById("tagline").innerHTML = taglines[randomIndex];
})();
