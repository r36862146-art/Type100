import test from "node:test";
import assert from "node:assert/strict";
import {
  getRules,
  getRulesForExam,
  getPracticeRules,
  validateRules,
  getAllRuleKeys,
  getDefaultRules,
  getPracticeModeLabel,
} from "../services/rrbRules";

// ----------------------------------------------------------------
// getAllRuleKeys
// ----------------------------------------------------------------

test("rrbRules: getAllRuleKeys returns non-empty list", () => {
  const keys = getAllRuleKeys();
  assert.ok(keys.length >= 4, `Expected >= 4 rule configs, got ${keys.length}`);
});

// ----------------------------------------------------------------
// getRules
// ----------------------------------------------------------------

test("rrbRules: getRules returns valid config for rrb_ntpc_en", () => {
  const rules = getRules("rrb_ntpc_en");
  assert.strictEqual(rules.targetWpm, 30);
  assert.strictEqual(rules.duration, 10);
  assert.strictEqual(rules.qualifyingType, "wpm");
  assert.strictEqual(rules.officialSimulation, true);
  assert.strictEqual(rules.autoSubmit, true);
});

test("rrbRules: getRules returns valid config for rrb_ntpc_hi", () => {
  const rules = getRules("rrb_ntpc_hi");
  assert.strictEqual(rules.targetWpm, 25);
  assert.ok(rules.languageOptions.includes("hi"), "Should include Hindi");
});

test("rrbRules: getRules returns valid config for rrb_typing_en", () => {
  const rules = getRules("rrb_typing_en");
  assert.strictEqual(rules.targetWpm, 40);
  assert.strictEqual(rules.targetAccuracy, 92);
});

test("rrbRules: getRules falls back to default for unknown key", () => {
  const rules = getRules("unknown_xyz_123");
  assert.ok(rules.targetWpm > 0, "Should return a default config");
});

// ----------------------------------------------------------------
// getRulesForExam
// ----------------------------------------------------------------

test("rrbRules: getRulesForExam returns NTPC EN rules for rrb_ntpc+en", () => {
  const rules = getRulesForExam("rrb_ntpc", "en");
  assert.strictEqual(rules.targetWpm, 30);
  assert.strictEqual(rules.duration, 10);
});

test("rrbRules: getRulesForExam returns NTPC HI rules for rrb_ntpc+hi", () => {
  const rules = getRulesForExam("rrb_ntpc", "hi");
  assert.strictEqual(rules.targetWpm, 25);
});

test("rrbRules: getRulesForExam returns typing rules for rrb_typing", () => {
  const rules = getRulesForExam("rrb_typing", "en");
  assert.strictEqual(rules.targetWpm, 40);
  assert.strictEqual(rules.targetAccuracy, 92);
});

// ----------------------------------------------------------------
// getPracticeRules
// ----------------------------------------------------------------

test("rrbRules: getPracticeRules returns practice config for EN", () => {
  const rules = getPracticeRules("en");
  assert.strictEqual(rules.officialSimulation, false);
  assert.strictEqual(rules.allowPause, true);
  assert.strictEqual(rules.allowRestart, true);
  assert.strictEqual(rules.autoSubmit, false);
});

test("rrbRules: getPracticeRules returns practice config for HI", () => {
  const rules = getPracticeRules("hi");
  assert.strictEqual(rules.officialSimulation, false);
  assert.ok(rules.languageOptions.includes("hi"));
});

// ----------------------------------------------------------------
// validateRules
// ----------------------------------------------------------------

test("rrbRules: validateRules returns empty array for valid config", () => {
  const rules = getDefaultRules();
  const errors = validateRules(rules);
  assert.strictEqual(
    errors.length,
    0,
    `Expected no errors, got: ${errors.join(", ")}`
  );
});

test("rrbRules: validateRules catches zero targetWpm", () => {
  const rules = { ...getDefaultRules(), targetWpm: 0 };
  const errors = validateRules(rules);
  assert.ok(errors.some((e) => e.includes("targetWpm")));
});

test("rrbRules: validateRules catches invalid targetAccuracy > 100", () => {
  const rules = { ...getDefaultRules(), targetAccuracy: 101 };
  const errors = validateRules(rules);
  assert.ok(errors.some((e) => e.includes("targetAccuracy")));
});

test("rrbRules: validateRules catches empty languageOptions", () => {
  const rules = { ...getDefaultRules(), languageOptions: [] as never[] };
  const errors = validateRules(rules);
  assert.ok(errors.some((e) => e.includes("languageOptions")));
});

test("rrbRules: validateRules catches zero duration", () => {
  const rules = { ...getDefaultRules(), duration: 0 };
  const errors = validateRules(rules);
  assert.ok(errors.some((e) => e.includes("duration")));
});

// ----------------------------------------------------------------
// getPracticeModeLabel
// ----------------------------------------------------------------

test("rrbRules: getPracticeModeLabel returns readable labels", () => {
  assert.strictEqual(
    getPracticeModeLabel("practice_unlimited"),
    "Unlimited Practice"
  );
  assert.strictEqual(
    getPracticeModeLabel("official_full"),
    "Official Full Test"
  );
  assert.strictEqual(
    getPracticeModeLabel("weak_numbers"),
    "Weak Area: Numbers"
  );
});
