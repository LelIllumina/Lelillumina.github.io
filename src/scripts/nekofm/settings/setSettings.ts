interface NekofmSettings {
  nsfw: string;
  customCSS: boolean;
}

class NekofmSettingsManager {
  private static SETTINGS_KEY = "nekofmSettings";

  static getDefaultSettings(): NekofmSettings {
    return {
      nsfw: "off",
      customCSS: false,
    };
  }

  static getSettings(): NekofmSettings {
    const settings = localStorage.getItem(this.SETTINGS_KEY);
    if (!settings) return this.getDefaultSettings(); // Return defaults if no settings are found.

    try {
      const parsedSettings: NekofmSettings = JSON.parse(settings);
      return this.validateSettings(parsedSettings);
    } catch {
      // In case of an invalid setting structure, return default settings
      return this.getDefaultSettings();
    }
  }

  static setSettings(settings: NekofmSettings): void {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }

  static validateSettings(settings: NekofmSettings): NekofmSettings {
    // Validate the 'nsfw' setting
    if (!["off", "blurred", "on"].includes(settings.nsfw)) {
      settings.nsfw = this.getDefaultSettings().nsfw; // Default to "off"
    }
    // Validate 'customCSS' as a boolean
    settings.customCSS =
      typeof settings.customCSS === "boolean"
        ? settings.customCSS
        : this.getDefaultSettings().customCSS;
    return settings;
  }

  static deleteSettings(): void {
    localStorage.removeItem(this.SETTINGS_KEY);
  }
}

export default NekofmSettingsManager;
