class DiscordWidget extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = /* HTML */ `
      <link rel="stylesheet" href="/discord/discord.css" />
      <div id="discord-widget">
        <div id="discord-header">
          <img
            id="discord-pfp"
            src="https://api.lanyard.rest/850319718920224798.webp"
            alt="discord pfp"
            height="50"
            width="50"
          />
          <div class="discordText" id="discord-info">
            <h2 class="discordText" id="discord-name">Loading...</h2>
            <h3 class="discordText" id="discord-username">Loading...</h3>
            <br />
            <p class="discordText" id="discord-status">Loading...</p>
          </div>
        </div>
        <div id="discord-rpc">
          <img
            id="discord-activity-img"
            src="https://lel.nekoweb.org/assets/images/transparent.webp"
            alt=""
            height="100"
            width="100"
          />
          <img
            id="discord-activity-miniimg"
            src="https://lel.nekoweb.org/assets/images/transparent.webp"
            alt=""
            height="25"
            width="25"
          />
          <div class="discordText" id="discord-activity">
            <h2 class="discordText" id="discord-activity-name">Loading...</h2>
            <br />
            <p class="discordText" id="discord-activity-details">Loading...</p>
            <br />
            <p class="discordText" id="discord-activity-state">Loading...</p>
          </div>
        </div>
      </div>
    `;
  }

  async connectedCallback() {
    const discord_ID = this.getAttribute("discord-id") || "850319718920224798";
    const response = await fetch(
      `https://api.lanyard.rest/v1/users/${discord_ID}`
    );
    const { data: json } = await response.json();

    const {
      discord_user: { global_name, username },
      discord_status: online,
      activities = [],
    } = json;

    const elements = {
      pfp: this.querySelector("#discord-pfp"),
      discord: this.querySelector("#discord-widget"),
      discordName: this.querySelector("#discord-name"),
      discordUsername: this.querySelector("#discord-username"),
      discordStatus: this.querySelector("#discord-status"),
      discordRPC: this.querySelector("#discord-rpc"),
      discordActivityName: this.querySelector("#discord-activity-name"),
      discordActivityImage: this.querySelector("#discord-activity-img"),
      discordActivitySmallImage: this.querySelector(
        "#discord-activity-miniimg"
      ),
      discordActivityDetails: this.querySelector("#discord-activity-details"),
      discordActivityState: this.querySelector("#discord-activity-state"),
    };

    elements.discordName.textContent = global_name;
    elements.discordUsername.textContent = `(${username})`;

    if (online === "offline") {
      elements.discordStatus.textContent = "Offline";
      elements.discordRPC.remove();
      return;
    }

    const hasNonCustomId = activities.some(
      (activity) => activity.id !== "custom"
    );
    if (activities.length === 0) {
      elements.discordStatus.textContent = "";
    } else {
      elements.discordStatus.textContent = `${(activities[0].emoji && activities[0].emoji.name) || ""} ${activities[0].state}`;
    }

    if (hasNonCustomId) {
      const { assets, name, details, state } = activities[1] || {};
      if (assets && assets.large_image) {
        elements.discordActivityImage.src = `https://${assets.large_image.split("/https/")[1]}`;
      }
      if (assets && assets.small_image) {
        elements.discordActivitySmallImage.src = `https://${assets.small_image.split("/https/")[1]}`;
      }
      elements.discordActivityName.textContent = name || "";
      elements.discordActivityDetails.textContent = details || "";
      elements.discordActivityState.textContent = state || "";
    } else {
      elements.discordRPC.remove();
      elements.discord.style.background = "#1f1d2e";
    }

    const statusColorMap = {
      online: "#a6e3a1",
      idle: "#f6c177",
      dnd: "#eb6f92",
    };
    elements.pfp.style.borderColor = statusColorMap[online] || "";
  }
}

customElements.define("discord-widget", DiscordWidget);

// TODO replace actitvity section with doc fragment and add a frag for each activity
