function deleteLocalStorage() {
  localStorage.clear();
}

function setLocalStorage() {
  let nsfwValue = document.querySelector('input[name="nsfw"]:checked').value;
  let cssEnabled = document.getElementById("customCSS").checked;

  localStorage.nsfw = nsfwValue;
  localStorage.customCSS = cssEnabled;
}

function submit() {
  try {
    setLocalStorage();
    alert("Settings successfully saved");
  } catch (error) {
    alert("Error: " + error.message);
  }
}
