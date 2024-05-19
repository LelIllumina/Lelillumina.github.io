var nsfwValue = document.querySelector('input[name="nsfw"]:checked').value;
var customCSSValue = document.getElementById("customCSS").checked;

document.cookie =
  "nsfw=" + nsfwValue + "; expires=Fri, 31 Dec 9999 23:59:59 UTC; path=/";
document.cookie =
  "customCSS=" +
  customCSSValue.toString() +
  "; expires=Fri, 31 Dec 9999 23:59:59 UTC; path=/";

alert("Settings saved successfully!");
