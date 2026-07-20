import test from "node:test";
import assert from "node:assert";
import { customProvider } from "../services/customProvider";
import { PracticeConfig } from "../../types";

test("customProvider: rejects invalid mode", async () => {
  const config = { mode: "words", language: "en" } as PracticeConfig;
  await assert.rejects(
    async () => await customProvider.generate(config),
    /Invalid mode/
  );
});

test("customProvider: rejects invalid text", async () => {
  const config = { mode: "custom", language: "en", customText: "short" } as PracticeConfig;
  await assert.rejects(
    async () => await customProvider.generate(config),
    /validation failed/
  );
});

test("customProvider: generates valid content", async () => {
  const config = { 
    mode: "custom", 
    language: "en", 
    customText: "This is a properly formatted, valid custom text block." 
  } as PracticeConfig;
  
  const content = await customProvider.generate(config);
  
  assert.strictEqual(content.language, "en");
  assert.strictEqual(content.text, config.customText);
  assert.strictEqual(content.metadata?.category, "custom");
  assert.ok(content.id.startsWith("custom_"));
});
