class DiscordWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
.discordText {
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  margin: auto;
  text-align: left;
  display: inline-block;
}

#discord-widget {
  background: linear-gradient(#1f1d2e 0 40%, #26233a 40% 100%);
  padding: 20px;
  border: 8px solid #191724;
  margin: 5px;
  box-shadow: 0 0 10px black;
  text-align: left;
}

#discord-widget * {
  vertical-align: middle;
  color: #e0def4;
}

#discord-pfp {
  margin: 10px;
  width: 50px;
  border: 3px solid #1f1d2e;
}

#discord-username {
  display: inline-block;
  color: grey;
}

#discord-rpc {
  margin-top: 35px;
  position: relative;
}

#discord-activity-img {
  margin: 10px;
  width: 100px;
}

#discord-activity-miniimg {
  height: 40px;
  width: 40px;
  display: block;
  position: absolute;
  top: 75px;
  left: 75px;
}

#discord-activity-details,
#discord-activity-state {
  font-size: 12px !important;
}

      </style>
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
      src="http://upload.wikimedia.org/wikipedia/commons/c/ce/Transparent.gif"
      alt=""
      id="discord-activity-img"
      height="100"
      width="100"
    />
    <img
      src="http://upload.wikimedia.org/wikipedia/commons/c/ce/Transparent.gif"
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
      pfp: this.shadowRoot.querySelector("#discord-pfp"),
      discordName: this.shadowRoot.querySelector("#discord-name"),
      discordUsername: this.shadowRoot.querySelector("#discord-username"),
      discordStatus: this.shadowRoot.querySelector("#discord-status"),
      discordRPC: this.shadowRoot.querySelector("#discord-rpc"),
      discordActivityName: this.shadowRoot.querySelector(
        "#discord-activity-name"
      ),
      discordActivityImage: this.shadowRoot.querySelector(
        "#discord-activity-img"
      ),
      discordActivitySmallImage: this.shadowRoot.querySelector(
        "#discord-activity-miniimg"
      ),
      discordActivityDetails: this.shadowRoot.querySelector(
        "#discord-activity-details"
      ),
      discordActivityState: this.shadowRoot.querySelector(
        "#discord-activity-state"
      ),
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
