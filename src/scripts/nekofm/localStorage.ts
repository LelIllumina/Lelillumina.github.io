export function deleteLocalStorage() {
  localStorage.clear();
}

function setLocalStorage() {
  const nsfwValue = (
    document.querySelector("input[name='nsfw']:checked") as HTMLInputElement
  ).value;
  const cssEnabled = (document.getElementById("customCSS") as HTMLInputElement)
    .checked;

  localStorage.nsfw = nsfwValue;
  localStorage.customCSS = cssEnabled;
}

export function submit() {
  try {
    setLocalStorage();
    alert("Settings successfully saved");
  } catch (error) {
    if (error instanceof Error) {
      alert(`Error: ${error.message}`);
    } else {
      alert("An unknown error occurred");
    }
  }
}
