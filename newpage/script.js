// This will use JavaScript to get your username
const username = window.location.host.split(".")[0];
document.getElementById("username").textContent = username + "!"; // and then set insert it into the element with the "username" Id

document.title = "This is YOUR site " + username; // and on the title!!
