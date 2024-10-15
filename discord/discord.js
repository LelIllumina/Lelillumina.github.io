// Discord Widget by Lel :3

const discord_ID = "850319718920224798"; // Your Discord ID here
(async function () {
  const response = await fetch(
    "https://api.lanyard.rest/v1/users/" + discord_ID
  );
  const { data: json } = await response.json();

  const widget = document.getElementById("discord-widget");
  const {
    discord_user: { global_name, username },
    discord_status: online,
    activities = [],
  } = json;

  // Query DOM elements once
  const elements = {
    pfp: widget.querySelector("#discord-pfp"),
    discordName: widget.querySelector("#discord-name"),
    discordUsername: widget.querySelector("#discord-username"),
    discordStatus: widget.querySelector("#discord-status"),
    discordRPC: widget.querySelector("#discord-rpc"),
    discordActivityName: widget.querySelector("#discord-activity-name"),
    discordActivityImage: widget.querySelector("#discord-activity-img"),
    discordActivitySmallImage: widget.querySelector(
      "#discord-activity-miniimg"
    ),
    discordActivityDetails: widget.querySelector("#discord-activity-details"),
    discordActivityState: widget.querySelector("#discord-activity-state"),
  };

  // User Info
  elements.discordName.textContent = global_name;
  elements.discordUsername.textContent = `(${username})`;

  // Early return if the user is offline
  if (online === "offline") {
    elements.discordStatus.textContent = "Offline";
    elements.discordRPC.remove();
    widget.style.background = "none";
    widget.style.backgroundColor = "#1f1d2e";
    return;
  }

  // Handle activities
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
    widget.style.background = "none";
    widget.style.backgroundColor = "#1f1d2e";
  }

  // Change profile picture border color based on status
  const statusColorMap = {
    online: "#a6e3a1",
    idle: "#f6c177",
    dnd: "#eb6f92",
  };
  elements.pfp.style.borderColor = statusColorMap[online] || "";
})();
