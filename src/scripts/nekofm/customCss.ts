import { users } from "./users.ts";

if (localStorage.customCSS !== "false") {
  for (const user of users) {
    const { username, site, customCSS } = user;
    const url = `https://${site}/nekofm.css`;

    if (customCSS) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = url;
      link.as = "fetch";
      document.head.appendChild(link);

      fetch(url)
        .then((response) => response.text())
        .then((data) => {
          const modifiedCss = data.replace(
            /(^|})\s*([^{@}]+)\s*{/g,
            (match, prefix, selector) => {
              if (/^\s*@/.test(selector)) return match;
              const prefixedSelectors = selector
                .split(",")
                .map((sel: string) => `#${username}-${sel.trim()}`)
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
