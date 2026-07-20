export type FlagState = "Enabled" | "Disabled" | "Experimental" | "Internal";

export type FeatureFlagKey =
  | "new_dashboard"
  | "multiplayer_mode"
  | "advanced_analytics"
  | "developer_toolkit";

class FeatureFlagManager {
  private flags: Map<FeatureFlagKey, FlagState> = new Map([
    ["new_dashboard", "Enabled"],
    ["multiplayer_mode", "Experimental"],
    ["advanced_analytics", "Internal"],
    ["developer_toolkit", process.env.NODE_ENV === "development" ? "Enabled" : "Disabled"],
  ]);

  /**
   * Evaluates if a feature is enabled for the current environment.
   */
  public isEnabled(key: FeatureFlagKey): boolean {
    const state = this.flags.get(key);
    if (state === "Enabled") return true;
    if (state === "Internal" && process.env.NODE_ENV === "development") return true;
    return false;
  }

  /**
   * Gets the raw state of a feature flag.
   */
  public getState(key: FeatureFlagKey): FlagState | undefined {
    return this.flags.get(key);
  }

  /**
   * Overrides a flag state (useful for Dev Toolkit).
   */
  public setOverride(key: FeatureFlagKey, state: FlagState): void {
    this.flags.set(key, state);
  }

  public getAll(): Record<string, FlagState> {
    return Object.fromEntries(this.flags.entries());
  }
}

export const featureFlags = new FeatureFlagManager();
