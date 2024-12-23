import { type DiscordData, fetchDiscordData } from "./api";

export class DiscordWidget extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = /* HTML */ `
      <div id="discord-widget">
        <div id="discord-header">
          <img
            id="discord-pfp"
            src="https://api.lanyard.rest/850319718920224798.webp"
            alt="discord pfp"
            height="50"
            width="50"
            decoding="async"
          />
          <div class="discord-text" id="discord-info">
            <h2 class="discord-text" id="discord-name">Loading...</h2>
            <h3 class="discord-text" id="discord-username">Loading...</h3>
            <br />
            <p class="discord-text" id="discord-status">Loading...</p>
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
          <div class="discord-text" id="discord-activity">
            <h2 class="discord-text" id="discord-activity-name">Loading...</h2>
            <br />
            <p class="discord-text" id="discord-activity-details">Loading...</p>
            <br />
            <p class="discord-text" id="discord-activity-state">Loading...</p>
          </div>
        </div>
      </div>
    `;
  }

  private getElements() {
    return {
      discord: this.querySelector("#discord-widget") as HTMLDivElement,
      pfp: this.querySelector("#discord-pfp") as HTMLImageElement,
      discordName: this.querySelector("#discord-name") as HTMLHeadingElement,
      discordUsername: this.querySelector(
        "#discord-username",
      ) as HTMLHeadingElement,
      discordStatus: this.querySelector(
        "#discord-status",
      ) as HTMLParagraphElement,
      discordRPC: this.querySelector("#discord-rpc") as HTMLDivElement,
      discordActivityName: this.querySelector(
        "#discord-activity-name",
      ) as HTMLHeadingElement,
      discordActivityImage: this.querySelector(
        "#discord-activity-img",
      ) as HTMLImageElement,
      discordActivitySmallImage: this.querySelector(
        "#discord-activity-miniimg",
      ) as HTMLImageElement,
      discordActivityDetails: this.querySelector(
        "#discord-activity-details",
      ) as HTMLParagraphElement,
      discordActivityState: this.querySelector(
        "#discord-activity-state",
      ) as HTMLParagraphElement,
    };
  }

  private updateWidget(data: DiscordData) {
    const elements = this.getElements();
    const {
      discord_user: { global_name, username },
      discord_status: online,
      activities = [],
    } = data;

    elements.discordName.textContent = global_name;
    elements.discordUsername.textContent = `(${username})`;

    if (online === "offline") {
      elements.discordStatus.textContent = "Offline";
      elements.discordRPC.remove();
      return;
    }

    const hasNonCustomId = activities.some(
      (activity: { id: string }) => activity.id !== "custom",
    );

    if (activities.length === 0) {
      elements.discordStatus.textContent = "";
    } else {
      elements.discordStatus.textContent = `${activities[0].emoji?.name || ""} ${activities[0].state}`;
    }

    if (hasNonCustomId) {
      const { assets, name, details, state } = activities[1] || {};
      if (assets?.large_image) {
        elements.discordActivityImage.src = `https://${assets.large_image.split("/https/")[1]}`;
      }
      if (assets?.small_image) {
        elements.discordActivitySmallImage.src = `https://${assets.small_image.split("/https/")[1]}`;
      }
      elements.discordActivityName.textContent = name || "";
      elements.discordActivityDetails.textContent = details || "";
      elements.discordActivityState.textContent = state || "";
    } else {
      elements.discordRPC.remove();
      elements.discord.style.background = "#1f1d2e";
    }
  }

  async connectedCallback() {
    const discordId = this.getAttribute("discord-id") || "850319718920224798";
    try {
      const data = await fetchDiscordData(discordId);
      this.updateWidget(data);
    } catch (error) {
      console.error("Failed to fetch Discord data:", error);
      // Handle error state here
    }
  }
}

customElements.define("discord-widget", DiscordWidget);
