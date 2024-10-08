// Lanyard Widget
async function discordWidget() {
  const request = await fetch(
    "https://api.lanyard.rest/v1/users/850319718920224798"
  );
  const response = await request.json();
  const json = response.data;

  const widget = document.getElementById("discord-widget");
  const online = json.discord_status;

  // User info
  // Consts for each element
  const pfp = widget.querySelector("#discord-pfp");
  const discordName = widget.querySelector(`#discord-name`);
  const discordUsername = widget.querySelector(`#discord-username`);
  const discordStatus = widget.querySelector(`#discord-status`);
  const discordRPC = widget.querySelector(`#discord-rpc`);

  // Input values from JSON
  discordName.textContent = json.discord_user.global_name;
  discordUsername.textContent = "(" + json.discord_user.username + ")";

  // Activity info
  if (online != "offline") {
    var hasNonCustomId = json.activities.some(
      (activity) => activity.id !== "custom"
    );
    if (json.activities[0].emoji) {
      discordStatus.textContent =
        json.activities[0].emoji.name + " " + json.activities[0].state;
    } else {
      discordStatus.textContent = json.activities[0].state;
    }
  } else {
    discordStatus.textContent = "Offline";
  }
  if (hasNonCustomId === true) {
    // Consts for each element
    const discordActivityName = widget.querySelector("#discord-activity-name");
    const discordActivityImage = widget.querySelector("#discord-activity-img");
    const discordActivitySmallImage = widget.querySelector(
      "#discord-activity-miniimg"
    );
    const discordActivityDetails = widget.querySelector(
      "#discord-activity-details"
    );
    const discordActivityState = widget.querySelector(
      "#discord-activity-state"
    );

    // Add values to each element
    discordActivityImage.src =
      "https://" + json.activities[1].assets.large_image.split("/https/")[1];
    discordActivitySmallImage.src =
      "https://" + json.activities[1].assets.small_image.split("/https/")[1];
    discordActivityName.textContent = json.activities[1].name;
    discordActivityDetails.textContent = json.activities[1].details;
    discordActivityState.textContent = json.activities[1].state;
  } else {
    discordRPC.remove();
    widget.style.background = "none";
    widget.style.backgroundColor = "#1f1d2e";
  }

  // Change pfp border color
  switch (online) {
    case "online":
      pfp.style.borderColor = "#a6e3a1";
      break;
    case "idle":
      pfp.style.borderColor = "#f6c177";
      break;
    case "dnd":
      pfp.style.borderColor = "#eb6f92";
      break;
    default:
      break;
  }
}

discordWidget();
