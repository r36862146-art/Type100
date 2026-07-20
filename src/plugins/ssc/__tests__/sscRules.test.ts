import test from "node:test";
import assert from "node:assert/strict";
import { getRules, getRulesForExam, getDEORules, validateRules, getAllRuleKeys, getDefaultRules } from "../services/sscRules";

test("sscRules: getAllRuleKeys returns non-empty list", () => {
  const keys = getAllRuleKeys();
  assert.ok(keys.length >= 5, "Should have at least 5 rule configs");
});

test("sscRules: getRules returns a valid config for known key", () => {
  const rules = getRules("ssc_cgl_dest_en");
  assert.strictEqual(rules.targetSpeed, 35);
  assert.strictEqual(rules.duration, 15);
  assert.strictEqual(rules.qualifyingType, "wpm");
});

test("sscRules: getRules falls back to default for unknown key", () => {
  const rules = getRules("unknown_key_xyz");
  assert.ok(rules.targetSpeed > 0, "Should return a default config");
});

test("sscRules: getRulesForExam returns CGL EN rules correctly", () => {
  const rules = getRulesForExam("ssc_cgl", "en");
  assert.strictEqual(rules.targetSpeed, 35);
  assert.strictEqual(rules.duration, 15);
  assert.strictEqual(rules.qualifyingType, "wpm");
});

test("sscRules: getRulesForExam returns CGL HI rules with lower speed", () => {
  const rules = getRulesForExam("ssc_cgl", "hi");
  assert.strictEqual(rules.targetSpeed, 30);
});

test("sscRules: getRulesForExam returns CHSL EN rules", () => {
  const rules = getRulesForExam("ssc_chsl", "en");
  assert.strictEqual(rules.targetSpeed, 35);
  assert.strictEqual(rules.duration, 10);
});

test("sscRules: getDEORules returns KPH mode", () => {
  const rules = getDEORules();
  assert.strictEqual(rules.qualifyingType, "keystrokes_per_hour");
  assert.strictEqual(rules.targetKPH, 8000);
});

test("sscRules: validateRules returns empty array for valid rules", () => {
  const rules = getDefaultRules();
  const errors = validateRules(rules);
  assert.strictEqual(errors.length, 0, `Expected no errors, got: ${errors.join(", ")}`);
});

test("sscRules: validateRules catches zero targetSpeed", () => {
  const rules = { ...getDefaultRules(), targetSpeed: 0 };
  const errors = validateRules(rules);
  assert.ok(errors.some(e => e.includes("targetSpeed")));
});

test("sscRules: validateRules catches invalid accuracy", () => {
  const rules = { ...getDefaultRules(), targetAccuracy: 110 };
  const errors = validateRules(rules);
  assert.ok(errors.some(e => e.includes("targetAccuracy")));
});

test("sscRules: validateRules catches KPH mode without targetKPH", () => {
  const rules = { ...getDefaultRules(), qualifyingType: "keystrokes_per_hour" as const, targetKPH: undefined };
  const errors = validateRules(rules);
  assert.ok(errors.some(e => e.includes("targetKPH")));
});
