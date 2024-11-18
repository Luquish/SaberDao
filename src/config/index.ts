import appConfigs from "./app.json";

/**
 * Currently loaded application.
 */
export const CURRENT_APP =
  process.env.REACT_APP_APP_CONFIG === "tribeca"
    ? "tribeca"
    : "saber";

export const APP_CONFIG = appConfigs[CURRENT_APP];

// Re-export the original config as SABER_CONFIG for backwards compatibility
export const SABER_CONFIG = appConfigs.saber;
