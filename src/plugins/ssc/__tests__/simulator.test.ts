import test from "node:test";
import assert from "node:assert/strict";
import { CGL_PROFILES } from "../registry/cgl";
import { CHSL_PROFILES } from "../registry/chsl";

// ----------------------------------------------------------------
// SSC Registry Tests
// ----------------------------------------------------------------

test("sscRegistry: CGL_PROFILES contains at least 2 entries", () => {
  assert.ok(CGL_PROFILES.length >= 2, `Expected >= 2 CGL profiles, got ${CGL_PROFILES.length}`);
});

test("sscRegistry: CHSL_PROFILES contains at least 3 entries", () => {
  assert.ok(CHSL_PROFILES.length >= 3, `Expected >= 3 CHSL profiles, got ${CHSL_PROFILES.length}`);
});

test("sscRegistry: all CGL profiles have SSC organization", () => {
  for (const p of CGL_PROFILES) {
    assert.strictEqual(p.organization, "SSC", `Profile ${p.id} should be SSC`);
  }
});

test("sscRegistry: all CHSL profiles have SSC organization", () => {
  for (const p of CHSL_PROFILES) {
    assert.strictEqual(p.organization, "SSC");
  }
});

test("sscRegistry: CGL DEST EN profile has correct qualifying speed", () => {
  const cglEn = CGL_PROFILES.find(p => p.language === "en");
  assert.ok(cglEn, "Should have an English CGL profile");
  assert.strictEqual(cglEn!.qualifyingSpeed, 35);
  assert.strictEqual(cglEn!.qualifyingAccuracy, 90);
});

test("sscRegistry: CGL DEST HI profile has lower qualifying speed", () => {
  const cglHi = CGL_PROFILES.find(p => p.language === "hi");
  assert.ok(cglHi, "Should have a Hindi CGL profile");
  assert.strictEqual(cglHi!.qualifyingSpeed, 30);
});

test("sscRegistry: CHSL DEO profile has KPH metadata", () => {
  const deo = CHSL_PROFILES.find(p => p.metadata?.mode === "DEO");
  assert.ok(deo, "Should have a DEO profile");
  assert.strictEqual(deo!.metadata?.qualifyingKPH, 8000);
});

test("sscRegistry: CHSL LDC EN profile has 10-minute duration", () => {
  const ldcEn = CHSL_PROFILES.find(p => p.language === "en" && p.metadata?.mode === "typing");
  assert.ok(ldcEn, "Should have an English LDC profile");
  assert.strictEqual(ldcEn!.duration, 10);
});

test("sscRegistry: all profiles have non-empty description", () => {
  for (const p of [...CGL_PROFILES, ...CHSL_PROFILES]) {
    assert.ok(
      typeof p.description === "string" && p.description.length > 10,
      `Profile ${p.id} should have a description`
    );
  }
});

test("sscRegistry: all profiles have typing test required", () => {
  const required = [...CGL_PROFILES, ...CHSL_PROFILES].filter(p => p.metadata?.mode !== "CPT");
  for (const p of required) {
    assert.strictEqual(
      p.typingTestRequired,
      true,
      `Profile ${p.post} should require a typing test`
    );
  }
});
