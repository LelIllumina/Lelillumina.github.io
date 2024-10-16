// This will use JavaScript to get your username
const username = location.hostname.replace(".nekoweb.org", "");
document.getElementById("username").textContent = username + "!"; // and then insert it into the element with the "username" Id

document.title = "This is YOUR site " + username; // and on the title!!
