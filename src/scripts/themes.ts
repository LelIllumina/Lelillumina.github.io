type Theme = { [key: string]: string };

export const themes: { [key: string]: Theme } = {
  default: {
    "--background": "oklch(19% 0 0deg)",
    "--foreground": "oklch(31% 0 0deg)",
    "--text": "oklch(80% 0 0deg)",
    "--text-dark": "oklch(60% 0 0deg)",
    "--text-darker": "oklch(40% 0 0deg)",
    "--accent": "oklch(78.71% 0.1187 304deg)",
    "--link": "oklch(73% 0.12 200deg)",
    "--red": "oklch(50% 0.2 20deg)",
  },
  catppuccin: {
    "--background": "oklch(18% 0.0204 284deg)",
    "--foreground": "oklch(30% 0.0304 284deg)",
    "--text": "oklch(88% 0.0426 272deg)",
    "--text-dark": "oklch(78% 0.0426 272deg)",
    "--text-darker": "oklch(68% 0.0426 272deg)",
    "--accent": "oklch(86% 0.1092 142deg)",
    "--link": "oklch(77% 0.1113 260deg)",
  },
  rosepine: {
    "--background": "oklch(21% 0.0255 291deg)",
    "--foreground": "oklch(27% 0.0423 289deg)",
    "--text": "oklch(91% 0.0299 289deg)",
    "--text-dark": "oklch(81% 0.0299 289deg)",
    "--text-darker": "oklch(71% 0.0299 289deg)",
    "--accent": "oklch(70% 0.1565 4deg)",
    "--link": "oklch(53% 0.0793 228deg)",
  },
  jollytheme: {
    "--background": "oklch(62.8% 0.25 29deg)",
    "--foreground": "oklch(73.14% 0.1652 22deg)",
    "--text": "oklch(190% 0 0deg)",
    "--text-dark": "oklch(90% 0 0deg)",
    "--text-darker": "oklch(80% 0 0deg)",
    "--accent": "oklch(56.45% 0.1564 141deg)",
    "--link": "oklch(56.45% 0.1564 141deg)",
  },
  // TODO: Add Everforest theme properties when available
};

// Extend the Window interface to include setTheme
declare global {
  interface Window {
    setTheme: (themeName: string) => void;
  }
}

export function setTheme(themeName: string): void {
  const root = document.documentElement;
  const theme: Theme | undefined = themes[themeName];

  if (!theme) {
    console.warn(`Theme "${themeName}" not found. Falling back to "default".`);
    // Apply the default theme directly without returning
    setTheme("default");
    return;
  }

  for (const key in theme) {
    if (Object.prototype.hasOwnProperty.call(theme, key)) {
      root.style.setProperty(key, theme[key]);
    }
  }

  localStorage.setItem("theme", themeName);
}

function loadTheme(): void {
  const savedTheme = localStorage.getItem("theme") || "default";
  setTheme(savedTheme);
}

// Initialize the theme on page load
loadTheme();

// Attach to the window for debugging or manual theme switching
window.setTheme = setTheme;

function setupThemeSelector(): void {
  const themeDropdown = document.getElementById(
    "theme-dropdown",
  ) as HTMLSelectElement;

  if (!themeDropdown) {
    console.error("Theme dropdown not found!");
    return;
  }

  // Set the current theme in the dropdown
  const savedTheme = localStorage.getItem("theme") || "default";
  themeDropdown.value = savedTheme;

  // Listen for changes in the dropdown
  themeDropdown.addEventListener("change", (event) => {
    const selectedTheme = (event.target as HTMLSelectElement).value;
    setTheme(selectedTheme);
  });
}

document.addEventListener("astro:page-load", () => {
  setupThemeSelector();
});
