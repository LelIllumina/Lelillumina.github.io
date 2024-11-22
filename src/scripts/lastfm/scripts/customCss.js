// Fetching Custom CSS
import { users } from "./users.js";

if (localStorage.customCSS !== "false") {
  users.forEach((user) => {
    const [username, domain, hasCss] = user;
    const url = `https://${domain}/nekofm.css`; // Random text to keep refreshing css
    if (hasCss) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = url;
      link.as = "style";
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
