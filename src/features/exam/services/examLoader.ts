// ============================================================
// EXAM LOADER
// Loads exam profiles from the PluginManager.
// ============================================================

import type { ExamProfile, ExamId, ExamOrganization } from "../types";
import { pluginManager } from "@/plugins";

/**
 * Lazily loads an exam profile by ID.
 * Returns undefined if no profile is registered for that ID.
 */
export function loadExamById(id: ExamId | string): ExamProfile | undefined {
  return pluginManager.getProfile(id);
}

/**
 * Loads all exam profiles for a given organization.
 */
export function loadExamsByOrganization(org: ExamOrganization | string): ExamProfile[] {
  return pluginManager.getAllProfiles().filter((p) => p.organization === org);
}

/**
 * Loads all registered exam profiles.
 */
export function loadAllExams(): ExamProfile[] {
  return pluginManager.getAllProfiles();
}

/**
 * Returns the list of organizations that have registered profiles.
 */
export function loadOrganizations(): string[] {
  const orgs = new Set(pluginManager.getAllPlugins().map((p) => p.organization));
  return Array.from(orgs);
}

/**
 * Returns distinct exam names within an organization.
 */
export function loadExamsForOrg(org: ExamOrganization | string): string[] {
  const profiles = loadExamsByOrganization(org);
  const examNames = new Set(profiles.map((p) => p.exam));
  return Array.from(examNames);
}

/**
 * Returns all profiles (posts) for a specific exam name in an organization.
 */
export function loadPostsForExam(org: ExamOrganization | string, examName: string): ExamProfile[] {
  return loadExamsByOrganization(org).filter((p) => p.exam === examName);
}
