// Lanyard Widget
async function discordWidget() {
  const request = await fetch(
    "https://api.lanyard.rest/v1/users/850319718920224798"
  );
  const response = await request.json();

  const widget = document.getElementById("discord-widget");

  // User info
  // Consts for each element
  const pfp = widget.querySelector("#discord-pfp");
  const discordName = widget.querySelector(`#discord-name`);
  const discordUsername = widget.querySelector(`#discord-username`);
  const discordStatus = widget.querySelector(`#discord-status`);
  const discordRPC = widget.querySelector(`#discord-rpc`);

  // Input values from JSON
  discordName.textContent = response.data.discord_user.global_name;
  discordUsername.textContent = "(" + response.data.discord_user.username + ")";
  discordStatus.textContent = response.data.activities[0].state;

  // Activity info
  const hasNonCustomId = response.data.activities.some(
    (activity) => activity.id !== "custom"
  );
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
      "https://" +
      response.data.activities[1].assets.large_image.split("/https/")[1];
    discordActivitySmallImage.src =
      "https://" +
      response.data.activities[1].assets.small_image.split("/https/")[1];
    discordActivityName.textContent = response.data.activities[1].name;
    discordActivityDetails.textContent = response.data.activities[1].details;
    discordActivityState.textContent = response.data.activities[1].state;
  } else {
    discordRPC.remove();
    widget.style.background = "none";
    widget.style.backgroundColor = "#1f1d2e";
  }

  // Change pfp border color
  const online = response.data.discord_status;
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
