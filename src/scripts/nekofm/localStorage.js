export function deleteLocalStorage() {
  localStorage.clear();
}

function setLocalStorage() {
  const nsfwValue = document.querySelector("input[name='nsfw']:checked").value;
  const cssEnabled = document.getElementById("customCSS").checked;

  localStorage.nsfw = nsfwValue;
  localStorage.customCSS = cssEnabled;
}

export function submit() {
  try {
    setLocalStorage();
    alert("Settings successfully saved");
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}
