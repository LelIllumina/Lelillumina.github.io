// Fetching Custom CSS
import { users } from "./users.min.js";

if (localStorage.customCSS !== "false") {
  users.forEach((user) => {
    const username = user[0];
    const domain = user[1];
    const hasCss = user[2];
    const url = `https://${domain}/nekofm.css?` + Math.random(); // Random text to keep refreshing css
    if (hasCss) {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = url;
      document.head.appendChild(link);
      fetch(url)
        .then((response) => response.text())
        .then((data) => {
          // Prefixing CSS selectors with `#${username}-`
          const modifiedCss = data.replace(
            /(^|})([^{]+)/g,
            (match, p1, p2) => `${p1} #${username}-${p2.trim()}`
          );
          const styleTag = document.createElement("style");
          styleTag.innerHTML = modifiedCss;
          document.head.appendChild(styleTag);
        })
        .catch((error) => console.error(`Error fetching ${url}:`, error));
    }
  });
}
