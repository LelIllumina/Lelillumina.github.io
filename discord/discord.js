class DiscordWidget extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <link rel="stylesheet" href="/discord/discord.min.css">
      <div id="discord-widget">
        <img
          src="https://api.lanyard.rest/850319718920224798.png"
          alt="discord pfp"
          id="discord-pfp"
        />
        <div id="discord-info" class="discordText">
          <h2 id="discord-name" class="discordText">Loading...</h2>
          <h3 id="discord-username" class="discordText">Loading...</h3>
          <br />
          <p id="discord-status" class="discordText">Loading...</p>
        </div>
        <div id="discord-rpc">
          <img
            src="http://lel.nekoweb.org/images/transparent.webp"
            alt=""
            id="discord-activity-img"
            height="100"
            width="100"
          />
          <img
            src="http://lel.nekoweb.org/images/transparent.webp"
            alt=""
            id="discord-activity-miniimg"
            height="25"
            width="25"
          />
          <div id="discord-activity" class="discordText">
            <h2 id="discord-activity-name" class="discordText">Loading...</h2>
            <br />
            <p id="discord-activity-details" class="discordText">Loading...</p>
            <br />
            <p id="discord-activity-state" class="discordText">Loading...</p>
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
    if (activities.length && activities[0].emoji) {
      elements.discordStatus.textContent = `${activities[0].emoji.name} ${activities[0].state}`;
    } else {
      elements.discordStatus.textContent = activities[0].state || "";
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
