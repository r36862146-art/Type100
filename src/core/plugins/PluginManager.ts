import type { ExamPlugin } from "./types";
import type { ExamProfile } from "@/features/exam/types";

class PluginManager {
  private plugins: Map<string, ExamPlugin> = new Map();

  /**
   * Registers a new ExamPlugin into the system.
   */
  public register(plugin: ExamPlugin) {
    if (this.plugins.has(plugin.id)) {
      console.warn(`Plugin ${plugin.id} is already registered. Overwriting.`);
    }
    this.plugins.set(plugin.id, plugin);
  }

  /**
   * Retrieves a plugin by its ID.
   */
  public getPlugin(id: string): ExamPlugin | undefined {
    return this.plugins.get(id);
  }

  /**
   * Returns all registered plugins.
   */
  public getAllPlugins(): ExamPlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Returns all exam profiles across all plugins.
   */
  public getAllProfiles(): ExamProfile[] {
    return this.getAllPlugins().flatMap((plugin) => plugin.profiles);
  }

  /**
   * Retrieves a specific exam profile by its ID across all plugins.
   */
  public getProfile(examId: string): ExamProfile | undefined {
    for (const plugin of this.plugins.values()) {
      const profile = plugin.profiles.find((p) => p.id === examId);
      if (profile) return profile;
    }
    return undefined;
  }
  
  /**
   * Retrieves the plugin that owns a specific exam profile ID.
   */
  public getPluginForProfile(examId: string): ExamPlugin | undefined {
    for (const plugin of this.plugins.values()) {
      if (plugin.profiles.some((p) => p.id === examId)) {
        return plugin;
      }
    }
    return undefined;
  }
}

// Export a singleton instance
export const pluginManager = new PluginManager();
