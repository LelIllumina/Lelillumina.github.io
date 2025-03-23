interface NekofmSettings {
  nsfw: string;
  customCSS: boolean;
}

const SETTINGS_KEY = "nekofmSettings";

export function getDefaultSettings(): NekofmSettings {
  return {
    nsfw: "off",
    customCSS: false,
  };
}

export function getSettings(): NekofmSettings {
  const settings = localStorage.getItem(SETTINGS_KEY);
  if (!settings) return getDefaultSettings(); // Return defaults if no settings are found.

  try {
    const parsedSettings: NekofmSettings = JSON.parse(settings);
    return validateSettings(parsedSettings);
  } catch {
    // In case of an invalid setting structure, return default settings
    return getDefaultSettings();
  }
}

export function setSettings(settings: NekofmSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function validateSettings(settings: NekofmSettings): NekofmSettings {
  // Validate the 'nsfw' setting
  if (!["off", "blurred", "on"].includes(settings.nsfw)) {
    settings.nsfw = getDefaultSettings().nsfw; // Default to "off"
  }
  // Validate 'customCSS' as a boolean
  settings.customCSS =
    typeof settings.customCSS === "boolean"
      ? settings.customCSS
      : getDefaultSettings().customCSS;
  return settings;
}

export function deleteSettings(): void {
  localStorage.removeItem(SETTINGS_KEY);
}

export default {
  getDefaultSettings,
  getSettings,
  setSettings,
  validateSettings,
  deleteSettings,
};
