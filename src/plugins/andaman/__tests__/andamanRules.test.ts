import test from "node:test";
import assert from "node:assert/strict";
import {
  getRules,
  getRulesForExam,
  getPracticeRules,
  getAllRuleKeys,
  validateRules,
  getDefaultRules,
  getPracticeModeLabel,
} from "../services/andamanRules";
import { ANDAMAN_INSTRUCTIONS } from "../assets/examBranding";

// ----------------------------------------------------------------
// Basic config retrieval
// ----------------------------------------------------------------

test("andamanRules: getAllRuleKeys returns non-empty list", () => {
  const keys = getAllRuleKeys();
  assert.ok(keys.length > 0, "Should have at least one rule key");
  assert.ok(keys.includes("andaman_chsl_en"));
  assert.ok(keys.includes("andaman_mts_en"));
});

test("andamanRules: getRules returns valid config for chsl_en", () => {
  const rules = getRules("andaman_chsl_en");
  assert.strictEqual(rules.targetWpm, 35);
  assert.strictEqual(rules.targetAccuracy, 90);
  assert.strictEqual(rules.duration, 10);
  assert.strictEqual(rules.officialSimulation, true);
});

test("andamanRules: getRules returns valid config for chsl_hi", () => {
  const rules = getRules("andaman_chsl_hi");
  assert.strictEqual(rules.targetWpm, 30);
  assert.strictEqual(rules.targetAccuracy, 90);
  assert.strictEqual(rules.duration, 10);
  assert.strictEqual(rules.officialSimulation, true);
});

test("andamanRules: getRules returns valid config for mts_en", () => {
  const rules = getRules("andaman_mts_en");
  assert.strictEqual(rules.targetWpm, 25); // MTS target
  assert.strictEqual(rules.targetAccuracy, 85);
  assert.strictEqual(rules.duration, 10);
  assert.strictEqual(rules.officialSimulation, false); // Practice-only
});

test("andamanRules: getRules falls back to default for unknown key", () => {
  const rules = getRules("invalid_key_xyz");
  const defaultRules = getDefaultRules();
  assert.deepStrictEqual(rules, defaultRules);
});

// ----------------------------------------------------------------
// getRulesForExam
// ----------------------------------------------------------------

test("andamanRules: getRulesForExam returns CHSL EN rules for chsl+en", () => {
  const rules = getRulesForExam("andaman_chsl" as never, "en");
  assert.strictEqual(rules.targetWpm, 35);
  assert.ok(rules.languageOptions.includes("en"));
});

test("andamanRules: getRulesForExam returns CHSL HI rules for chsl+hi", () => {
  const rules = getRulesForExam("andaman_chsl" as never, "hi");
  assert.strictEqual(rules.targetWpm, 30);
  assert.ok(rules.languageOptions.includes("hi"));
});

test("andamanRules: getRulesForExam returns MTS EN rules for mts", () => {
  const rules = getRulesForExam("andaman_mts" as never, "en");
  assert.strictEqual(rules.targetWpm, 25);
  assert.strictEqual(rules.officialSimulation, false);
});

test("andamanRules: getRulesForExam defaults to CHSL EN for unknown exam", () => {
  const rules = getRulesForExam("unknown_exam" as never, "en");
  assert.strictEqual(rules.targetWpm, 35);
});

// ----------------------------------------------------------------
// getPracticeRules
// ----------------------------------------------------------------

test("andamanRules: getPracticeRules returns practice config for EN", () => {
  const rules = getPracticeRules("en");
  assert.strictEqual(rules.duration, 5); // Practice is 5 mins
  assert.strictEqual(rules.allowPause, true);
  assert.strictEqual(rules.autoSubmit, false);
});

test("andamanRules: getPracticeRules returns practice config for HI", () => {
  const rules = getPracticeRules("hi");
  assert.strictEqual(rules.duration, 5);
  assert.strictEqual(rules.targetWpm, 30); // Hindi practice speed
});

// ----------------------------------------------------------------
// validateRules
// ----------------------------------------------------------------

test("andamanRules: validateRules returns empty array for valid config", () => {
  const valid = getDefaultRules();
  const errors = validateRules(valid);
  assert.deepStrictEqual(errors, []);
});

test("andamanRules: validateRules catches zero targetWpm", () => {
  const invalid = { ...getDefaultRules(), targetWpm: 0 };
  const errors = validateRules(invalid);
  assert.ok(errors.some((e) => e.includes("targetWpm")));
});

test("andamanRules: validateRules catches invalid targetAccuracy > 100", () => {
  const invalid = { ...getDefaultRules(), targetAccuracy: 105 };
  const errors = validateRules(invalid);
  assert.ok(errors.some((e) => e.includes("targetAccuracy")));
});

test("andamanRules: validateRules catches empty languageOptions", () => {
  const invalid = { ...getDefaultRules(), languageOptions: [] };
  const errors = validateRules(invalid);
  assert.ok(errors.some((e) => e.includes("languageOptions")));
});

test("andamanRules: validateRules catches zero duration", () => {
  const invalid = { ...getDefaultRules(), duration: 0 };
  const errors = validateRules(invalid);
  assert.ok(errors.some((e) => e.includes("duration")));
});

test("andamanRules: validateRules catches missing instructions", () => {
  const invalid = { ...getDefaultRules(), instructions: null as never };
  const errors = validateRules(invalid);
  assert.ok(errors.some((e) => e.includes("instructions")));
});

// ----------------------------------------------------------------
// getPracticeModeLabel
// ----------------------------------------------------------------

test("andamanRules: getPracticeModeLabel returns readable labels", () => {
  assert.strictEqual(
    getPracticeModeLabel("practice_unlimited"),
    "Unlimited Practice"
  );
  assert.strictEqual(
    getPracticeModeLabel("weak_long_words"),
    "Weak Area: Long Words"
  );
});

// ----------------------------------------------------------------
// Integration with Branding
// ----------------------------------------------------------------

test("andamanRules: rules contain correct branding instructions", () => {
  const chslRules = getRules("andaman_chsl_en");
  assert.deepStrictEqual(
    chslRules.instructions,
    ANDAMAN_INSTRUCTIONS["andaman_chsl"]
  );

  const mtsRules = getRules("andaman_mts_en");
  assert.deepStrictEqual(
    mtsRules.instructions,
    ANDAMAN_INSTRUCTIONS["andaman_mts"]
  );
});
