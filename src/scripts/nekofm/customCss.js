// Fetching Custom CSS
import { users } from "./users.js";

if (localStorage.customCSS !== "false") {
  for (let i = 0; i < users.length; i++) {
    const [username, domain, hasCss] = users[i];
    const url = `https://${domain}/nekofm.css`; // Random text to keep refreshing CSS

    if (hasCss) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = url;
      link.as = "fetch";
      document.head.appendChild(link);

      fetch(url)
        .then((response) => response.text())
        .then((data) => {
          // Prefixing CSS selectors with `#${username}`
          const modifiedCss = data.replace(
            /(^|})\s*([^{@}]+)\s*{/g,
            (match, prefix, selector) => {
              // Avoid prefixing inside @keyframes and similar blocks
              if (/^\s*@/.test(selector)) return match;

              // Prefix selectors
              const prefixedSelectors = selector
                .split(",")
                .map((sel) => `#${username}-${sel.trim()}`)
                .join(", ");
              return `${prefix} ${prefixedSelectors} {`;
            },
          );

          const styleTag = document.createElement("style");
          styleTag.innerHTML = modifiedCss;
          document.head.appendChild(styleTag);
        })
        .catch((error) => console.error(`Error fetching ${url}:`, error));
    }
  }
}
