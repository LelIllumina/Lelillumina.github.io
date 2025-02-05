interface NekofmSettings {
  nsfw: string;
  customCSS: boolean;
}

const SETTINGS_KEY = "nekofmSettings";

// Get saved settings from localStorage
export function getSettings(): NekofmSettings | null {
  const settings = localStorage.getItem(SETTINGS_KEY);
  return settings ? JSON.parse(settings) : null;
}

// Save settings to localStorage
export function saveSettings(settings: NekofmSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving settings:", error);
  }
}

// Clear settings from localStorage
export function deleteSettings(): void {
  localStorage.removeItem(SETTINGS_KEY);
}

// Initialize settings based on localStorage
export function applySavedSettings(): void {
  const settings = getSettings();
  if (settings) {
    // Apply NSFW setting
    const nsfwOption = document.querySelector(
      `input[name="nsfw"][value="${settings.nsfw}"]`,
    ) as HTMLInputElement;
    if (nsfwOption) nsfwOption.checked = true;

    // Apply custom CSS setting
    const customCSSCheckbox = document.getElementById(
      "customCSS",
    ) as HTMLInputElement;
    if (customCSSCheckbox) customCSSCheckbox.checked = settings.customCSS;
  }
}

export function submit(): void {
  try {
    const nsfwValue = (
      document.querySelector("input[name='nsfw']:checked") as HTMLInputElement
    ).value;
    const customCSSEnabled = (
      document.getElementById("customCSS") as HTMLInputElement
    ).checked;

    const settings: NekofmSettings = {
      nsfw: nsfwValue,
      customCSS: customCSSEnabled,
    };

    saveSettings(settings);
    alert("Settings successfully saved");
  } catch (error) {
    alert("An error occurred while saving settings");
    console.error(error);
  }
}

(window as any).applySavedSettings = applySavedSettings;
(window as any).submit = submit;
(window as any).deleteSettings = deleteSettings;
