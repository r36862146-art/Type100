import { ResultsSnapshot } from "../types";
import { FeedbackBadge } from "./types";
import { STRINGS } from "./strings";

export function evaluateBadges(snapshot: ResultsSnapshot): FeedbackBadge[] {
  const badges: FeedbackBadge[] = [];

  // 100% Accuracy
  if (snapshot.accuracy === 100 && snapshot.totalCharacters > 0) {
    badges.push({ id: "accuracyMaster", ...STRINGS.badges.accuracyMaster });
  } else if (snapshot.accuracy >= 98) {
    badges.push({ id: "club98", ...STRINGS.badges.club98 });
  } else if (snapshot.accuracy >= 95) {
    badges.push({ id: "club95", ...STRINGS.badges.club95 });
  }

  // Speedster
  if (snapshot.wpm >= 100) {
    badges.push({ id: "speedster", ...STRINGS.badges.speedster });
  }

  // No Extra
  if (snapshot.extraCharacters === 0 && snapshot.totalCharacters > 0) {
    badges.push({ id: "noExtra", ...STRINGS.badges.noExtra });
  }

  // Typing Marathon
  if (snapshot.elapsedTime > 300000) { // > 5 minutes
    badges.push({ id: "typingMarathon", ...STRINGS.badges.typingMarathon });
  }

  // Consistency (Net WPM very close to Raw WPM)
  if (snapshot.wpm > 0 && snapshot.rawWpm > 0 && (snapshot.wpm / snapshot.rawWpm) >= 0.98) {
    badges.push({ id: "consistency", ...STRINGS.badges.consistency });
  }

  return badges;
}
