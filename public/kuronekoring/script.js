// webstring by june @ webcatz.neocities.org

// settings
webring = {
  // list of sites in the ring
  sites: [
    "https://lel.nekoweb.org",
    // "https://rice.nekoweb.org",
    // "http://localhost",
  ],

  // html inserted as your widget
  // PREV and NEXT get replaced with neighboring site urls
  // choose which widget to display by adding a data-widget="widgetname" attribute on the script
  widgets: {
    default: /* html */ `
    <link
        rel="stylesheet"
        href="/kuronekoring/widget.css"
      />
      <div id="kuronekoring">
        <a href="PREV"><</a>
        <div>KuroNeko Webring</div>
        <a href="NEXT">></a>
      </div>
    `,
    another: `
      <div>another widget...</div>
    `,
    yet_another: `
      <div>add as many (or as few) as you like!</div>
    `,
  },

  // widget css
  stylesheet: "https://lel.nekoweb.org/kuronekoring/widget.css",

  // html inserted instead of your widget on sites that aren't in the ring
  error: "<div>This site isn't part of the webring yet.</div>",
};

// code
webring.index = location.href.startsWith("file://")
  ? 0
  : webring.sites.findIndex((url) => location.href.startsWith(url));
if (webring.index === -1) document.currentScript.outerHTML = webring.error;
else {
  const sheet = document.createElement("link");
  sheet.rel = "stylesheet";
  sheet.href = webring.stylesheet;
  document.head.appendChild(sheet);
  let widget =
    webring.widgets[document.currentScript.dataset.widget] ??
    webring.widgets[Object.keys(webring.widgets)[0]];
  widget = widget.replace("PREV", webring.sites.at(webring.index - 1));
  widget = widget.replace(
    "NEXT",
    webring.sites[(webring.index + 1) % webring.sites.length],
  );
  widget = widget.replace(
    "RANDOM",
    webring.sites[Math.floor(Math.random() * webring.sites.length)],
  );
  document.currentScript.outerHTML = widget;
}
webring = null;
